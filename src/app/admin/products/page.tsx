
"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  Check,
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
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

const DEFAULT_VARIANTS: Variant[] = ["S", "M", "L", "XL", "XXL"].map(
  (size) => ({
    size,
    color: "Black",
    color_code: "#222222",
    stock_quantity: 5,
    is_active: true,
  })
);

const inputClass =
  "mt-2 w-full rounded-xl border border-[#E8E5DD] bg-white px-4 py-3.5 text-sm text-[#252720] outline-none transition placeholder:text-[#AAA99F] focus:border-[#7B8664] focus:ring-2 focus:ring-[#7B8664]/10";

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#77796D]";

function makeSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `tala-product-${Date.now()}`;
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

function formatPrice(value: number | string) {
  return `EGP ${Number(value || 0).toLocaleString("en-EG")}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  const [variants, setVariants] = useState<Variant[]>([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");

  const activeCategories = useMemo(
    () => categories.filter((category) => category.is_active !== false),
    [categories]
  );

  const collectionCategories = useMemo(
    () =>
      activeCategories.filter((category) => {
        const value = (category.slug || category.name).toLowerCase();
        return value === "sets" || value === "jackets";
      }),
    [activeCategories]
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
    setCategoryId(collectionCategories[0]?.id || "");
    setPrice("");
    setCompareAtPrice("");
    setStatus("draft");

    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(true);

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

  function openNewProduct() {
    setNotice(null);
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    const allowed = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        file.type
      )
    );

    if (files.length !== allowed.length) {
      setNotice({
        type: "error",
        text: "Use JPG, PNG, WEBP, or AVIF images only.",
      });
      event.target.value = "";
      return;
    }

    if (allowed.some((file) => file.size > 5 * 1024 * 1024)) {
      setNotice({
        type: "error",
        text: "Each image must be 5 MB or smaller.",
      });
      event.target.value = "";
      return;
    }

    setSelectedFiles((current) => [...current, ...allowed]);

    if (!mainImage && imageUrls.length === 0 && allowed.length > 0) {
      setMainImage("__first_new_image__");
    }

    setNotice(null);
    event.target.value = "";
  }

  async function uploadImage(file: File, productId: string): Promise<string> {
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
        data.error || `Could not upload "${file.name}".`
      );
    }

    if (typeof data.url !== "string" || !data.url.startsWith("http")) {
      throw new Error(`Invalid image URL returned for "${file.name}".`);
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

      setIsFeatured(Boolean(product.is_featured));
      setIsBestSeller(Boolean(product.is_best_seller));
      setIsNewArrival(Boolean(product.is_new_arrival));

      setImageUrls(existingImages);
      setMainImage(
        product.main_image && existingImages.includes(product.main_image)
          ? product.main_image
          : existingImages[0] || ""
      );

      setSelectedFiles([]);
      setDeletedVariantIds([]);

      const loadedVariants: Variant[] = Array.isArray(data.variants)
        ? data.variants.map(
            (variant: {
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
            })
          )
        : [];

      setVariants(loadedVariants);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    setVariants((current) => current.filter((_, i) => i !== index));
  }

  function removeImage(url: string) {
    const remaining = imageUrls.filter((image) => image !== url);
    setImageUrls(remaining);

    if (mainImage === url) {
      setMainImage(remaining[0] || "__first_new_image__");
    }
  }

  function removeNewFile(index: number) {
    setSelectedFiles((current) => {
      const remaining = current.filter((_, i) => i !== index);

      if (
        remaining.length === 0 &&
        mainImage === "__first_new_image__"
      ) {
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
        text: "Enter a product name, collection, and valid price.",
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
        text: "Compare-at price must be greater than or equal to the product price.",
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
        text: "Add at least one valid size and stock quantity.",
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

    if (
      editingProductId &&
      imageUrls.length === 0 &&
      selectedFiles.length === 0
    ) {
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

      const productPayload = {
        name: name.trim(),
        slug: makeSlug(name),
        category_id: categoryId,
        description: description.trim(),
        price: numericPrice,
        compare_at_price: numericComparePrice,
        status,
        is_featured: isFeatured,
        is_best_seller: isBestSeller,
        is_new_arrival: isNewArrival,
      };

      if (editingProductId) {
        const response = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProductId,
            ...productPayload,
          }),
        });

        const data = await readJson(response);

        if (!response.ok || data.success === false) {
          throw new Error(data.error || "Could not update product details.");
        }
      } else {
        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...productPayload,
            main_image: null,
            images: [],
            sort_order: 0,
          }),
        });

        const data = await readJson(response);

        if (!response.ok || !data.success || !data.product?.id) {
          throw new Error(data.error || "The product could not be created.");
        }

        productId = data.product.id as string;
      }

      if (!productId) {
        throw new Error("Product ID is missing.");
      }

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        uploadedUrls.push(await uploadImage(file, productId));
      }

      const finalImages = Array.from(new Set([...imageUrls, ...uploadedUrls]));

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
        throw new Error(imageData.error || "Could not save product images.");
      }

      const savedProduct = imageData.product;

      if (
        !savedProduct ||
        savedProduct.main_image !== finalMainImage ||
        !Array.isArray(savedProduct.images) ||
        finalImages.some((url) => !savedProduct.images.includes(url))
      ) {
        throw new Error(
          "The server did not confirm that all product images were saved."
        );
      }

      await saveVariants(productId);

      setNotice({
        type: "success",
        text: editingProductId
          ? "Product, photos, collections, sizes and stock updated successfully."
          : "Product created successfully. Photos, sizes and stock are saved.",
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

  async function updateProduct(product: Product, updates: Record<string, unknown>) {
    setNotice(null);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, ...updates }),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not update product.");
      }

      setNotice({
        type: "success",
        text: "Product settings updated successfully.",
      });

      await loadData();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error ? error.message : "Could not update product.",
      });
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
    await updateProduct(product, { status: nextStatus });
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Permanently delete "${product.name}"? This action cannot be undone.`
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
          error instanceof Error ? error.message : "Could not delete product.",
      });
    } finally {
      setSaving(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.slug || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedProducts = filteredProducts.filter(
    (product) => product.status === "published"
  );
  const draftProducts = filteredProducts.filter(
    (product) => product.status === "draft"
  );
  const archivedProducts = filteredProducts.filter(
    (product) => product.status === "archived"
  );

  const bestSellerCount = products.filter(
    (product) => product.is_best_seller
  ).length;

  const featuredCount = products.filter(
    (product) => product.is_featured
  ).length;

  const newArrivalCount = products.filter(
    (product) => product.is_new_arrival
  ).length;

  function ProductImage({ product }: { product: Product }) {
    const image = product.main_image || product.images?.[0];

    return (
      <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EFEEE8] sm:h-32 sm:w-24">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#A4A698]">
            <ImagePlus size={22} />
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
    const category = categories.find(
      (item) => item.id === product.category_id
    );

    return (
      <article className="flex flex-col gap-4 p-4 transition hover:bg-[#FAFAF6] sm:flex-row sm:items-center sm:p-5">
        <div className="flex min-w-0 flex-1 gap-4">
          <ProductImage product={product} />

          <div className="min-w-0 flex-1 py-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-[#292B25]">
                {product.name}
              </h3>

              {product.is_best_seller && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0DC] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#81703C]">
                  <Star size={10} fill="currentColor" />
                  Bestseller
                </span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium text-[#3D4234]">
              {formatPrice(product.price)}
              {product.compare_at_price != null &&
                product.compare_at_price > product.price && (
                  <span className="ml-2 text-xs font-normal text-[#A4A398] line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-[#888A7D]">
              {category && <span>{category.name}</span>}
              <span>·</span>
              <span>{section}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.is_featured && (
                <span className="rounded-full bg-[#EAF0E2] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#526344]">
                  Featured
                </span>
              )}
              {product.is_new_arrival && (
                <span className="rounded-full bg-[#F5EAE5] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#956A5D]">
                  New arrival
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:max-w-[360px] sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void updateProduct(product, {
                is_featured: !product.is_featured,
              })
            }
            className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition disabled:opacity-50 ${
              product.is_featured
                ? "border-[#D6E0C9] bg-[#EDF2E7] text-[#526344]"
                : "border-[#E7E5DC] bg-white text-[#77796D]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={12} />
              Featured
            </span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void updateProduct(product, {
                is_best_seller: !product.is_best_seller,
              })
            }
            className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition disabled:opacity-50 ${
              product.is_best_seller
                ? "border-[#E8DFC1] bg-[#F7F2E2] text-[#81703C]"
                : "border-[#E7E5DC] bg-white text-[#77796D]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Star size={12} />
              Bestseller
            </span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void updateProduct(product, {
                is_new_arrival: !product.is_new_arrival,
              })
            }
            className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition disabled:opacity-50 ${
              product.is_new_arrival
                ? "border-[#E8D6D0] bg-[#F8EEEA] text-[#956A5D]"
                : "border-[#E7E5DC] bg-white text-[#77796D]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Plus size={12} />
              New
            </span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void openEditForm(product)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#292D25] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#41483A] disabled:opacity-50"
          >
            <Pencil size={12} />
            Edit
          </button>

          {section === "published" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void toggleProductStatus(product)}
              className="rounded-full border border-[#E7E5DC] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#77796D] disabled:opacity-50"
            >
              Move to draft
            </button>
          )}

          {section === "draft" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void toggleProductStatus(product)}
              className="rounded-full bg-[#DCE9C9] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#48563C] disabled:opacity-50"
            >
              Publish
            </button>
          )}

          {section === "archived" && (
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void updateProduct(product, { status: "draft" })
              }
              className="rounded-full border border-[#E7E5DC] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#77796D] disabled:opacity-50"
            >
              Restore
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => void deleteProduct(product)}
            aria-label={`Delete ${product.name}`}
            className="rounded-full border border-[#F0DCD6] bg-white p-2 text-[#A45F50] transition hover:bg-[#FBF0ED] disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </article>
    );
  }

  function ProductSection({
    title,
    subtitle,
    items,
    section,
    icon,
  }: {
    title: string;
    subtitle: string;
    items: Product[];
    section: "published" | "draft" | "archived";
    icon: "published" | "draft" | "archived";
  }) {
    return (
      <section className="overflow-hidden rounded-2xl border border-[#EAE8DF] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEEE8] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F2EA] text-[#626C52]">
              {icon === "published" ? (
                <ShoppingBag size={17} />
              ) : icon === "draft" ? (
                <Package size={17} />
              ) : (
                <Archive size={17} />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#292B25]">
                {title}
              </h2>
              <p className="mt-1 text-[11px] text-[#929387]">{subtitle}</p>
            </div>
          </div>

          <span className="rounded-full bg-[#F2F2EC] px-3 py-1.5 text-[10px] font-semibold text-[#64695A]">
            {items.length} items
          </span>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package
              size={25}
              strokeWidth={1.3}
              className="mx-auto text-[#B4B6A9]"
            />
            <p className="mt-3 text-sm text-[#77796D]">
              {search
                ? "No products match your search."
                : `No ${section} products yet.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EFE9]">
            {items.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                section={section}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F6F0] px-4 py-7 text-[#292B25] sm:px-7 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#85877A] transition hover:text-[#303429]"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <header className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A9277]">
              TALA / Administration
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Product studio<span className="text-[#A6B18C]">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#85877A]">
              Create products, curate collections, manage photos, sizes and
              inventory — all in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => (showForm ? closeForm() : openNewProduct())}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#292D25] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.13em] text-white shadow-sm transition hover:bg-[#41483A] disabled:opacity-50"
          >
            {showForm ? <X size={15} /> : <Plus size={16} />}
            {showForm ? "Close editor" : "Create product"}
          </button>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total products",
              value: products.length,
              detail: "Across all collections",
            },
            {
              label: "Published",
              value: products.filter((p) => p.status === "published").length,
              detail: "Visible in the store",
            },
            {
              label: "Bestsellers",
              value: bestSellerCount,
              detail: "Customer favourites",
            },
            {
              label: "Featured / New",
              value: featuredCount + newArrivalCount,
              detail: "Homepage selections",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#EAE9E0] bg-white p-4 sm:p-5"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#929487]">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#303429]">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] text-[#A1A296]">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
              notice.type === "success"
                ? "border-[#D9E4CD] bg-[#F0F5E9] text-[#526344]"
                : "border-[#F0D8D1] bg-[#FBF0ED] text-[#985B4D]"
            }`}
          >
            {notice.type === "success" ? (
              <Check size={17} className="mt-0.5 shrink-0" />
            ) : (
              <X size={17} className="mt-0.5 shrink-0" />
            )}
            {notice.text}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-7 overflow-hidden rounded-2xl border border-[#E5E6DA] bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFEEE8] bg-[#FBFBF7] px-5 py-5 sm:px-7">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#929A7D]">
                  {editingProductId ? "Product editor" : "New product"}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {editingProductId ? "Edit product" : "Build a new product"}
                </h2>
                <p className="mt-1 text-xs text-[#929387]">
                  Product information, merchandising, photography and stock.
                </p>
              </div>

              {editingProductId && (
                <span className="rounded-full bg-[#EEF1E7] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#687454]">
                  Editing existing product
                </span>
              )}
            </div>

            <div className="space-y-8 p-5 sm:p-7">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-[#AAB68F]" />
                  <h3 className="text-sm font-semibold">Product information</h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className={labelClass}>
                    Product name *
                    <input
                      className={inputClass}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. The Everyday Set"
                      required
                    />
                  </label>

                  <div>
                    <p className={labelClass}>Collection *</p>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {(["sets", "jackets"] as const).map((slug) => {
                        const category = collectionCategories.find(
                          (item) =>
                            (item.slug || item.name).toLowerCase() === slug
                        );
                        const selected = categoryId === category?.id;

                        return (
                          <button
                            key={slug}
                            type="button"
                            disabled={!category}
                            onClick={() => {
                              if (category) setCategoryId(category.id);
                            }}
                            aria-pressed={selected}
                            className={`rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                              selected
                                ? "border-[#899573] bg-[#F0F3E9]"
                                : "border-[#E9E8E0] bg-white hover:border-[#B6BEA4]"
                            }`}
                          >
                            <span className="block text-xs font-semibold uppercase tracking-[0.15em]">
                              {slug}
                            </span>
                            <span className="mt-1 block text-[10px] text-[#929387]">
                              {selected
                                ? "Selected"
                                : category
                                  ? "Choose collection"
                                  : "Unavailable"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className={labelClass}>
                    Price (EGP) *
                    <input
                      className={inputClass}
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    Compare-at price (EGP)
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={compareAtPrice}
                      onChange={(event) => setCompareAtPrice(event.target.value)}
                      placeholder="Optional — original price"
                    />
                  </label>

                  <label className={labelClass}>
                    Store status
                    <select
                      className={inputClass}
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      <option value="draft">Draft — hidden from store</option>
                      <option value="published">Published — live</option>
                      <option value="archived">Archived</option>
                    </select>
                  </label>

                  <label className={labelClass}>
                    Product description
                    <textarea
                      className={`${inputClass} min-h-28 resize-y`}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Tell the story of this piece. Mention fabric, fit and details..."
                    />
                  </label>
                </div>
              </section>

              <section className="border-t border-[#EFEEE8] pt-7">
                <div className="mb-4">
                  <p className="text-sm font-semibold">Merchandising</p>
                  <p className="mt-1 text-xs text-[#929387]">
                    Choose how this product is highlighted around the store.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: "Featured",
                      description: "Highlight in featured product areas.",
                      checked: isFeatured,
                      set: setIsFeatured,
                      icon: <Sparkles size={17} />,
                      tone: "sage",
                    },
                    {
                      title: "Bestseller",
                      description: "Mark as one of TALA's bestsellers.",
                      checked: isBestSeller,
                      set: setIsBestSeller,
                      icon: <Star size={17} />,
                      tone: "sand",
                    },
                    {
                      title: "New arrival",
                      description: "Identify this as a new collection item.",
                      checked: isNewArrival,
                      set: setIsNewArrival,
                      icon: <Plus size={17} />,
                      tone: "rose",
                    },
                  ].map((item) => (
                    <label
                      key={item.title}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        item.checked
                          ? "border-[#AAB68F] bg-[#F5F7F0]"
                          : "border-[#EAE9E1] bg-white hover:bg-[#FAFAF6]"
                      }`}
                    >
                      <span className="mt-0.5 text-[#788466]">{item.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[10px] leading-5 text-[#929387]">
                          {item.description}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(event) => item.set(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#788466]"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="border-t border-[#EFEEE8] pt-7">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">Product photography</h3>
                    <p className="mt-1 text-xs text-[#929387]">
                      JPG, PNG, WEBP or AVIF · maximum 5 MB per image.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DADDD0] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#59634A] transition hover:bg-[#F3F5ED]"
                  >
                    <ImagePlus size={15} />
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
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {imageUrls.map((url) => (
                      <div
                        key={url}
                        className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EFEEE8]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="Product photo"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => setMainImage(url)}
                          className={`absolute bottom-2 left-2 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider ${
                            mainImage === url
                              ? "bg-[#292D25] text-white"
                              : "bg-white/90 text-[#3D4234]"
                          }`}
                        >
                          {mainImage === url ? "Cover photo" : "Set as cover"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          aria-label="Remove image"
                          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#A45F50]"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {previews.map((preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EFEEE8]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt={`New product photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#59634A]">
                          New photo
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNewFile(index)}
                          aria-label="Remove new image"
                          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#A45F50]"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-5 flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D8CB] bg-[#FAFAF6] text-[#858A78] transition hover:border-[#AAB68F] hover:bg-[#F5F7F0]"
                  >
                    <Upload size={24} strokeWidth={1.4} />
                    <span className="mt-3 text-xs font-medium">
                      Select product photos
                    </span>
                    <span className="mt-1 text-[10px] text-[#A2A497]">
                      Add multiple angles and details
                    </span>
                  </button>
                )}

                <p className="mt-3 text-[10px] leading-5 text-[#999B90]">
                  The cover photo is used in product cards and collection
                  previews. You can change it at any time.
                </p>
              </section>

              <section className="border-t border-[#EFEEE8] pt-7">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">Sizes, colours & stock</h3>
                    <p className="mt-1 text-xs text-[#929387]">
                      Each size and colour combination has its own stock quantity.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addVariant()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#DADDD0] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#59634A]"
                    >
                      <Plus size={13} />
                      Add size
                    </button>
                    <button
                      type="button"
                      onClick={() => addVariant("One Size")}
                      className="rounded-full border border-[#DADDD0] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#59634A]"
                    >
                      One size
                    </button>
                  </div>
                </div>

                {variants.length === 0 && (
                  <p className="mt-5 rounded-xl border border-dashed border-[#D5D8CB] bg-[#FAFAF6] p-5 text-sm text-[#85877A]">
                    No sizes added yet. Add at least one size before saving.
                  </p>
                )}

                <div className="mt-5 space-y-3">
                  {variants.map((variant, index) => (
                    <div
                      key={variant.id || `new-${index}`}
                      className="rounded-xl border border-[#EAE9E1] bg-[#FBFBF8] p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <label className={labelClass}>
                          Size
                          <input
                            className={inputClass}
                            value={variant.size}
                            onChange={(event) =>
                              updateVariant(index, "size", event.target.value)
                            }
                            placeholder="S, M, XL, XXL..."
                          />
                        </label>

                        <label className={labelClass}>
                          Colour name
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

                        <div className="flex items-end gap-3">
                          <label className={`${labelClass} min-w-0 flex-1`}>
                            Colour code
                            <input
                              className={`${inputClass} h-[49px] cursor-pointer p-1.5`}
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
                            aria-label="Remove size"
                            className="mb-0.5 rounded-xl border border-[#F0DCD6] bg-white p-3 text-[#A45F50] transition hover:bg-[#FBF0ED]"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ECEBE4] pt-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#77796D]">
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
                            className="h-4 w-4 accent-[#788466]"
                          />
                          Available for sale
                        </label>

                        <span
                          className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                            variant.stock_quantity === 0
                              ? "bg-[#F9EDE9] text-[#A45F50]"
                              : "bg-[#EDF2E7] text-[#637650]"
                          }`}
                        >
                          {variant.stock_quantity === 0
                            ? "Sold out"
                            : `${variant.stock_quantity} in stock`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#EFEEE8] bg-[#FBFBF8] px-5 py-5 sm:px-7">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-full border border-[#E2E1D8] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#77796D] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#292D25] px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#41483A] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : editingProductId ? (
                  <Pencil size={14} />
                ) : (
                  <Plus size={15} />
                )}
                {saving
                  ? "Saving product..."
                  : editingProductId
                    ? "Save changes"
                    : "Create product"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#929A7D]">
                Catalogue management
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Your collection
              </h2>
              <p className="mt-1 text-xs text-[#929387]">
                {products.length} products stored in your TALA catalogue.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E7E6DE] bg-white px-4 sm:w-56 sm:flex-none">
                <Search size={15} className="shrink-0 text-[#929387]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none placeholder:text-[#AAA99F]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-full border border-[#E7E6DE] bg-white px-4 py-3 text-xs text-[#65685B] outline-none"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <button
                type="button"
                onClick={() => void loadData()}
                aria-label="Refresh products"
                className="rounded-full border border-[#E7E6DE] bg-white p-3 text-[#77796D] transition hover:bg-[#F0F1E9]"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-[#EAE9E1] bg-white p-14 text-sm text-[#85877A]">
            <Loader2 size={18} className="animate-spin" />
            Loading your collection...
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {(statusFilter === "all" || statusFilter === "published") && (
              <ProductSection
                title="Published products"
                subtitle="Products currently visible in your online store."
                items={publishedProducts}
                section="published"
                icon="published"
              />
            )}

            {(statusFilter === "all" || statusFilter === "draft") && (
              <ProductSection
                title="Draft products"
                subtitle="Private products that are not visible to customers."
                items={draftProducts}
                section="draft"
                icon="draft"
              />
            )}

            {(statusFilter === "all" || statusFilter === "archived") && (
              <ProductSection
                title="Archived products"
                subtitle="Products kept in your catalogue but not currently active."
                items={archivedProducts}
                section="archived"
                icon="archived"
              />
            )}

            {filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#DADDD0] bg-white px-6 py-14 text-center">
                <Package
                  size={27}
                  strokeWidth={1.3}
                  className="mx-auto text-[#A4A698]"
                />
                <p className="mt-3 text-sm font-medium text-[#55594B]">
                  No products found
                </p>
                <p className="mt-1 text-xs text-[#929387]">
                  Try another search or create a new product.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E6DE] pt-5">
          <p className="text-[10px] uppercase tracking-wider text-[#A0A194]">
            TALA · Product management studio
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#626C52] transition hover:text-[#303429]"
          >
            <ShoppingBag size={14} />
            View storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
