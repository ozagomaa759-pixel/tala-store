
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
  ImagePlus,
  Monitor,
  Smartphone,
  RefreshCw,
  Save,
  Upload,
  X,
  Layers3,
  ExternalLink,
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
  "w-full border border-[#e7e0d7] bg-white px-4 py-3 text-sm text-[#29251f] outline-none transition placeholder:text-[#b8aea2] focus:border-[#8b7965]";

const labelClass =
  "mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-[#887b6d]";

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
        <p className="mt-2 text-[11px] leading-5 text-[#a3988c]">
          {hint}
        </p>
      )}
    </div>
  );
}

function StatusMessage({
  type,
  children,
}: {
  type: "success" | "error";
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 border px-4 py-3 text-sm ${
        type === "success"
          ? "border-[#dce8d8] bg-[#f2f7ef] text-[#55734f]"
          : "border-[#f0d5d1] bg-[#fff5f3] text-[#a44f45]"
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

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setUploadingField(field);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", "categories");

      const response = await fetch("/api/admin/products/upload", {
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
    const currentIndex = categories.findIndex(
      (item) => item.id === category.id
    );

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= categories.length
    ) {
      return;
    }

    const current = categories[currentIndex];
    const target = categories[targetIndex];

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
    <main className="min-h-screen bg-[#f5f1eb] px-4 py-7 text-[#29251f] md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link
              href="/admin"
              className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#948779] transition hover:text-[#29251f]"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>

            <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#a18c75]">
              TALA / Store management
            </p>

            <h1 className="font-serif text-4xl tracking-tight md:text-6xl">
              Collection Studio
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#8d8175]">
              Control the visual identity of your collections.
              Create a consistent experience across desktop and mobile.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCategories()}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-[#ded5ca] bg-white px-5 py-3 text-[10px] uppercase tracking-[0.16em] transition hover:bg-[#eee8df] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh collections
          </button>
        </header>

        {error && (
          <div className="mb-5">
            <StatusMessage type="error">{error}</StatusMessage>
          </div>
        )}

        {success && (
          <div className="mb-5">
            <StatusMessage type="success">{success}</StatusMessage>
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-[#e7dfd5] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#948779]">
                Main collections
              </span>
              <Layers3 size={17} className="text-[#a18c75]" />
            </div>
            <p className="font-serif text-3xl">02</p>
            <p className="mt-1 text-xs text-[#a3988c]">
              Sets and Jackets
            </p>
          </div>

          <div className="border border-[#e7dfd5] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#948779]">
                Homepage visibility
              </span>
              <Eye size={17} className="text-[#a18c75]" />
            </div>
            <p className="font-serif text-3xl">
              {visibleCategories.length}
            </p>
            <p className="mt-1 text-xs text-[#a3988c]">
              Collections currently visible
            </p>
          </div>

          <div className="border border-[#e7dfd5] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#948779]">
                Storefront
              </span>
              <ExternalLink size={17} className="text-[#a18c75]" />
            </div>
            <Link
              href="/collections"
              target="_blank"
              className="inline-flex items-center gap-2 font-serif text-xl transition hover:text-[#8b7965]"
            >
              View collections
              <ExternalLink size={14} />
            </Link>
            <p className="mt-1 text-xs text-[#a3988c]">
              Open the live collection pages
            </p>
          </div>
        </section>

        <section className="mb-8 border border-[#e7dfd5] bg-white">
          <div className="border-b border-[#eee8df] px-5 py-5 md:px-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18c75]">
              01 / Collection selection
            </p>
            <h2 className="mt-2 font-serif text-2xl">
              Choose a collection to edit
            </h2>
            <p className="mt-1 text-xs leading-6 text-[#a3988c]">
              These are the permanent main collections of TALA.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-[#9b9084]">
              <RefreshCw
                size={19}
                className="mx-auto mb-3 animate-spin"
              />
              Loading collections...
            </div>
          ) : (
            <div className="grid gap-px bg-[#eee8df] md:grid-cols-2">
              {categories
                .filter((category) =>
                  CORE_COLLECTIONS.includes(category.slug.toLowerCase())
                )
                .map((category, index) => {
                  const selected = selectedId === category.id;
                  const busy = workingId === category.id;

                  return (
                    <article
                      key={category.id}
                      className={`bg-white p-5 transition md:p-6 ${
                        selected ? "ring-1 ring-inset ring-[#9b8874]" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="h-28 w-24 shrink-0 overflow-hidden bg-[#f2eee8]">
                          {category.image_url ? (
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#b3a797]">
                              <ImagePlus size={25} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-2xl">
                              {category.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-[9px] uppercase tracking-wider ${
                                category.is_active &&
                                category.show_on_homepage
                                  ? "bg-[#edf3e9] text-[#59734f]"
                                  : "bg-[#f1eee9] text-[#897e72]"
                              }`}
                            >
                              {category.is_active &&
                              category.show_on_homepage
                                ? "Visible"
                                : "Hidden"}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-[#a3988c]">
                            /collections/{category.slug}
                          </p>

                          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#8d8175]">
                            {category.headline ||
                              category.description ||
                              "No editorial headline added yet."}
                          </p>

                          <p className="mt-2 text-[10px] uppercase tracking-wider text-[#b0a598]">
                            Position {category.sort_order}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className={`flex-1 px-4 py-3 text-[10px] uppercase tracking-[0.15em] transition ${
                            selected
                              ? "bg-[#29251f] text-white"
                              : "border border-[#e7dfd5] bg-white hover:bg-[#f5f1eb]"
                          }`}
                        >
                          {selected ? "Currently editing" : "Edit collection"}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void toggleHomepage(category)}
                          className="inline-flex items-center gap-2 border border-[#e7dfd5] px-3 py-3 text-[10px] uppercase tracking-wider transition hover:bg-[#f5f1eb] disabled:opacity-40"
                        >
                          {category.show_on_homepage ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                          {category.show_on_homepage ? "Hide" : "Show"}
                        </button>

                        <div className="flex border border-[#e7dfd5]">
                          <button
                            type="button"
                            disabled={index === 0 || busy}
                            onClick={() =>
                              void updateOrder(category, "up")
                            }
                            aria-label={`Move ${category.name} up`}
                            className="p-3 transition hover:bg-[#f5f1eb] disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={
                              index ===
                                categories.filter((item) =>
                                  CORE_COLLECTIONS.includes(
                                    item.slug.toLowerCase()
                                  )
                                ).length -
                                  1 || busy
                            }
                            onClick={() =>
                              void updateOrder(category, "down")
                            }
                            aria-label={`Move ${category.name} down`}
                            className="border-l border-[#e7dfd5] p-3 transition hover:bg-[#f5f1eb] disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
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
            className="mb-8 border border-[#e7dfd5] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee8df] px-5 py-5 md:px-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18c75]">
                  02 / Editorial controls
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  Edit {selectedCategory.name}
                </h2>
                <p className="mt-1 text-xs text-[#a3988c]">
                  Customize the collection experience.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 border border-[#e7dfd5] px-4 py-2.5 text-[10px] uppercase tracking-wider transition hover:bg-[#f5f1eb]"
              >
                <X size={14} />
                Close editor
              </button>
            </div>

            <div className="space-y-9 p-5 md:p-7">
              <section>
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#a18c75]">
                    01 / Visibility
                  </p>
                  <h3 className="mt-2 font-serif text-xl">
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
                        updateField(
                          "sort_order",
                          Number(event.target.value)
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <div className="flex items-end">
                    <label className="flex w-full cursor-pointer items-center gap-3 border border-[#e7dfd5] px-4 py-3">
                      <input
                        type="checkbox"
                        checked={form.show_on_homepage}
                        onChange={(event) =>
                          updateField(
                            "show_on_homepage",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 accent-[#29251f]"
                      />
                      <span>
                        <span className="block text-sm">
                          Show on homepage
                        </span>
                        <span className="mt-1 block text-[11px] text-[#a3988c]">
                          Display this collection on the home page.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#eee8df] pt-8">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#a18c75]">
                    02 / Campaign imagery
                  </p>
                  <h3 className="mt-2 font-serif text-xl">
                    Collection photography
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#a3988c]">
                    Use a wide editorial image for desktop and a separate
                    portrait image for mobile when available.
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
                      <div className="overflow-hidden border border-[#e7dfd5] bg-[#f5f1eb]">
                        <div className="aspect-[16/9]">
                          {form.image_url ? (
                            <img
                              src={form.image_url}
                              alt="Desktop collection"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#aa9e90]">
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
                          className="inline-flex items-center gap-2 bg-[#29251f] px-4 py-3 text-[10px] uppercase tracking-wider text-white transition hover:bg-[#51483e] disabled:opacity-50"
                        >
                          {uploadingField === "image_url" ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Upload size={14} />
                          )}
                          Upload desktop
                        </button>

                        {form.image_url && (
                          <button
                            type="button"
                            onClick={() => updateField("image_url", "")}
                            className="border border-[#e7dfd5] px-4 py-3 text-[10px] uppercase tracking-wider"
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
                      <div className="mx-auto max-w-[300px] overflow-hidden border border-[#e7dfd5] bg-[#f5f1eb]">
                        <div className="aspect-[4/5]">
                          {form.mobile_image_url ? (
                            <img
                              src={form.mobile_image_url}
                              alt="Mobile collection"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#aa9e90]">
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
                          className="inline-flex items-center gap-2 border border-[#29251f] px-4 py-3 text-[10px] uppercase tracking-wider transition hover:bg-[#f5f1eb] disabled:opacity-50"
                        >
                          {uploadingField === "mobile_image_url" ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
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
                            className="border border-[#e7dfd5] px-4 py-3 text-[10px] uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </Field>
                  </div>
                </div>

                <p className="mt-5 text-[11px] leading-6 text-[#a3988c]">
                  Supported formats: JPG, PNG, WEBP and AVIF. Maximum
                  file size: 5 MB per image.
                </p>
              </section>

              <section className="border-t border-[#eee8df] pt-8">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#a18c75]">
                    03 / Editorial language
                  </p>
                  <h3 className="mt-2 font-serif text-xl">
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

              <section className="border-t border-[#eee8df] pt-8">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#a18c75]">
                    04 / Image treatment
                  </p>
                  <h3 className="mt-2 font-serif text-xl">
                    Overlay intensity
                  </h3>
                </div>

                <div className="border border-[#e7dfd5] bg-[#faf8f5] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-[#887b6d]">
                      Dark overlay
                    </span>
                    <span className="font-serif text-xl tabular-nums">
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
                    className="w-full accent-[#29251f]"
                  />

                  <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-[#a3988c]">
                    <span>Bright</span>
                    <span>Dramatic</span>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#eee8df] pt-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#a18c75]">
                      05 / Live preview
                    </p>
                    <h3 className="mt-2 font-serif text-xl">
                      Preview the collection
                    </h3>
                  </div>

                  <div className="flex border border-[#e7dfd5]">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider ${
                        previewMode === "desktop"
                          ? "bg-[#29251f] text-white"
                          : "text-[#887b6d]"
                      }`}
                    >
                      <Monitor size={14} />
                      Desktop
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`inline-flex items-center gap-2 border-l border-[#e7dfd5] px-4 py-2.5 text-[10px] uppercase tracking-wider ${
                        previewMode === "mobile"
                          ? "bg-[#29251f] text-white"
                          : "text-[#887b6d]"
                      }`}
                    >
                      <Smartphone size={14} />
                      Mobile
                    </button>
                  </div>
                </div>

                <div
                  className={`mx-auto overflow-hidden border border-[#e7dfd5] bg-[#d8cec1] ${
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
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#a99a89] to-[#554a40]">
                        <span className="font-serif text-4xl tracking-[8px] text-white/70">
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

                <p className="mt-3 text-center text-[10px] leading-5 text-[#a3988c]">
                  Preview only. Save changes to update the collection.
                </p>
              </section>

              <div className="flex flex-wrap gap-3 border-t border-[#eee8df] pt-6">
                <button
                  type="submit"
                  disabled={saving || uploadingField !== null}
                  className="inline-flex items-center gap-2 bg-[#29251f] px-7 py-3.5 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#51483e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? "Saving changes..." : "Save collection"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[#e7dfd5] px-6 py-3.5 text-[10px] uppercase tracking-[0.17em] transition hover:bg-[#f5f1eb]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#e3dbd0] pt-5 text-[9px] uppercase tracking-[0.18em] text-[#a3988c]">
          <span>TALA / LUXURY FASHION</span>
          <span>Collection Studio</span>
        </footer>
      </div>
    </main>
  );
}
