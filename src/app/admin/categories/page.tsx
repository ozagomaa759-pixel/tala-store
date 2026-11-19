
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

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true,
  sort_order: 0,
};

const STARTER_CATEGORIES = ["Sets", "Jackets"];

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load categories.");
      }

      setCategories(data.categories || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
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
      setError("Please choose a JPG, PNG, WEBP or AVIF image.");
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

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || "Image upload failed.");
      }

      updateField("image_url", data.url);
      setSuccess("Category image uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active,
      sort_order: category.sort_order || 0,
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploadingImage) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim() || createSlug(form.name),
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save category.");
      }

      setSuccess(
        editingId
          ? "Category updated successfully."
          : "Category created successfully."
      );

      resetForm();
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update category.");
      }

      await loadCategories();
      setSuccess("Category status updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/categories?id=${encodeURIComponent(category.id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete category.");
      }

      await loadCategories();
      setSuccess("Category deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] px-4 py-8 text-[#332d28] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm text-[#88796c] transition hover:text-[#332d28]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-semibold tracking-tight">
              Categories
            </h1>

            <p className="mt-2 text-sm text-[#88796c]">
              Manage your TALA store categories.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[#ded5ca] bg-white px-4 py-3 text-sm transition hover:bg-[#eee7de] disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-[#e5dbcf] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <FolderOpen size={18} />
            <h2 className="font-semibold">TALA Categories</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {STARTER_CATEGORIES.map((name) => (
              <span
                key={name}
                className="rounded-full border border-[#d8c9b8] bg-[#f7f3ee] px-4 py-2 text-sm"
              >
                {name}
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs text-[#948578]">
            These are the two categories planned for the store.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-[#e5dbcf] bg-white p-5 md:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="mt-1 text-sm text-[#948578]">
                Add or update a store category.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 transition hover:bg-[#f5f1eb]"
                aria-label="Cancel editing"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category Name
                </label>

                <select
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
                  className="w-full rounded-xl border border-[#e2d9ce] bg-white px-4 py-3 outline-none focus:border-[#9b8874]"
                >
                  <option value="">Select category</option>
                  {STARTER_CATEGORIES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Slug
                </label>

                <input
                  required
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", event.target.value)
                  }
                  placeholder="category-name"
                  className="w-full rounded-xl border border-[#e2d9ce] px-4 py-3 outline-none focus:border-[#9b8874]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sort Order
                </label>

                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) =>
                    updateField("sort_order", Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-[#e2d9ce] px-4 py-3 outline-none focus:border-[#9b8874]"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium">
                Category Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-36 w-32 overflow-hidden rounded-xl border border-[#e2d9ce] bg-[#f5f1eb]">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9b8874]">
                      <ImagePlus size={28} />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 rounded-xl bg-[#76634f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5f4e3e] disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}

                    {uploadingImage ? "Uploading..." : "Choose Image"}
                  </button>

                  <p className="mt-3 text-xs leading-6 text-[#948578]">
                    Choose an image from your phone.
                    <br />
                    JPG, PNG, WEBP or AVIF — maximum 5 MB.
                  </p>

                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => updateField("image_url", "")}
                      className="mt-2 text-xs text-red-600 underline"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Category description..."
                className="w-full resize-y rounded-xl border border-[#e2d9ce] px-4 py-3 outline-none focus:border-[#9b8874]"
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  updateField("is_active", event.target.checked)
                }
                className="h-4 w-4 accent-[#796653]"
              />
              Active category
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="flex items-center gap-2 rounded-xl bg-[#76634f] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5f4e3e] disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Create Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#ded5ca] px-6 py-3 text-sm transition hover:bg-[#f5f1eb]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e5dbcf] bg-white">
          <div className="flex items-center justify-between border-b border-[#eee7df] p-5">
            <div>
              <h2 className="text-xl font-semibold">All Categories</h2>
              <p className="mt-1 text-sm text-[#948578]">
                {categories.length} categories found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-[#948578]">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center">
              <FolderOpen
                size={32}
                className="mx-auto mb-3 text-[#b5a797]"
              />
              <p className="font-medium">No categories yet</p>
              <p className="mt-2 text-sm text-[#948578]">
                Create Sets or Jackets to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee7df]">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f1eb]">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FolderOpen
                          size={20}
                          className="text-[#9b8874]"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {category.name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[#948578]">
                        {category.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(category)}
                      className={`rounded-full px-3 py-1.5 text-xs ${
                        category.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-lg border border-[#e2d9ce] p-2 transition hover:bg-[#f5f1eb]"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex items-center gap-2 text-xs text-[#948578]">
          <Plus size={14} />
          TALA Admin — Category Management
        </div>
      </div>
    </main>
  );
}
