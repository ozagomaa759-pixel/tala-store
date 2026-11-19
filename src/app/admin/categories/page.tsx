
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
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
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

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true,
  sort_order: 0,
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategories = categories.filter(
    (category) => category.is_active
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
        throw new Error(data.error || "Failed to load categories.");
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
  }

  function startEdit(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      is_active: category.is_active,
      sort_order: category.sort_order ?? 0,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
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

    setUploadingImage(true);

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

      updateField("image_url", data.url);
      setSuccess("Image uploaded. Save the category to publish it.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploadingImage || saving) return;

    const name = form.name.trim();

    if (!name) {
      setError("Please enter a category name.");
      return;
    }

    const slug = form.slug.trim() || createSlug(name);

    if (!slug) {
      setError("Please enter a valid category name or slug.");
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
        image_url: form.image_url.trim(),
        sort_order: Number(form.sort_order) || 0,
      };

      const response = await fetch("/api/admin/categories", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? { ...payload, id: editingId }
            : payload
        ),
      });

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save category.");
      }

      setSuccess(
        editingId
          ? "Category updated successfully."
          : "Category created successfully."
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
        throw new Error(data.error || "Failed to update category.");
      }

      await loadCategories();
      setSuccess(
        category.is_active
          ? "Category hidden successfully."
          : "Category is now active."
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
      setSuccess("Category order updated.");
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
        {
          method: "DELETE",
        }
      );

      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete category.");
      }

      if (editingId === category.id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }

      await loadCategories();
      setSuccess("Category deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f0e9] px-4 py-8 text-[#302a25] md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
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
              Collections
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#88796c]">
              Create and curate the collections displayed across
              your TALA storefront.
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

        {/* Store navigation preview */}
        <section className="mb-8 border border-[#e2d9ce] bg-[#eae3d9] p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#958474]">
                Storefront preview
              </p>
              <h2 className="mt-2 font-serif text-2xl">
                Collection navigation
              </h2>
            </div>

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#958474]">
              {activeCategories.length} active collections
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-[#d8cbbd] py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#302a25]">
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
            Active collection names are shown here as a preview.
            The live storefront must also be connected to these
            category records.
          </p>
        </section>

        {/* Alerts */}
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

        {/* Editor */}
        <section className="mb-10 border border-[#e2d9ce] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee8df] px-5 py-5 md:px-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b8874]">
                Collection editor
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                {editingId ? "Edit collection" : "Create a collection"}
              </h2>

              <p className="mt-1 text-xs text-[#948578]">
                Manage the collection name, image and description.
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

          <form
            onSubmit={handleSave}
            className="space-y-7 p-5 md:p-7"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#88796c]">
                  Collection name
                </label>

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
                  className="w-full border border-[#e2d9ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8c7863]"
                />

                <p className="mt-2 text-[11px] text-[#a39485]">
                  This name can appear in your store navigation.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#88796c]">
                  URL slug
                </label>

                <input
                  required
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", event.target.value)
                  }
                  placeholder="collection-name"
                  className="w-full border border-[#e2d9ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8c7863]"
                />

                <p className="mt-2 text-[11px] text-[#a39485]">
                  Used to identify the collection in the store.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#88796c]">
                  Display order
                </label>

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
                  className="w-full border border-[#e2d9ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8c7863]"
                />

                <p className="mt-2 text-[11px] text-[#a39485]">
                  Lower numbers appear first.
                </p>
              </div>

              <div className="flex items-end">
                <label className="flex min-h-[46px] w-full cursor-pointer items-center gap-3 border border-[#e2d9ce] px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      updateField("is_active", event.target.checked)
                    }
                    className="h-4 w-4 accent-[#76634f]"
                  />
                  <span>Show this collection in the store</span>
                </label>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="mb-3 block text-[10px] uppercase tracking-[0.18em] text-[#88796c]">
                Collection image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="aspect-[4/5] w-36 shrink-0 overflow-hidden border border-[#e2d9ce] bg-[#f4f0e9]">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Collection preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-[#a39485]">
                      <ImagePlus size={28} />
                      <span className="text-[10px] uppercase tracking-wider">
                        No image
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 bg-[#76634f] px-5 py-3 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-[#5f4e3e] disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <Upload size={15} />
                    )}
                    {uploadingImage ? "Uploading..." : "Choose image"}
                  </button>

                  <p className="max-w-sm text-xs leading-6 text-[#948578]">
                    Upload a collection photograph from your phone.
                    JPG, PNG, WEBP or AVIF. Maximum file size: 5 MB.
                  </p>

                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => updateField("image_url", "")}
                      className="text-xs text-red-600 underline"
                    >
                      Remove current image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#88796c]">
                Collection description
              </label>

              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Write the collection description..."
                className="w-full resize-y border border-[#e2d9ce] bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#8c7863]"
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#eee8df] pt-6">
              <button
                type="submit"
                disabled={saving || uploadingImage}
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

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[#e2d9ce] px-6 py-3.5 text-xs uppercase tracking-[0.16em] transition hover:bg-[#f5f1eb]"
                >
                  Discard changes
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Collections list */}
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
                {categories.length} collections · {activeCategories.length} active
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

                return (
                  <article
                    key={category.id}
                    className="flex flex-col gap-5 p-5 transition hover:bg-[#fcfaf7] md:flex-row md:items-center md:px-7"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="hidden text-[#b6a99b] sm:block">
                        <GripVertical size={18} />
                      </div>

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
                              category.is_active
                                ? "bg-[#edf3ec] text-[#557452]"
                                : "bg-[#f0eeeb] text-[#877d73]"
                            }`}
                          >
                            {category.is_active ? "Visible" : "Hidden"}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-[#a39485]">
                          /{category.slug}
                        </p>

                        {category.description && (
                          <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-5 text-[#88796c]">
                            {category.description}
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
                        onClick={() => void toggleActive(category)}
                        className="inline-flex items-center gap-2 border border-[#e2d9ce] px-3 py-2.5 text-[10px] uppercase tracking-wider transition hover:bg-[#f4f0e9] disabled:opacity-50"
                      >
                        {category.is_active ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {category.is_active ? "Hide" : "Show"}
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
          <span>Collection management</span>
        </footer>
      </div>
    </main>
  );
}
