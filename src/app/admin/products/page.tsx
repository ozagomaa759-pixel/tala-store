"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Upload,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug?: string;
  is_active?: boolean;
};

type Product = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  main_image?: string | null;
  images?: string[] | null;
  status: string;
  category_id?: string | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
};

type Notice = { type: "success" | "error"; text: string };

const inputClass =
  "mt-2 w-full border border-[#E5DACE] bg-white px-4 py-3 text-sm text-[#332A23] outline-none transition focus:border-[#A28A72]";
const labelClass = "text-xs uppercase tracking-[0.16em] text-[#8A7969]";

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [sizes, setSizes] = useState("S, M, L, XL");
  const [colorName, setColorName] = useState("Black");
  const [colorCode, setColorCode] = useState("#222222");
  const [stock, setStock] = useState("5");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.is_active !== false),
    [categories]
  );

  async function loadData() {
    setLoading(true);
    setNotice(null);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productsResponse.ok || productsData.success === false) {
        throw new Error(productsData.error || "Could not load products.");
      }
      if (!categoriesResponse.ok || categoriesData.success === false) {
        throw new Error(categoriesData.error || "Could not load categories.");
      }

      setProducts(Array.isArray(productsData.products) ? productsData.products : []);
      setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : []);
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong while loading.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  function resetForm() {
    setName("");
    setDescription("");
    setCategoryId(activeCategories[0]?.id || "");
    setPrice("");
    setCompareAtPrice("");
    setStatus("draft");
    setSizes("S, M, L, XL");
    setColorName("Black");
    setColorCode("#222222");
    setStock("5");
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const allowed = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
    );
    const tooLarge = allowed.find((file) => file.size > 5 * 1024 * 1024);
    if (files.length !== allowed.length) {
      setNotice({ type: "error", text: "Use JPG, PNG, WEBP, or AVIF images only." });
      return;
    }
    if (tooLarge) {
      setNotice({ type: "error", text: "Each image must be 5 MB or smaller." });
      return;
    }
    setSelectedFiles(allowed);
    setNotice(null);
  }

  async function uploadImage(file: File, productId: string): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    body.append("productId", productId);

    const response = await fetch("/api/upload", {
      method: "POST",
      body,
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.url) {
      throw new Error(data.error || `Could not upload ${file.name}.`);
    }
    return data.url as string;
  }

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const numericPrice = Number(price);
    const numericComparePrice = compareAtPrice.trim() ? Number(compareAtPrice) : null;
    const numericStock = Number(stock);
    const parsedSizes = Array.from(
      new Set(sizes.split(",").map((size) => size.trim()).filter(Boolean))
    );

    if (!name.trim() || !categoryId || !price.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setNotice({ type: "error", text: "Enter a product name, category, and a valid price." });
      return;
    }
    if (compareAtPrice.trim() && (numericComparePrice === null || !Number.isFinite(numericComparePrice) || numericComparePrice < numericPrice)) {
      setNotice({ type: "error", text: "Compare-at price must be a valid amount greater than or equal to the price." });
      return;
    }
    if (!parsedSizes.length || !Number.isInteger(numericStock) || numericStock < 0) {
      setNotice({ type: "error", text: "Enter at least one size and a valid stock quantity." });
      return;
    }
    if (!selectedFiles.length) {
      setNotice({ type: "error", text: "Add at least one product image before saving." });
      return;
    }

    setSaving(true);
    try {
      const createResponse = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: makeSlug(name),
          category_id: categoryId,
          description: description.trim(),
          price: numericPrice,
          compare_at_price: numericComparePrice,
          main_image: "",
          images: [],
          status,
          is_featured: false,
          is_best_seller: false,
          is_new_arrival: true,
          sort_order: 0,
        }),
      });
      const createdData = await createResponse.json();
      if (!createResponse.ok || !createdData.success || !createdData.product?.id) {
        throw new Error(createdData.error || "The product could not be created.");
      }

      const productId = createdData.product.id as string;
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        uploadedUrls.push(await uploadImage(file, productId));
      }

      const updateResponse = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          main_image: uploadedUrls[0],
          images: uploadedUrls,
        }),
      });
      const updatedData = await updateResponse.json();
      if (!updateResponse.ok || updatedData.success === false) {
        throw new Error(updatedData.error || "Product saved, but its images could not be attached.");
      }

      for (const size of parsedSizes) {
        const variantResponse = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            size,
            color: colorName.trim() || "Default",
            color_code: colorCode,
            stock_quantity: numericStock,
            is_active: true,
          }),
        });
        const variantData = await variantResponse.json();
        if (!variantResponse.ok || variantData.success === false) {
          throw new Error(
            `Product and images were saved, but size ${size} could not be added: ${
              variantData.error || "variant error"
            }`
          );
        }
      }

      setNotice({ type: "success", text: "Product, images, sizes, and stock were saved successfully." });
      setShowForm(false);
      resetForm();
      await loadData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Could not save this product.",
      });
      await loadData();
    } finally {
      setSaving(false);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-12 text-[#332A23] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#8A7969] transition hover:text-[#332A23]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-5">
          <div className="flex items-center gap-4">
            <Package size={34} strokeWidth={1} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#A28A72]">
                TALA Administration
              </p>
              <h1 className="mt-2 text-4xl font-light sm:text-5xl">Products</h1>
              <p className="mt-2 text-sm text-[#77695D]">
                Manage your collection, product photos, sizes, and stock.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm((current) => !current);
            }}
            className="inline-flex items-center gap-2 bg-[#332A23] px-5 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-[#59483B]"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Close Form" : "Add Product"}
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className={`mt-7 border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-[#B8C8B2] bg-[#F0F5ED] text-[#40563A]"
                : "border-[#D8B9AE] bg-[#FBF1EE] text-[#8A3E2D]"
            }`}
          >
            {notice.text}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleCreateProduct}
            className="mt-8 border border-[#E5DACE] bg-white/80 p-5 sm:p-8"
          >
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A28A72]">
                New collection item
              </p>
              <h2 className="mt-2 text-2xl font-light">Add a product</h2>
              <p className="mt-2 text-xs leading-6 text-[#77695D]">
                Add the product details, upload its photos, then enter the sizes and available stock.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}>
                Product name *
                <input
                  className={inputClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Classic Knit Set"
                  required
                />
              </label>

              <label className={labelClass}>
                Category *
                <select
                  className={inputClass}
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  required
                >
                  <option value="">Choose category</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Price *
                <input
                  className={inputClass}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="e.g. 1250"
                  required
                />
              </label>

              <label className={labelClass}>
                Compare-at price
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(event) => setCompareAtPrice(event.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className={labelClass}>
                Store status *
                <select
                  className={inputClass}
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="draft">Draft — hidden from store</option>
                  <option value="published">Published — visible in store</option>
                </select>
              </label>

              <label className={labelClass}>
                Description
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the fabric, fit, and details..."
                />
              </label>
            </div>

            <div className="mt-8 border-t border-[#E5DACE] pt-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-light">Product photos *</h3>
                  <p className="mt-1 text-xs text-[#8A7969]">
                    JPG, PNG, WEBP, or AVIF · up to 5 MB per image
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 border border-[#BCA995] px-4 py-2.5 text-xs uppercase tracking-wider"
                >
                  <ImagePlus size={16} />
                  Choose photos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleFiles}
                  className="hidden"
                />
              </div>

              {previews.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {previews.map((preview, index) => (
                    <div key={`${preview}-${index}`} className="relative aspect-[4/5] overflow-hidden bg-[#F1ECE5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover" />
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-wider">
                          Main photo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 flex min-h-36 w-full flex-col items-center justify-center border border-dashed border-[#CDBEAE] bg-[#FBF9F6] text-[#8A7969]"
                >
                  <Upload size={22} strokeWidth={1.3} />
                  <span className="mt-3 text-xs">Tap to select product photos</span>
                </button>
              )}
            </div>

            <div className="mt-8 border-t border-[#E5DACE] pt-7">
              <h3 className="text-lg font-light">Sizes, color & stock</h3>
              <p className="mt-1 text-xs text-[#8A7969]">
                One stock quantity will be assigned to each size for the selected color.
              </p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Sizes * (separate with commas)
                  <input
                    className={inputClass}
                    value={sizes}
                    onChange={(event) => setSizes(event.target.value)}
                    placeholder="S, M, L, XL"
                    required
                  />
                </label>
                <label className={labelClass}>
                  Stock per size *
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    required
                  />
                </label>
                <label className={labelClass}>
                  Color name
                  <input
                    className={inputClass}
                    value={colorName}
                    onChange={(event) => setColorName(event.target.value)}
                    placeholder="Black"
                  />
                </label>
                <label className={labelClass}>
                  Color code
                  <div className="mt-2 flex items-center gap-3 border border-[#E5DACE] bg-white px-3 py-2">
                    <input
                      type="color"
                      value={colorCode}
                      onChange={(event) => setColorCode(event.target.value)}
                      className="h-9 w-12 cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-sm text-[#77695D]">{colorCode}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-[#E5DACE] pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
                className="border border-[#CDBEAE] px-5 py-3 text-xs uppercase tracking-wider text-[#77695D] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#332A23] px-6 py-3 text-xs uppercase tracking-[0.15em] text-white disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {saving ? "Saving product..." : "Save product"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-9 border border-[#E5DACE] bg-white/70">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DACE] p-5 sm:px-7">
            <div>
              <h2 className="text-xl font-light">Your products</h2>
              <p className="mt-1 text-xs text-[#8A7969]">
                {products.length} product{products.length === 1 ? "" : "s"} in the database
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[#E5DACE] bg-white px-3">
                <Search size={15} className="text-[#9B8A7A]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="w-36 bg-transparent px-2 py-2.5 text-xs outline-none sm:w-48"
                />
              </div>
              <button
                type="button"
                onClick={() => void loadData()}
                aria-label="Refresh products"
                className="border border-[#E5DACE] p-2.5 text-[#77695D] hover:bg-white"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-[#8A7969]">
              <Loader2 size={18} className="animate-spin" />
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag size={30} strokeWidth={1} className="mx-auto text-[#B5A493]" />
              <p className="mt-4 text-sm text-[#77695D]">
                {search ? "No products match your search." : "No products yet. Add your first TALA item above."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EDE5DC]">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 sm:px-7">
                  <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#F1ECE5]">
                    {product.main_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.main_image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#B5A493]">
                        <ImagePlus size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm">{product.name}</h3>
                    <p className="mt-1 text-xs text-[#8A7969]">
                      EGP {Number(product.price || 0).toLocaleString("en-EG")}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9B8A7A]">
                      {product.status}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 border px-2.5 py-1 text-[9px] uppercase tracking-wider ${
                      product.status === "published"
                        ? "border-[#C4D0BE] text-[#53684B]"
                        : "border-[#D9CCBE] text-[#8A7969]"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-3 border-b border-[#A28A72] pb-2 text-xs uppercase tracking-widest"
        >
          <ShoppingBag size={15} />
          View Store Products
        </Link>
      </div>
    </main>
  );
}
