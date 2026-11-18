
"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  Pencil,
  Trash2,
  Star,
  Archive,
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

type Variant = {
  id?: string;
  size: string;
  color: string;
  color_code: string;
  stock_quantity: number;
  is_active: boolean;
};

type Notice = {
  type: "success" | "error";
  text: string;
};

const inputClass =
  "mt-2 w-full border border-[#E5DACE] bg-white px-4 py-3 text-sm text-[#332A23] outline-none transition focus:border-[#A28A72]";

const labelClass =
  "text-xs uppercase tracking-[0.16em] text-[#8A7969]";

const DEFAULT_VARIANTS: Variant[] = ["S", "M", "L", "XL", "XXL"].map(
  (size) => ({
    size,
    color: "Black",
    color_code: "#222222",
    stock_quantity: 5,
    is_active: true,
  })
);

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new Error(
      `The server returned an invalid response (HTTP ${response.status}).`
    );
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [status, setStatus] = useState("draft");

  const [variants, setVariants] = useState<Variant[]>([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");

  const activeCategories = useMemo(
    () => categories.filter((category) => category.is_active !== false),
    [categories]
  );

  const previews = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
    [selectedFiles]
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  async function loadData() {
    setLoading(true);

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);

      const productsData = await readJson(productsResponse);
      const categoriesData = await readJson(categoriesResponse);

      if (!productsResponse.ok || productsData.success === false) {
        throw new Error(productsData.error || "Could not load products.");
      }

      if (!categoriesResponse.ok || categoriesData.success === false) {
        throw new Error(categoriesData.error || "Could not load categories.");
      }

      setProducts(
        Array.isArray(productsData.products) ? productsData.products : []
      );

      setCategories(
        Array.isArray(categoriesData.categories)
          ? categoriesData.categories
          : []
      );
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while loading.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function resetForm() {
    setEditingProductId(null);
    setName("");
    setDescription("");
    setCategoryId(activeCategories[0]?.id || "");
    setPrice("");
    setCompareAtPrice("");
    setStatus("draft");

    setVariants(DEFAULT_VARIANTS.map((variant) => ({ ...variant })));
    setDeletedVariantIds([]);

    setSelectedFiles([]);
    setImageUrls([]);
    setMainImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function closeForm() {
    if (saving) return;
    setShowForm(false);
    resetForm();
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    const allowed = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        file.type
      )
    );

    const tooLarge = allowed.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (files.length !== allowed.length) {
      setNotice({
        type: "error",
        text: "Use JPG, PNG, WEBP, or AVIF images only.",
      });
      return;
    }

    if (tooLarge) {
      setNotice({
        type: "error",
        text: "Each image must be 5 MB or smaller.",
      });
      return;
    }

    setSelectedFiles((current) => [...current, ...allowed]);

    if (!mainImage && imageUrls.length === 0 && allowed.length > 0) {
      setMainImage("__first_new_image__");
    }

    setNotice(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadImage(
    file: File,
    productId: string
  ): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    body.append("productId", productId);

    const response = await fetch("/api/admin/products/upload", {
      method: "POST",
      body,
    });

    const data = await readJson(response);

    if (!response.ok || !data.success || !data.url) {
      throw new Error(
        data.error || `Could not upload "${file.name}" (HTTP ${response.status}).`
      );
    }

    if (typeof data.url !== "string" || !data.url.startsWith("http")) {
      throw new Error(
        `The upload response for "${file.name}" has an invalid image URL.`
      );
    }

    return data.url;
  }

  async function openEditForm(product: Product) {
    setNotice(null);
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/variants?product_id=${encodeURIComponent(product.id)}`,
        { cache: "no-store" }
      );

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not load product sizes.");
      }

      const existingImages = Array.from(
        new Set(
          [
            ...(Array.isArray(product.images) ? product.images : []),
            product.main_image,
          ].filter(
            (image): image is string =>
              typeof image === "string" && image.length > 0
          )
        )
      );

      setEditingProductId(product.id);
      setName(product.name);
      setDescription(product.description || "");
      setCategoryId(product.category_id || "");
      setPrice(String(product.price ?? ""));
      setCompareAtPrice(
        product.compare_at_price == null
          ? ""
          : String(product.compare_at_price)
      );
      setStatus(product.status || "draft");

      setImageUrls(existingImages);
      setMainImage(
        product.main_image && existingImages.includes(product.main_image)
          ? product.main_image
          : existingImages[0] || ""
      );

      setSelectedFiles([]);
      setDeletedVariantIds([]);

      const loadedVariants: Variant[] = Array.isArray(data.variants)
        ? data.variants.map((variant: {
            id: string;
            size: string | null;
            color: string | null;
            color_code: string | null;
            stock_quantity: number;
            is_active: boolean;
          }) => ({
            id: variant.id,
            size: variant.size || "",
            color: variant.color || "Black",
            color_code: variant.color_code || "#222222",
            stock_quantity: Number(variant.stock_quantity ?? 0),
            is_active: variant.is_active !== false,
          }))
        : [];

      setVariants(loadedVariants);
      setShowForm(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not open product editor.",
      });
    } finally {
      setSaving(false);
    }
  }

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string | number | boolean
  ) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  }

  function addVariant(size = "") {
    setVariants((current) => [
      ...current,
      {
        size,
        color: "Black",
        color_code: "#222222",
        stock_quantity: 5,
        is_active: true,
      },
    ]);
  }

  function removeVariant(index: number) {
    const variant = variants[index];

    if (variant.id) {
      setDeletedVariantIds((current) => [...current, variant.id!]);
    }

    setVariants((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function removeImage(url: string) {
    const remainingImages = imageUrls.filter((image) => image !== url);

    setImageUrls(remainingImages);

    if (mainImage === url) {
      setMainImage(remainingImages[0] || "");
    }
  }

  function removeNewFile(index: number) {
    setSelectedFiles((current) => {
      const remaining = current.filter((_, i) => i !== index);

      if (remaining.length === 0 && mainImage === "__first_new_image__") {
        setMainImage(imageUrls[0] || "");
      }

      return remaining;
    });
  }

  async function saveVariants(productId: string) {
    for (const variantId of deletedVariantIds) {
      const response = await fetch(
        `/api/admin/variants?id=${encodeURIComponent(variantId)}`,
        { method: "DELETE" }
      );

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not remove a product size.");
      }
    }

    for (const variant of variants) {
      if (!variant.size.trim()) {
        throw new Error("Every size must have a size name.");
      }

      if (
        !Number.isInteger(variant.stock_quantity) ||
        variant.stock_quantity < 0
      ) {
        throw new Error(`Invalid stock quantity for size ${variant.size}.`);
      }

      const payload = {
        product_id: productId,
        size: variant.size.trim(),
        color: variant.color.trim() || "Default",
        color_code: variant.color_code || null,
        stock_quantity: variant.stock_quantity,
        is_active: variant.is_active,
      };

      const response = await fetch("/api/admin/variants", {
        method: variant.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          variant.id ? { id: variant.id, ...payload } : payload
        ),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error || `Could not save size ${variant.size}.`
        );
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const numericPrice = Number(price);
    const numericComparePrice = compareAtPrice.trim()
      ? Number(compareAtPrice)
      : null;

    if (
      !name.trim() ||
      !categoryId ||
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setNotice({
        type: "error",
        text: "Enter a product name, category, and a valid price.",
      });
      return;
    }

    if (
      compareAtPrice.trim() &&
      (numericComparePrice === null ||
        !Number.isFinite(numericComparePrice) ||
        numericComparePrice < numericPrice)
    ) {
      setNotice({
        type: "error",
        text:
          "Compare-at price must be greater than or equal to the product price.",
      });
      return;
    }

    if (
      variants.length === 0 ||
      variants.some(
        (variant) =>
          !variant.size.trim() ||
          !Number.isInteger(variant.stock_quantity) ||
          variant.stock_quantity < 0
      )
    ) {
      setNotice({
        type: "error",
        text: "Add at least one valid size and enter a stock quantity of zero or more.",
      });
      return;
    }

    const variantKeys = variants.map(
      (variant) =>
        `${variant.size.trim().toLowerCase()}::${variant.color.trim().toLowerCase()}`
    );

    if (new Set(variantKeys).size !== variantKeys.length) {
      setNotice({
        type: "error",
        text: "The same size and color combination cannot be added twice.",
      });
      return;
    }

    if (editingProductId && imageUrls.length === 0 && selectedFiles.length === 0) {
      setNotice({
        type: "error",
        text: "A product must have at least one image.",
      });
      return;
    }

    if (!editingProductId && selectedFiles.length === 0) {
      setNotice({
        type: "error",
        text: "Add at least one product image before saving.",
      });
      return;
    }

    setSaving(true);

    try {
      let productId = editingProductId;

      if (editingProductId) {
        const updateResponse = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProductId,
            name: name.trim(),
            slug: makeSlug(name),
            category_id: categoryId,
            description: description.trim(),
            price: numericPrice,
            compare_at_price: numericComparePrice,
            status,
          }),
        });

        const updateData = await readJson(updateResponse);

        if (!updateResponse.ok || updateData.success === false) {
          throw new Error(
            updateData.error || "Could not update product details."
          );
        }
      } else {
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
            main_image: null,
            images: [],
            status,
            is_featured: false,
            is_best_seller: false,
            is_new_arrival: true,
            sort_order: 0,
          }),
        });

        const createdData = await readJson(createResponse);

        if (
          !createResponse.ok ||
          !createdData.success ||
          !createdData.product?.id
        ) {
          throw new Error(
            createdData.error || "The product could not be created."
          );
        }

        productId = createdData.product.id as string;
      }

      if (!productId) {
        throw new Error("Product ID is missing.");
      }

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const uploadedUrl = await uploadImage(file, productId);
        uploadedUrls.push(uploadedUrl);
      }

      const finalImages = Array.from(
        new Set([...imageUrls, ...uploadedUrls])
      );

      if (finalImages.length === 0) {
        throw new Error("No product images are available to save.");
      }

      let finalMainImage = mainImage;

      if (
        !finalMainImage ||
        finalMainImage === "__first_new_image__" ||
        !finalImages.includes(finalMainImage)
      ) {
        finalMainImage = finalImages[0];
      }

      const imageResponse = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          main_image: finalMainImage,
          images: finalImages,
        }),
      });

      const imageData = await readJson(imageResponse);

      if (!imageResponse.ok || imageData.success === false) {
        throw new Error(
          imageData.error ||
            `The images could not be saved to the product (HTTP ${imageResponse.status}).`
        );
      }

      const savedProduct = imageData.product;

      if (!savedProduct) {
        throw new Error(
          "The image API did not return the updated product. The images may not have been saved."
        );
      }

      if (
        savedProduct.main_image !== finalMainImage ||
        !Array.isArray(savedProduct.images) ||
        finalImages.some((url) => !savedProduct.images.includes(url))
      ) {
        throw new Error(
          "The server response does not confirm that all product images were saved. Please try again."
        );
      }

      await saveVariants(productId);

      setNotice({
        type: "success",
        text: editingProductId
          ? "Product, photos, sizes, and stock updated successfully."
          : "Product, photos, sizes, and stock created successfully.",
      });

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not save this product.",
      });

      await loadData();
    } finally {
      setSaving(false);
    }
  }

  async function toggleProductStatus(product: Product) {
    const nextStatus =
      product.status === "published" ? "draft" : "published";

    const confirmed = window.confirm(
      nextStatus === "published"
        ? `Publish "${product.name}"? It will become visible in the store.`
        : `Move "${product.name}" to Draft? It will be hidden from the store.`
    );

    if (!confirmed) return;

    setNotice(null);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          status: nextStatus,
        }),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not change product status.");
      }

      setNotice({
        type: "success",
        text:
          nextStatus === "published"
            ? "Product published successfully."
            : "Product moved to Draft successfully.",
      });

      await loadData();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not change product status.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setNotice(null);
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products?id=${encodeURIComponent(product.id)}`,
        { method: "DELETE" }
      );

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not delete product.");
      }

      setNotice({
        type: "success",
        text: `"${product.name}" was deleted successfully.`,
      });

      await loadData();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not delete product.",
      });
    } finally {
      setSaving(false);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const publishedProducts = filteredProducts.filter(
    (product) => product.status === "published"
  );

  const draftProducts = filteredProducts.filter(
    (product) => product.status === "draft"
  );

  const archivedProducts = filteredProducts.filter(
    (product) => product.status === "archived"
  );

  function ProductImage({ product }: { product: Product }) {
    const image = product.main_image || product.images?.[0];

    return (
      <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#F1ECE5]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#B5A493]">
            <ImagePlus size={20} />
          </div>
        )}
      </div>
    );
  }

  function ProductRow({
    product,
    section,
  }: {
    product: Product;
    section: "published" | "draft" | "archived";
  }) {
    return (
      <div
        key={product.id}
        className="flex flex-wrap items-center gap-4 p-4 sm:px-7"
      >
        <ProductImage product={product} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm">{product.name}</h3>

          <p className="mt-1 text-xs text-[#8A7969]">
            EGP {Number(product.price || 0).toLocaleString("en-EG")}
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9B8A7A]">
            {section === "published"
              ? "Published · Visible in store"
              : section === "draft"
                ? "Draft · Hidden from store"
                : "Archived"}
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button
            type="button"
            disabled={saving}
            onClick={() => void openEditForm(product)}
            className="inline-flex items-center gap-2 border border-[#BCA995] px-3 py-2 text-[10px] uppercase tracking-wider text-[#59483B] disabled:opacity-50"
          >
            <Pencil size={13} />
            Edit
          </button>

          {section === "published" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void toggleProductStatus(product)}
              className="border border-[#BCA995] px-3 py-2 text-[10px] uppercase tracking-wider text-[#59483B] disabled:opacity-50"
            >
              Move to Draft
            </button>
          )}

          {section === "draft" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void toggleProductStatus(product)}
              className="border border-[#53684B] bg-[#53684B] px-4 py-2 text-[10px] uppercase tracking-wider text-white disabled:opacity-50"
            >
              Publish
            </button>
          )}

          {section === "archived" && (
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void toggleProductStatus({
                  ...product,
                  status: "draft",
                })
              }
              className="border border-[#BCA995] px-3 py-2 text-[10px] uppercase tracking-wider text-[#59483B] disabled:opacity-50"
            >
              Move to Draft
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => void deleteProduct(product)}
            className="inline-flex items-center gap-2 border border-[#D8B9AE] px-3 py-2 text-[10px] uppercase tracking-wider text-[#8A3E2D] disabled:opacity-50"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    );
  }

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

              <h1 className="mt-2 text-4xl font-light sm:text-5xl">
                Products
              </h1>

              <p className="mt-2 text-sm text-[#77695D]">
                Manage your collection, product photos, sizes, and stock.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                closeForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#332A23] px-5 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-[#59483B] disabled:opacity-50"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Close Form" : "Add Product"}
          </button>
        </div>

        {notice && (
          <div
            role="status"
            aria-live="polite"
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
            onSubmit={handleSubmit}
            className="mt-8 border border-[#E5DACE] bg-white/80 p-5 sm:p-8"
          >
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#A28A72]">
                  {editingProductId
                    ? "Edit collection item"
                    : "New collection item"}
                </p>

                <h2 className="mt-2 text-2xl font-light">
                  {editingProductId ? "Edit product" : "Add a product"}
                </h2>

                <p className="mt-2 text-xs leading-6 text-[#77695D]">
                  {editingProductId
                    ? "Update product information, photos, sizes, and stock."
                    : "Add the product details, upload its photos, then enter the sizes and available stock."}
                </p>
              </div>

              {editingProductId && (
                <span className="border border-[#D9CCBE] px-3 py-2 text-[10px] uppercase tracking-wider text-[#8A7969]">
                  Editing existing product
                </span>
              )}
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
                  <option value="published">
                    Published — visible in store
                  </option>
                  <option value="archived">Archived</option>
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
                  Add photos
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

              {imageUrls.length > 0 || previews.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imageUrls.map((url) => (
                    <div
                      key={url}
                      className="relative aspect-[4/5] overflow-hidden bg-[#F1ECE5]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="Product photo"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => setMainImage(url)}
                        className={`absolute left-2 top-2 flex items-center gap-1 px-2 py-1 text-[9px] uppercase ${
                          mainImage === url
                            ? "bg-[#332A23] text-white"
                            : "bg-white/90 text-[#332A23]"
                        }`}
                      >
                        <Star size={11} />
                        {mainImage === url ? "Cover" : "Set cover"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute right-2 top-2 bg-white/90 p-1.5 text-[#8A3E2D]"
                        aria-label="Remove image"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  {previews.map((preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="relative aspect-[4/5] overflow-hidden bg-[#F1ECE5]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`New product photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-wider">
                        New photo
                      </span>

                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        className="absolute right-2 top-2 bg-white/90 p-1.5 text-[#8A3E2D]"
                        aria-label="Remove new photo"
                      >
                        <X size={13} />
                      </button>
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

                  <span className="mt-3 text-xs">
                    Tap to select product photos
                  </span>
                </button>
              )}

              <p className="mt-3 text-xs text-[#8A7969]">
                The selected cover photo will appear in the product list and
                store. If no cover is selected, the first available photo will
                be used.
              </p>
            </div>

            <div className="mt-8 border-t border-[#E5DACE] pt-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-light">
                    Sizes, color & stock
                  </h3>

                  <p className="mt-1 text-xs text-[#8A7969]">
                    Manage each size and its stock quantity separately.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => addVariant()}
                    className="inline-flex items-center gap-2 border border-[#BCA995] px-4 py-2.5 text-xs uppercase tracking-wider"
                  >
                    <Plus size={15} />
                    Add size
                  </button>

                  <button
                    type="button"
                    onClick={() => addVariant("One Size")}
                    className="border border-[#BCA995] px-4 py-2.5 text-xs uppercase tracking-wider"
                  >
                    Add One Size
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {variants.length === 0 && (
                  <p className="border border-dashed border-[#CDBEAE] bg-[#FBF9F6] p-5 text-sm text-[#8A7969]">
                    No sizes have been added. Add a size or choose One Size.
                  </p>
                )}

                {variants.map((variant, index) => (
                  <div
                    key={variant.id || `new-${index}`}
                    className="grid gap-3 border border-[#E5DACE] bg-[#FBF9F6] p-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <label className={labelClass}>
                      Size

                      <input
                        className={inputClass}
                        value={variant.size}
                        onChange={(event) =>
                          updateVariant(index, "size", event.target.value)
                        }
                        placeholder="S, M, XL or One Size"
                      />
                    </label>

                    <label className={labelClass}>
                      Color name

                      <input
                        className={inputClass}
                        value={variant.color}
                        onChange={(event) =>
                          updateVariant(index, "color", event.target.value)
                        }
                        placeholder="Black"
                      />
                    </label>

                    <label className={labelClass}>
                      Stock quantity

                      <input
                        className={inputClass}
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stock_quantity}
                        onChange={(event) =>
                          updateVariant(
                            index,
                            "stock_quantity",
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value)
                          )
                        }
                      />
                    </label>

                    <div className="flex items-end justify-between gap-3">
                      <label className={labelClass}>
                        Color code

                        <input
                          className={`${inputClass} h-12 p-1`}
                          type="color"
                          value={variant.color_code || "#222222"}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              "color_code",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="mb-1 border border-[#D8B9AE] p-3 text-[#8A3E2D]"
                        aria-label="Remove size"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2 lg:col-span-4">
                      <label className="flex items-center gap-2 text-xs text-[#77695D]">
                        <input
                          type="checkbox"
                          checked={variant.is_active}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              "is_active",
                              event.target.checked
                            )
                          }
                        />
                        Available for sale
                      </label>

                      {variant.stock_quantity === 0 ? (
                        <span className="text-xs font-semibold tracking-wider text-[#9A5145]">
                          ✕ SOLD OUT
                        </span>
                      ) : (
                        <span className="text-xs text-[#71836B]">
                          {variant.stock_quantity} IN STOCK
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-[#E5DACE] pt-6">
              <button
                type="button"
                onClick={closeForm}
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
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : editingProductId ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={16} />
                )}

                {saving
                  ? "Saving..."
                  : editingProductId
                    ? "Save changes"
                    : "Save product"}
              </button>
            </div>
          </form>
        )}

        {/* Search and refresh */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A28A72]">
              Product management
            </p>

            <h2 className="mt-2 text-2xl font-light">
              Your Collection
            </h2>

            <p className="mt-1 text-xs text-[#8A7969]">
              {products.length} total product(s) in the database
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
              className="border border-[#E5DACE] bg-white p-2.5 text-[#77695D] hover:bg-[#F8F5F0]"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-7 flex items-center justify-center gap-3 border border-[#E5DACE] bg-white/70 p-12 text-sm text-[#8A7969]">
            <Loader2 size={18} className="animate-spin" />
            Loading products...
          </div>
        ) : (
          <div className="mt-7 space-y-7">
            {/* Published products */}
            <section className="border border-[#E5DACE] bg-white/70">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DACE] p-5 sm:px-7">
                <div>
                  <h2 className="text-xl font-light">
                    Published Products
                  </h2>

                  <p className="mt-1 text-xs text-[#8A7969]">
                    Products currently visible in your store
                  </p>
                </div>

                <span className="border border-[#C4D0BE] px-3 py-1.5 text-xs text-[#53684B]">
                  {publishedProducts.length} Published
                </span>
              </div>

              {publishedProducts.length === 0 ? (
                <div className="p-10 text-center">
                  <ShoppingBag
                    size={28}
                    strokeWidth={1}
                    className="mx-auto text-[#B5A493]"
                  />

                  <p className="mt-3 text-sm text-[#8A7969]">
                    {search
                      ? "No published products match your search."
                      : "No published products yet."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#EDE5DC]">
                  {publishedProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      section="published"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Draft products */}
            <section className="border border-[#D9CCBE] bg-white/70">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DACE] p-5 sm:px-7">
                <div>
                  <div className="flex items-center gap-2">
                    <Archive size={19} strokeWidth={1.4} />

                    <h2 className="text-xl font-light">
                      Draft Products
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-[#8A7969]">
                    Private products that are not visible to customers
                  </p>
                </div>

                <span className="border border-[#D9CCBE] px-3 py-1.5 text-xs text-[#8A7969]">
                  {draftProducts.length} Draft
                </span>
              </div>

              {draftProducts.length === 0 ? (
                <div className="p-10 text-center">
                  <Package
                    size={28}
                    strokeWidth={1}
                    className="mx-auto text-[#B5A493]"
                  />

                  <p className="mt-3 text-sm text-[#8A7969]">
                    {search
                      ? "No draft products match your search."
                      : "No draft products yet."}
                  </p>

                  <p className="mt-1 text-xs text-[#A28A72]">
                    New products saved as Draft will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#EDE5DC]">
                  {draftProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      section="draft"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Archived products */}
            {archivedProducts.length > 0 && (
              <section className="border border-[#E5DACE] bg-white/70">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DACE] p-5 sm:px-7">
                  <div>
                    <h2 className="text-xl font-light">
                      Archived Products
                    </h2>

                    <p className="mt-1 text-xs text-[#8A7969]">
                      Products saved in the archived state
                    </p>
                  </div>

                  <span className="border border-[#D9CCBE] px-3 py-1.5 text-xs text-[#8A7969]">
                    {archivedProducts.length} Archived
                  </span>
                </div>

                <div className="divide-y divide-[#EDE5DC]">
                  {archivedProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      section="archived"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

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
