
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const TIME_ZONE = "Africa/Cairo";
const PAGE_SIZE = 1000;

const PENDING_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "shipped",
] as const;

type AnalyticsOrder = {
  id: string;
  status: string | null;
  total: number | string | null;
  delivered_at: string | null;
};

type PeriodStats = {
  orders: number;
  revenue: number;
};

function getCairoDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

/**
 * Converts a Cairo local calendar date/time into a UTC Date.
 * The offset is calculated using Intl so daylight-saving
 * changes are handled without hardcoding UTC+2 or UTC+3.
 */
function cairoDateToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): Date {
  const desiredUtc = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  );

  let candidate = desiredUtc;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const local = getCairoDateParts(new Date(candidate));

    const representedUtc = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second
    );

    candidate += desiredUtc - representedUtc;
  }

  return new Date(candidate);
}

function getPeriodStarts(now: Date) {
  const cairoNow = getCairoDateParts(now);

  const today = cairoDateToUtc(
    cairoNow.year,
    cairoNow.month,
    cairoNow.day
  );

  // Monday is the first day of the week.
  const weekday = new Date(
    Date.UTC(
      cairoNow.year,
      cairoNow.month - 1,
      cairoNow.day
    )
  ).getUTCDay();

  const daysSinceMonday = (weekday + 6) % 7;

  const mondayCalendarDate = new Date(
    Date.UTC(
      cairoNow.year,
      cairoNow.month - 1,
      cairoNow.day - daysSinceMonday
    )
  );

  const week = cairoDateToUtc(
    mondayCalendarDate.getUTCFullYear(),
    mondayCalendarDate.getUTCMonth() + 1,
    mondayCalendarDate.getUTCDate()
  );

  const month = cairoDateToUtc(
    cairoNow.year,
    cairoNow.month,
    1
  );

  return { today, week, month };
}

function createEmptyStats(): PeriodStats {
  return {
    orders: 0,
    revenue: 0,
  };
}

function addOrder(
  stats: PeriodStats,
  order: AnalyticsOrder
) {
  stats.orders += 1;
  stats.revenue += Number(order.total ?? 0);
}

function errorResponse(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const supabase = createAdminClient();

    const allOrders: AnalyticsOrder[] = [];

    // Fetch in pages so Supabase's default row limit
    // does not silently truncate the analytics.
    let from = 0;

    while (true) {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, delivered_at")
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        console.error(
          "Admin analytics query:",
          error.message
        );

        return errorResponse(
          "Could not load sales analytics."
        );
      }

      const page = (data ?? []) as AnalyticsOrder[];

      allOrders.push(...page);

      if (page.length < PAGE_SIZE) {
        break;
      }

      from += PAGE_SIZE;
    }

    const now = new Date();
    const { today, week, month } = getPeriodStarts(now);

    const todayStats = createEmptyStats();
    const weekStats = createEmptyStats();
    const monthStats = createEmptyStats();
    const allTimeStats = createEmptyStats();

    let deliveredWithoutDate = 0;
    let pendingOrders = 0;
    let pendingValue = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    for (const order of allOrders) {
      const status = order.status?.toLowerCase() ?? "";

      if (status === "cancelled") {
        cancelledOrders += 1;
        continue;
      }

      if (status === "delivered") {
        deliveredOrders += 1;

        // All-time revenue includes every delivered order,
        // even historical orders without a delivery date.
        addOrder(allTimeStats, order);

        if (!order.delivered_at) {
          deliveredWithoutDate += 1;
          continue;
        }

        const deliveredDate = new Date(order.delivered_at);

        if (Number.isNaN(deliveredDate.getTime())) {
          deliveredWithoutDate += 1;
          continue;
        }

        if (deliveredDate >= today && deliveredDate <= now) {
          addOrder(todayStats, order);
        }

        if (deliveredDate >= week && deliveredDate <= now) {
          addOrder(weekStats, order);
        }

        if (deliveredDate >= month && deliveredDate <= now) {
          addOrder(monthStats, order);
        }

        continue;
      }

      if (
        PENDING_STATUSES.includes(
          status as (typeof PENDING_STATUSES)[number]
        )
      ) {
        pendingOrders += 1;
        pendingValue += Number(order.total ?? 0);
      }
    }

    return NextResponse.json(
      {
        success: true,
        timeZone: TIME_ZONE,
        currency: "EGP",

        sales: {
          today: todayStats,
          week: weekStats,
          month: monthStats,
          allTime: allTimeStats,
        },

        orders: {
          total: allOrders.length,
          delivered: deliveredOrders,
          pending: pendingOrders,
          cancelled: cancelledOrders,
          deliveredWithoutDate,
        },

        pending: {
          orders: pendingOrders,
          value: pendingValue,
        },

        generatedAt: now.toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin analytics GET:", error);

    return errorResponse(
      "Failed to load sales analytics."
    );
  }
}
