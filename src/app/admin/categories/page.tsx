
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  X,
  RefreshCw,
  Check,
  ImagePlus,
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
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
  name: string;
  slug: string;
  description: string;
  image_url: string;
  mobile_image_url: string;
  subtitle: string;
  headline: string;
  button_text: string;
  button_link: string;
  overlay_opacity: number;
  show_on_homepage: boolean;
  is_active: boolean;
  sort_order: number;
};

type ApiResponse = {
  success: boolean;
  error?: string;
  message?: string;
  categories?: Category[];
  category?: Category;
  url?: string;
};

type ImageField = "image_url" | "mobile_image_url";

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  mobile_image_url: "",
  subtitle: "",
  headline: "",
  button_text: "EXPLORE",
  button_link: "",
  overlay_opacity: 20,
  show_on_homepage: true,
  is_active: true,
  sort_order: 0,
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#88796c]">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-2 text-[11px] leading-5 text-[#a39485]">
          {hint}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-[#e2d9ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8c7863]";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] =
    useState<ImageField | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewMobile, setPreviewMobile] = useState(false);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const activeCategories = categories.filter(
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
        throw new Error(data.error || "Failed to load collections.");
      }

      const sorted = [...(data.categories ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order
      );

      setCategories(sorted);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

  function resetForm() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      sort_order: categories.length,
    });
    setError("");
    setSuccess("");
    setPreviewMobile(false);
  }

  function startEdit(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      mobile_image_url: category.mobile_image_url ?? "",
      subtitle: category.subtitle ?? "",
      headline: category.headline ?? "",
      button_text: category.button_text ?? "EXPLORE",
      button_link:
        category.button_link ??
        `/products?category=${category.slug}`,
      overlay_opacity: category.overlay_opacity ?? 20,
      show_on_homepage: category.show_on_homepage !== false,
      is_active: category.is_active,
      sort_order: category.sort_order ?? 0,
    });

    setError("");
    setSuccess("");
    setPreviewMobile(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      setSuccess(
        "Image uploaded. Save the collection to publish the change."
      );
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

    if (saving || uploadingField) return;

    const name = form.name.trim();

    if (!name) {
      setError("Please enter a collection name.");
      return;
    }

    const slug = createSlug(name);

    if (!slug) {
      setError("Please enter a valid collection name using English letters or numbers.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        name,
        slug,
        description: form.description.trim(),
        subtitle: form.subtitle.trim(),
        headline: form.headline.trim(),
        image_url: form.image_url.trim(),
        mobile_image_url: form.mobile_image_url.trim(),
        button_text: form.button_text.trim() || "EXPLORE",
        button_link: `/products?category=${slug}`,
        sort_order: Number(form.sort_order) || 0,
        overlay_opacity: Number(form.overlay_opacity),
      };

      const response = await fetch("/api/admin/categories", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId ? { ...payload, id: editingId } : payload
        ),
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save collection.");
      }

      setSuccess(
        editingId
          ? "Collection updated successfully."
          : "Collection created successfully."
      );

      setEditingId(null);
      setForm(EMPTY_FORM);

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(category: Category) {
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
          is_active: !category.is_active,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update collection.");
      }

      await loadCategories();
      setSuccess(
        category.is_active
          ? "Collection hidden successfully."
          : "Collection is now active."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setWorkingId(null);
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
        throw new Error(data.error || "Failed to update homepage visibility.");
      }

      await loadCategories();
      setSuccess("Homepage visibility updated.");
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

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setWorkingId(category.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/categories?id=${encodeURIComponent(category.id)}`,
        { method: "DELETE" }
      );

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete collection.");
      }

      if (editingId === category.id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }

      await loadCategories();
      setSuccess("Collection deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setWorkingId(null);
    }
  }

  const previewImage =
    previewMobile && form.mobile_image_url
      ? form.mobile_image_url
      : form.image_url;

  const previewTitle = form.headline.trim() || form.name || "TALA";
  const previewSubtitle =
    form.subtitle.trim() || "THE ART OF EVERYDAY ELEGANCE";

  return (
    <main className="min-h-screen bg-[#f4f0e9] px-4 py-8 text-[#302a25] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link
              href="/admin"
              className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#88796c] transition hover:text-[#302a25]"
            >
              <ArrowLeft size={15} />
              Back to dashboard
            </Link>

            <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#9b8874]">
              TALA / Store management
            </p>

            <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
              Collection Studio
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#88796c]">
              Shape the visual identity of every TALA collection.
              Manage imagery, editorial copy and storefront visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCategories()}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-[#d9cfc2] bg-white px-5 py-3 text-xs uppercase tracking-[0.14em] transition hover:bg-[#eee8df] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        <section className="mb-8 border border-[#e2d9ce] bg-[#eae3d9] p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#958474]">
                Storefront navigation
              </p>
              <h2 className="mt-2 font-serif text-2xl">
                Your collections
              </h2>
            </div>

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#958474]">
              {activeCategories.length} visible on homepage
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-[#d8cbbd] py-4">
            <span className="text-xs uppercase tracking-[0.2em]">
              All Pieces
            </span>

            {activeCategories.map((category) => (
              <span
                key={category.id}
                className="text-xs uppercase tracking-[0.2em] text-[#88796c]"
              >
                {category.name}
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs leading-6 text-[#88796c]">
            This preview reflects collections enabled for the homepage.
          </p>
        </section>

        {error && (
          <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <X size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 border border-[#d6e4d7] bg-[#f0f6ef] p-4 text-sm text-[#45684a]">
            <Check size={17} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <section className="mb-10 border border-[#e2d9ce] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee8df] px-5 py-5 md:px-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b8874]">
                Editorial controls
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                {editingId ? "Edit collection" : "Create a collection"}
              </h2>

              <p className="mt-1 text-xs text-[#948578]">
                Customize every detail of this collection section.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 border border-[#e2d9ce] px-4 py-2 text-xs uppercase tracking-wider transition hover:bg-[#f5f1eb]"
              >
                <X size={14} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-9 p-5 md:p-7">
            <div>
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18b70]">
                  01 / Collection identity
                </p>
                <h3 className="mt-2 font-serif text-xl">
                  Basic information
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Collection name">
                  <input
                    required
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm((current) => ({
                        ...current,
                        name,
                        slug: createSlug(name),
                      }));
                    }}
                    placeholder="Example: Sets"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Display order"
                  hint="Lower numbers appear first."
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

                <div className="flex flex-col justify-end gap-3">
                  <label className="flex cursor-pointer items-center gap-3 border border-[#e2d9ce] px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(event) =>
                        updateField("is_active", event.target.checked)
                      }
                      className="h-4 w-4 accent-[#76634f]"
                    />
                    Collection is active
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 border border-[#e2d9ce] px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={form.show_on_homepage}
                      onChange={(event) =>
                        updateField("show_on_homepage", event.target.checked)
                      }
                      className="h-4 w-4 accent-[#76634f]"
                    />
                    Show on homepage
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-[#eee8df] pt-8">
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18b70]">
                  02 / Visual direction
                </p>
                <h3 className="mt-2 font-serif text-xl">
                  Collection imagery
                </h3>
              </div>

              <input
                ref={desktopInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) =>
                  void handleImageUpload(event, "image_url")
                }
                className="hidden"
              />

              <input
                ref={mobileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) =>
                  void handleImageUpload(event, "mobile_image_url")
                }
                className="hidden"
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-[#88796c]">
                    <Monitor size={15} />
                    Desktop image
                  </div>

                  <div className="aspect-[16/10] overflow-hidden border border-[#e2d9ce] bg-[#f4f0e9]">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt="Desktop collection preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#a39485]">
                        <ImagePlus size={30} />
                        <span className="text-[10px] uppercase tracking-wider">
                          No desktop image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => desktopInputRef.current?.click()}
                      disabled={uploadingField !== null}
                      className="inline-flex items-center gap-2 bg-[#76634f] px-4 py-3 text-[10px] uppercase tracking-wider text-white transition hover:bg-[#5f4e3e] disabled:opacity-50"
                    >
                      {uploadingField === "image_url" ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      Upload desktop
                    </button>

                    {form.image_url && (
                      <button
                        type="button"
                        onClick={() => updateField("image_url", "")}
                        className="border border-[#e2d9ce] px-4 py-3 text-[10px] uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-[#88796c]">
                    <Smartphone size={15} />
                    Mobile image
                  </div>

                  <div className="mx-auto aspect-[4/5] max-w-[220px] overflow-hidden border border-[#e2d9ce] bg-[#f4f0e9]">
                    {form.mobile_image_url ? (
                      <img
                        src={form.mobile_image_url}
                        alt="Mobile collection preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#a39485]">
                        <ImagePlus size={30} />
                        <span className="px-3 text-center text-[10px] uppercase tracking-wider">
                          Uses desktop image if empty
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => mobileInputRef.current?.click()}
                      disabled={uploadingField !== null}
                      className="inline-flex items-center gap-2 border border-[#76634f] px-4 py-3 text-[10px] uppercase tracking-wider text-[#76634f] transition hover:bg-[#f4f0e9] disabled:opacity-50"
                    >
                      {uploadingField === "mobile_image_url" ? (
                        <RefreshCw size={14} className="animate-spin" />
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
                        className="border border-[#e2d9ce] px-4 py-3 text-[10px] uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-6 text-[#a39485]">
                JPG, PNG, WEBP or AVIF. Maximum file size: 5 MB per image.
              </p>
            </div>

            <div className="border-t border-[#eee8df] pt-8">
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18b70]">
                  03 / Editorial copy
                </p>
                <h3 className="mt-2 font-serif text-xl">
                  Words that define the collection
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Eyebrow / subtitle"
                  hint="A small line above the main title."
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
                      placeholder="Write a beautiful description..."
                      className={`${inputClass} resize-y leading-7`}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="border-t border-[#eee8df] pt-8">
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18b70]">
                  04 / Call to action
                </p>
                <h3 className="mt-2 font-serif text-xl">
                  Collection button
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Button text">
                  <input
                    value={form.button_text}
                    onChange={(event) =>
                      updateField("button_text", event.target.value)
                    }
                    placeholder="EXPLORE COLLECTION"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-[#eee8df] pt-8">
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18b70]">
                  05 / Image treatment
                </p>
                <h3 className="mt-2 font-serif text-xl">
                  Overlay darkness
                </h3>
              </div>

              <div className="border border-[#e2d9ce] bg-[#fcfaf7] p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#88796c]">
                    Dark overlay intensity
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
                  className="w-full accent-[#76634f]"
                />

                <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-[#a39485]">
                  <span>Bright</span>
                  <span>Dramatic</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#eee8df] pt-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#a18b70]">
                    06 / Live preview
                  </p>
                  <h3 className="mt-2 font-serif text-xl">
                    Preview your collection
                  </h3>
                </div>

                <div className="flex border border-[#e2d9ce]">
                  <button
                    type="button"
                    onClick={() => setPreviewMobile(false)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-wider ${
                      !previewMobile
                        ? "bg-[#302a25] text-white"
                        : "text-[#88796c]"
                    }`}
                  >
                    <Monitor size={14} />
                    Desktop
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMobile(true)}
                    className={`inline-flex items-center gap-2 border-l border-[#e2d9ce] px-4 py-2 text-[10px] uppercase tracking-wider ${
                      previewMobile
                        ? "bg-[#302a25] text-white"
                        : "text-[#88796c]"
                    }`}
                  >
                    <Smartphone size={14} />
                    Mobile
                  </button>
                </div>
              </div>

              <div
                className={`mx-auto overflow-hidden border border-[#e2d9ce] bg-[#d8cec1] ${
                  previewMobile
                    ? "max-w-[340px]"
                    : "max-w-4xl"
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    previewMobile ? "aspect-[4/5]" : "aspect-[16/8]"
                  }`}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Collection live preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#a99a89] to-[#554a40]">
                      <span className="font-serif text-3xl tracking-[8px] text-white/70">
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
                        previewMobile
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

              <p className="mt-3 text-center text-[10px] leading-5 text-[#a39485]">
                Preview only. Save your changes to update the stored collection.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#eee8df] pt-6">
              <button
                type="submit"
                disabled={saving || uploadingField !== null}
                className="inline-flex items-center gap-2 bg-[#302a25] px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#5c4d40] disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Create collection"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-[#e2d9ce] px-6 py-3.5 text-xs uppercase tracking-[0.16em] transition hover:bg-[#f5f1eb]"
              >
                {editingId ? "Discard changes" : "Clear form"}
              </button>
            </div>
          </form>
        </section>

        <section className="border border-[#e2d9ce] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee8df] px-5 py-5 md:px-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b8874]">
                Your store
              </p>
              <h2 className="mt-2 font-serif text-2xl">
                All collections
              </h2>
              <p className="mt-1 text-xs text-[#948578]">
                {categories.length} collections · {activeCategories.length} shown on homepage
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 border border-[#d9cfc2] px-4 py-3 text-xs uppercase tracking-[0.13em] transition hover:bg-[#f5f1eb]"
            >
              <Plus size={15} />
              New collection
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#948578]">
              <RefreshCw
                size={20}
                className="mx-auto mb-3 animate-spin"
              />
              Loading collections...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen
                size={34}
                className="mx-auto mb-4 text-[#b5a797]"
              />
              <h3 className="font-serif text-xl">
                No collections yet
              </h3>
              <p className="mt-2 text-sm text-[#948578]">
                Create your first collection to organize the store.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee8df]">
              {categories.map((category, index) => {
                const busy = workingId === category.id;
                const homepageVisible =
                  category.is_active && category.show_on_homepage;

                return (
                  <article
                    key={category.id}
                    className="flex flex-col gap-5 p-5 transition hover:bg-[#fcfaf7] md:flex-row md:items-center md:px-7"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#f4f0e9]">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#a39485]">
                            <FolderOpen size={24} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-xl">
                            {category.name}
                          </h3>

                          <span
                            className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] ${
                              homepageVisible
                                ? "bg-[#edf3ec] text-[#557452]"
                                : "bg-[#f0eeeb] text-[#877d73]"
                            }`}
                          >
                            {homepageVisible
                              ? "On homepage"
                              : "Not on homepage"}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-[#a39485]">
                          /{category.slug}
                        </p>

                        {category.headline && (
                          <p className="mt-2 text-xs text-[#88796c]">
                            {category.headline}
                          </p>
                        )}

                        <p className="mt-2 text-[10px] uppercase tracking-wider text-[#aa9b8c]">
                          Position {category.sort_order}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <div className="flex items-center border border-[#e2d9ce]">
                        <button
                          type="button"
                          disabled={index === 0 || busy}
                          onClick={() =>
                            void updateOrder(category, "up")
                          }
                          aria-label={`Move ${category.name} up`}
                          className="p-2.5 transition hover:bg-[#f4f0e9] disabled:opacity-30"
                        >
                          <ArrowUp size={15} />
                        </button>

                        <button
                          type="button"
                          disabled={index === categories.length - 1 || busy}
                          onClick={() =>
                            void updateOrder(category, "down")
                          }
                          aria-label={`Move ${category.name} down`}
                          className="border-l border-[#e2d9ce] p-2.5 transition hover:bg-[#f4f0e9] disabled:opacity-30"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void toggleHomepage(category)}
                        className="inline-flex items-center gap-2 border border-[#e2d9ce] px-3 py-2.5 text-[10px] uppercase tracking-wider transition hover:bg-[#f4f0e9] disabled:opacity-50"
                      >
                        {category.show_on_homepage ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {category.show_on_homepage
                          ? "Remove from home"
                          : "Add to home"}
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void toggleActive(category)}
                        className="inline-flex items-center gap-2 border border-[#e2d9ce] px-3 py-2.5 text-[10px] uppercase tracking-wider transition hover:bg-[#f4f0e9] disabled:opacity-50"
                      >
                        {category.is_active ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {category.is_active ? "Disable" : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="border border-[#e2d9ce] p-2.5 transition hover:bg-[#f4f0e9]"
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDelete(category)}
                        className="border border-red-100 p-2.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-7 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-[#a39485]">
          <span>TALA / Luxury Fashion</span>
          <span>Collection Studio</span>
        </footer>
      </div>
    </main>
  );
}
