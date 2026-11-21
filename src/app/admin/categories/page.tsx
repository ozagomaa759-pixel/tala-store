
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ImagePlus,
  Layers3,
  Loader2,
  Monitor,
  RefreshCw,
  Save,
  Smartphone,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  subtitle: string | null;
  headline: string | null;
  button_text: string | null;
  button_link: string | null;
  overlay_opacity: number | null;
  show_on_homepage: boolean;
  is_active: boolean;
  sort_order: number;
};

type CategoryForm = {
  description: string;
  image_url: string;
  mobile_image_url: string;
  subtitle: string;
  headline: string;
  button_text: string;
  overlay_opacity: number;
  show_on_homepage: boolean;
  sort_order: number;
};

type ApiResponse = {
  success: boolean;
  error?: string;
  categories?: Category[];
  category?: Category;
  url?: string;
};

type ImageField = "image_url" | "mobile_image_url";

const CORE_COLLECTIONS = ["sets", "jackets"];

const EMPTY_FORM: CategoryForm = {
  description: "",
  image_url: "",
  mobile_image_url: "",
  subtitle: "",
  headline: "",
  button_text: "EXPLORE",
  overlay_opacity: 20,
  show_on_homepage: true,
  sort_order: 0,
};

const inputClass =
  "w-full rounded-xl border border-[#e7e5dc] bg-white px-4 py-3 text-sm text-[#292d25] outline-none transition placeholder:text-[#aaa99f] focus:border-[#929f76]";

const labelClass =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#858477]";

async function readResponse(response: Response): Promise<ApiResponse> {
  try {
    return (await response.json()) as ApiResponse;
  } catch {
    return {
      success: false,
      error: "The server returned an invalid response.",
    };
  }
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && (
        <p className="mt-2 text-[11px] leading-5 text-[#99988e]">
          {hint}
        </p>
      )}
    </div>
  );
}

function Notice({
  type,
  children,
}: {
  type: "success" | "error";
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        type === "success"
          ? "border-[#dce8d5] bg-[#f1f7ed] text-[#59734f]"
          : "border-[#f0d5d1] bg-[#fff3f1] text-[#a44f45]"
      }`}
    >
      {type === "success" ? (
        <Check size={16} className="mt-0.5 shrink-0" />
      ) : (
        <X size={16} className="mt-0.5 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] =
    useState<ImageField | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory =
    categories.find((category) => category.id === selectedId) ?? null;

  const visibleCategories = categories.filter(
    (category) => category.is_active && category.show_on_homepage
  );

  const coreCategories = categories
    .filter((category) =>
      CORE_COLLECTIONS.includes(category.slug.toLowerCase())
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load collections.");
      }

      const sorted = [...(data.categories ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order
      );

      setCategories(sorted);

      if (selectedId && !sorted.some((item) => item.id === selectedId)) {
        setSelectedId(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function updateField<K extends keyof CategoryForm>(
    field: K,
    value: CategoryForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(category: Category) {
    setSelectedId(category.id);

    setForm({
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      mobile_image_url: category.mobile_image_url ?? "",
      subtitle: category.subtitle ?? "",
      headline: category.headline ?? "",
      button_text: category.button_text || "EXPLORE",
      overlay_opacity: category.overlay_opacity ?? 20,
      show_on_homepage: category.show_on_homepage !== false,
      sort_order: category.sort_order ?? 0,
    });

    setError("");
    setSuccess("");
    setPreviewMode("desktop");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setPreviewMode("desktop");
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    field: ImageField
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, WEBP or AVIF image.");
      event.target.value = "";
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setUploadingField(field);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/categories/upload", {
        method: "POST",
        body: formData,
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || "Image upload failed.");
      }

      updateField(field, data.url);
      setSuccess("Image uploaded. Save the collection to publish it.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploadingField(null);
      event.target.value = "";
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCategory || saving || uploadingField) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const slug = selectedCategory.slug.toLowerCase();

    if (!CORE_COLLECTIONS.includes(slug)) {
      setError("Only the main TALA collections can be edited here.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        id: selectedCategory.id,
        description: form.description.trim(),
        image_url: form.image_url.trim() || null,
        mobile_image_url: form.mobile_image_url.trim() || null,
        subtitle: form.subtitle.trim(),
        headline: form.headline.trim(),
        button_text: form.button_text.trim() || "EXPLORE",
        button_link: `/collections/${slug}`,
        overlay_opacity: Number(form.overlay_opacity),
        show_on_homepage: form.show_on_homepage,
        sort_order: Number(form.sort_order),
      };

      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save collection.");
      }

      setSuccess(`${selectedCategory.name} has been updated successfully.`);
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleHomepage(category: Category) {
    setWorkingId(category.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: category.id,
          show_on_homepage: !category.show_on_homepage,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not update visibility.");
      }

      await loadCategories();

      setSuccess(
        category.show_on_homepage
          ? `${category.name} is now hidden from the homepage.`
          : `${category.name} is now visible on the homepage.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function updateOrder(
    category: Category,
    direction: "up" | "down"
  ) {
    const currentIndex = coreCategories.findIndex(
      (item) => item.id === category.id
    );

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= coreCategories.length
    ) {
      return;
    }

    const current = coreCategories[currentIndex];
    const target = coreCategories[targetIndex];

    setWorkingId(category.id);
    setError("");
    setSuccess("");

    try {
      const firstResponse = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: current.id,
          sort_order: target.sort_order,
        }),
      });

      const firstData = await readResponse(firstResponse);

      if (!firstResponse.ok || !firstData.success) {
        throw new Error(firstData.error || "Could not update order.");
      }

      const secondResponse = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: target.id,
          sort_order: current.sort_order,
        }),
      });

      const secondData = await readResponse(secondResponse);

      if (!secondResponse.ok || !secondData.success) {
        throw new Error(secondData.error || "Could not update order.");
      }

      await loadCategories();
      setSuccess("Collection order updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update order."
      );
      await loadCategories();
    } finally {
      setWorkingId(null);
    }
  }

  const previewImage =
    previewMode === "mobile" && form.mobile_image_url
      ? form.mobile_image_url
      : form.image_url;

  const previewTitle =
    form.headline.trim() || selectedCategory?.name || "TALA";

  const previewSubtitle =
    form.subtitle.trim() || "THE ART OF EVERYDAY ELEGANCE";

  return (
    <main className="min-h-screen bg-[#F5F3ED] px-4 py-7 text-[#292D25] md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link
              href="/admin"
              className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#929187] transition hover:text-[#292D25]"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>

            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#8B9278]">
              TALA / Store management
            </p>

            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Collection Studio<span className="text-[#AAB7A0]">.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#89877D]">
              Shape the visual identity of your collections and create
              a consistent experience across desktop and mobile.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCategories()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#DEDDD4] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition hover:border-[#292D25] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-5">
            <Notice type="error">{error}</Notice>
          </div>
        )}

        {success && (
          <div className="mb-5">
            <Notice type="success">{success}</Notice>
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E7E5DC] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#929187]">
                Main collections
              </span>
              <Layers3 size={18} className="text-[#8B9278]" />
            </div>
            <p className="text-3xl font-semibold tabular-nums">02</p>
            <p className="mt-1 text-xs text-[#929187]">Sets and Jackets</p>
          </div>

          <div className="rounded-2xl border border-[#E7E5DC] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#929187]">
                Homepage visibility
              </span>
              <Eye size={18} className="text-[#8B9278]" />
            </div>
            <p className="text-3xl font-semibold tabular-nums">
              {visibleCategories.length}
            </p>
            <p className="mt-1 text-xs text-[#929187]">
              Collections currently visible
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7E5DC] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#929187]">
                Storefront
              </span>
              <ExternalLink size={18} className="text-[#8B9278]" />
            </div>
            <Link
              href="/collections"
              target="_blank"
              className="inline-flex items-center gap-2 text-xl font-semibold transition hover:text-[#75845D]"
            >
              View collections
              <ExternalLink size={14} />
            </Link>
            <p className="mt-1 text-xs text-[#929187]">
              Open the live collection pages
            </p>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-2xl border border-[#E7E5DC] bg-white">
          <div className="border-b border-[#EEEDE7] px-5 py-5 md:px-7">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
              01 / Collection selection
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Choose a collection
            </h2>
            <p className="mt-1 text-xs leading-6 text-[#929187]">
              Select Sets or Jackets to edit its storefront experience.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#929187]">
              <Loader2 size={22} className="mx-auto mb-3 animate-spin" />
              Loading collections...
            </div>
          ) : coreCategories.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#929187]">
              No main collections were found.
            </div>
          ) : (
            <div className="grid gap-px bg-[#EEEDE7] md:grid-cols-2">
              {coreCategories.map((category, index) => {
                const selected = selectedId === category.id;
                const busy = workingId === category.id;

                return (
                  <article
                    key={category.id}
                    className={`bg-white p-5 transition md:p-7 ${
                      selected ? "ring-1 ring-inset ring-[#AAB7A0]" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F0EFE9]">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#A5A496]">
                            <ImagePlus size={25} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-semibold tracking-tight">
                            {category.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                              category.is_active &&
                              category.show_on_homepage
                                ? "bg-[#EDF3E9] text-[#59734F]"
                                : "bg-[#F1F0EA] text-[#89877D]"
                            }`}
                          >
                            {category.is_active &&
                            category.show_on_homepage
                              ? "Visible"
                              : "Hidden"}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#929187]">
                          /collections/{category.slug}
                        </p>

                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#89877D]">
                          {category.headline ||
                            category.description ||
                            "No editorial headline added yet."}
                        </p>

                        <p className="mt-3 text-[9px] uppercase tracking-wider text-[#AAA99F]">
                          Position {category.sort_order}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="flex-1 rounded-full bg-[#292D25] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#454A3D]"
                      >
                        Edit collection
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleHomepage(category)}
                        disabled={busy}
                        title={
                          category.show_on_homepage
                            ? "Hide from homepage"
                            : "Show on homepage"
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5DC] transition hover:bg-[#F5F3ED] disabled:opacity-40"
                      >
                        {busy ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : category.show_on_homepage ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => void updateOrder(category, "up")}
                        disabled={index === 0 || busy}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5DC] transition hover:bg-[#F5F3ED] disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void updateOrder(category, "down")}
                        disabled={index === coreCategories.length - 1 || busy}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5DC] transition hover:bg-[#F5F3ED] disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {selectedCategory && (
          <form
            onSubmit={handleSave}
            className="overflow-hidden rounded-2xl border border-[#E7E5DC] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEEDE7] px-5 py-5 md:px-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
                  02 / Editorial controls
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Edit {selectedCategory.name}
                </h2>
                <p className="mt-1 text-xs text-[#929187]">
                  Customize the collection experience.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-[#E7E5DC] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition hover:bg-[#F5F3ED]"
              >
                <X size={14} />
                Close editor
              </button>
            </div>

            <div className="space-y-9 p-5 md:p-8">
              <section>
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
                    01 / Visibility
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Storefront settings
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Display position"
                    hint="Lower numbers appear before higher numbers."
                  >
                    <input
                      type="number"
                      min={0}
                      value={form.sort_order}
                      onChange={(event) =>
                        updateField("sort_order", Number(event.target.value))
                      }
                      className={inputClass}
                    />
                  </Field>

                  <div className="flex items-end">
                    <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E7E5DC] px-4 py-3">
                      <input
                        type="checkbox"
                        checked={form.show_on_homepage}
                        onChange={(event) =>
                          updateField(
                            "show_on_homepage",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 accent-[#292D25]"
                      />
                      <span>
                        <span className="block text-sm font-medium">
                          Show on homepage
                        </span>
                        <span className="mt-1 block text-[11px] text-[#929187]">
                          Display this collection on the home page.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#EEEDE7] pt-8">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
                    02 / Campaign imagery
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Collection photography
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#929187]">
                    Use a wide image for desktop and a separate portrait
                    image for mobile.
                  </p>
                </div>

                <input
                  ref={desktopInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(event) =>
                    void handleImageUpload(event, "image_url")
                  }
                />

                <input
                  ref={mobileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(event) =>
                    void handleImageUpload(event, "mobile_image_url")
                  }
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Field
                      label="Desktop image"
                      hint="Recommended: landscape image, at least 1600px wide."
                    >
                      <div className="overflow-hidden rounded-xl border border-[#E7E5DC] bg-[#F5F3ED]">
                        <div className="aspect-[16/9]">
                          {form.image_url ? (
                            <img
                              src={form.image_url}
                              alt="Desktop collection"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#A5A496]">
                              <ImagePlus size={27} />
                              <span className="text-[10px] uppercase tracking-wider">
                                No desktop image
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => desktopInputRef.current?.click()}
                          disabled={uploadingField !== null}
                          className="inline-flex items-center gap-2 rounded-full bg-[#292D25] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#454A3D] disabled:opacity-50"
                        >
                          {uploadingField === "image_url" ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          Upload desktop
                        </button>

                        {form.image_url && (
                          <button
                            type="button"
                            onClick={() => updateField("image_url", "")}
                            className="rounded-full border border-[#E7E5DC] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </Field>
                  </div>

                  <div>
                    <Field
                      label="Mobile image"
                      hint="Recommended: portrait image, at least 900px tall."
                    >
                      <div className="mx-auto max-w-[300px] overflow-hidden rounded-xl border border-[#E7E5DC] bg-[#F5F3ED]">
                        <div className="aspect-[4/5]">
                          {form.mobile_image_url ? (
                            <img
                              src={form.mobile_image_url}
                              alt="Mobile collection"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#A5A496]">
                              <Smartphone size={27} />
                              <span className="text-[10px] uppercase tracking-wider">
                                No mobile image
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => mobileInputRef.current?.click()}
                          disabled={uploadingField !== null}
                          className="inline-flex items-center gap-2 rounded-full border border-[#292D25] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:bg-[#F5F3ED] disabled:opacity-50"
                        >
                          {uploadingField === "mobile_image_url" ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          Upload mobile
                        </button>

                        {form.mobile_image_url && (
                          <button
                            type="button"
                            onClick={() =>
                              updateField("mobile_image_url", "")
                            }
                            className="rounded-full border border-[#E7E5DC] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </Field>
                  </div>
                </div>

                <p className="mt-5 text-[11px] leading-6 text-[#929187]">
                  Supported formats: JPG, PNG, WEBP and AVIF. Maximum
                  file size: 5 MB per image.
                </p>
              </section>

              <section className="border-t border-[#EEEDE7] pt-8">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
                    03 / Editorial language
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    The collection story
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow / subtitle"
                    hint="A short line above the main heading."
                  >
                    <input
                      value={form.subtitle}
                      onChange={(event) =>
                        updateField("subtitle", event.target.value)
                      }
                      placeholder="THE ART OF EVERYDAY ELEGANCE"
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Main headline"
                    hint="The main title displayed over the image."
                  >
                    <input
                      value={form.headline}
                      onChange={(event) =>
                        updateField("headline", event.target.value)
                      }
                      placeholder="The New Collection"
                      className={inputClass}
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field
                      label="Collection description"
                      hint="A short editorial description for the collection."
                    >
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        placeholder="Write the story behind this collection..."
                        className={`${inputClass} resize-y leading-7`}
                      />
                    </Field>
                  </div>

                  <Field label="Button text">
                    <input
                      value={form.button_text}
                      onChange={(event) =>
                        updateField("button_text", event.target.value)
                      }
                      placeholder="EXPLORE"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </section>

              <section className="border-t border-[#EEEDE7] pt-8">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
                    04 / Image treatment
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Overlay intensity
                  </h3>
                </div>

                <div className="rounded-xl border border-[#E7E5DC] bg-[#F8F7F2] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-[#858477]">
                      Dark overlay
                    </span>
                    <span className="text-xl font-semibold tabular-nums">
                      {form.overlay_opacity}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={1}
                    value={form.overlay_opacity}
                    onChange={(event) =>
                      updateField(
                        "overlay_opacity",
                        Number(event.target.value)
                      )
                    }
                    className="w-full accent-[#292D25]"
                  />

                  <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-[#929187]">
                    <span>Bright</span>
                    <span>Dramatic</span>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#EEEDE7] pt-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9278]">
                      05 / Live preview
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">
                      Preview the collection
                    </h3>
                  </div>

                  <div className="flex rounded-full border border-[#E7E5DC] p-1">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${
                        previewMode === "desktop"
                          ? "bg-[#292D25] text-white"
                          : "text-[#858477]"
                      }`}
                    >
                      <Monitor size={14} />
                      Desktop
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${
                        previewMode === "mobile"
                          ? "bg-[#292D25] text-white"
                          : "text-[#858477]"
                      }`}
                    >
                      <Smartphone size={14} />
                      Mobile
                    </button>
                  </div>
                </div>

                <div
                  className={`mx-auto overflow-hidden rounded-2xl border border-[#E7E5DC] bg-[#D8CEC1] ${
                    previewMode === "mobile"
                      ? "max-w-[340px]"
                      : "max-w-4xl"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      previewMode === "mobile"
                        ? "aspect-[4/5]"
                        : "aspect-[16/8]"
                    }`}
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Collection preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#A99A89] to-[#554A40]">
                        <span className="text-4xl tracking-[8px] text-white/70">
                          TALA
                        </span>
                      </div>
                    )}

                    <div
                      className="absolute inset-0 bg-black"
                      style={{
                        opacity: form.overlay_opacity / 100,
                      }}
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                      <p className="mb-4 text-[9px] tracking-[4px]">
                        {previewSubtitle}
                      </p>

                      <h4
                        className={`font-light tracking-[4px] ${
                          previewMode === "mobile"
                            ? "text-3xl"
                            : "text-5xl md:text-6xl"
                        }`}
                      >
                        {previewTitle}
                      </h4>

                      {form.description && (
                        <p className="mt-4 max-w-md text-xs leading-6 text-white/90">
                          {form.description}
                        </p>
                      )}

                      <span className="mt-7 inline-flex items-center gap-3 border border-white/80 px-6 py-3 text-[9px] tracking-[3px]">
                        {form.button_text || "EXPLORE"}
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-[10px] leading-5 text-[#929187]">
                  Preview only. Save changes to update the collection.
                </p>
              </section>

              <div className="flex flex-wrap gap-3 border-t border-[#EEEDE7] pt-6">
                <button
                  type="submit"
                  disabled={saving || uploadingField !== null}
                  className="inline-flex items-center gap-2 rounded-full bg-[#292D25] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#454A3D] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? "Saving changes..." : "Save collection"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#E7E5DC] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-[#F5F3ED]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E1D8] pt-5 text-[9px] uppercase tracking-[0.18em] text-[#929187]">
          <span>TALA / LUXURY FASHION</span>
          <span className="inline-flex items-center gap-2">
            <Sparkles size={12} />
            Collection Studio
          </span>
        </footer>
      </div>
    </main>
  );
}
