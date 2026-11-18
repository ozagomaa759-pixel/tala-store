
"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  Monitor,
  Smartphone,
  ExternalLink,
} from "lucide-react";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  mobile_image_url: string | null;
  button_text: string;
  button_link: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
};

type Notice = {
  type: "success" | "error";
  text: string;
};

const inputClass =
  "mt-2 w-full border border-[#E5DACE] bg-white px-4 py-3 text-sm text-[#332A23] outline-none transition focus:border-[#A28A72]";

const labelClass =
  "text-xs uppercase tracking-[0.16em] text-[#8A7969]";

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new Error(
      `Invalid server response (HTTP ${response.status}).`
    );
  }
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Discover Collection");
  const [buttonLink, setButtonLink] = useState("/products");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [imageUrl, setImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobilePreview, setMobilePreview] = useState("");

  useEffect(() => {
    if (!desktopFile) {
      setDesktopPreview("");
      return;
    }

    const url = URL.createObjectURL(desktopFile);
    setDesktopPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [desktopFile]);

  useEffect(() => {
    if (!mobileFile) {
      setMobilePreview("");
      return;
    }

    const url = URL.createObjectURL(mobileFile);
    setMobilePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [mobileFile]);

  async function loadSlides() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/hero", {
        cache: "no-store",
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not load hero slides.");
      }

      setSlides(Array.isArray(data.slides) ? data.slides : []);
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not load hero slides.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSlides();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setButtonText("Discover Collection");
    setButtonLink("/products");
    setSortOrder(String(slides.length));
    setIsActive(true);

    setImageUrl("");
    setMobileImageUrl("");

    setDesktopFile(null);
    setMobileFile(null);

    if (desktopInputRef.current) {
      desktopInputRef.current.value = "";
    }

    if (mobileInputRef.current) {
      mobileInputRef.current.value = "";
    }
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    resetForm();
  }

  function validateFile(file: File) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowed.includes(file.type)) {
      setNotice({
        type: "error",
        text: "Use JPG, PNG, WEBP, or AVIF images only.",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice({
        type: "error",
        text: "Each image must be 5 MB or smaller.",
      });
      return false;
    }

    setNotice(null);
    return true;
  }

  function handleDesktopFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (validateFile(file)) {
      setDesktopFile(file);
    }

    event.target.value = "";
  }

  function handleMobileFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (validateFile(file)) {
      setMobileFile(file);
    }

    event.target.value = "";
  }

  async function uploadHeroImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/hero/upload", {
      method: "POST",
      body: formData,
    });

    const data = await readJson(response);

    if (!response.ok || !data.success || !data.url) {
      throw new Error(data.error || "Could not upload hero image.");
    }

    if (
      typeof data.url !== "string" ||
      !data.url.startsWith("http")
    ) {
      throw new Error("The uploaded image URL is invalid.");
    }

    return data.url;
  }

  function openEditForm(slide: HeroSlide) {
    setNotice(null);
    setEditingId(slide.id);

    setTitle(slide.title || "");
    setSubtitle(slide.subtitle || "");
    setDescription(slide.description || "");
    setButtonText(slide.button_text || "Discover Collection");
    setButtonLink(slide.button_link || "/products");
    setSortOrder(String(slide.sort_order ?? 0));
    setIsActive(slide.is_active);

    setImageUrl(slide.image_url);
    setMobileImageUrl(slide.mobile_image_url || "");

    setDesktopFile(null);
    setMobileFile(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    if (!editingId && !desktopFile) {
      setNotice({
        type: "error",
        text: "Please select a desktop hero image.",
      });
      return;
    }

    if (editingId && !imageUrl && !desktopFile) {
      setNotice({
        type: "error",
        text: "A desktop hero image is required.",
      });
      return;
    }

    const order = Number(sortOrder);

    if (!Number.isInteger(order) || order < 0) {
      setNotice({
        type: "error",
        text: "Enter a valid display order.",
      });
      return;
    }

    if (
      !buttonLink.trim().startsWith("/") ||
      buttonLink.trim().startsWith("//")
    ) {
      setNotice({
        type: "error",
        text: "Use a valid internal link such as /products.",
      });
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUrl;
      let finalMobileImageUrl = mobileImageUrl || null;

      if (desktopFile) {
        finalImageUrl = await uploadHeroImage(desktopFile);
      }

      if (mobileFile) {
        finalMobileImageUrl = await uploadHeroImage(mobileFile);
      }

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        image_url: finalImageUrl,
        mobile_image_url: finalMobileImageUrl,
        button_text: buttonText.trim() || "Discover Collection",
        button_link: buttonLink.trim(),
        sort_order: order,
        is_active: isActive,
      };

      const response = await fetch("/api/admin/hero", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? { id: editingId, ...payload }
            : payload
        ),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not save hero slide.");
      }

      setNotice({
        type: "success",
        text: editingId
          ? "Hero slide updated successfully."
          : "Hero slide created successfully.",
      });

      setShowForm(false);
      resetForm();

      await loadSlides();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not save hero slide.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function updateSlide(
    slide: HeroSlide,
    updates: Partial<HeroSlide>,
    successMessage: string
  ) {
    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/hero", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: slide.id,
          ...updates,
        }),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not update hero slide.");
      }

      setNotice({
        type: "success",
        text: successMessage,
      });

      await loadSlides();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not update hero slide.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(slide: HeroSlide) {
    const confirmed = window.confirm(
      `Permanently delete this hero slide?`
    );

    if (!confirmed) return;

    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/admin/hero?id=${encodeURIComponent(slide.id)}`,
        { method: "DELETE" }
      );

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not delete hero slide.");
      }

      setNotice({
        type: "success",
        text: "Hero slide deleted successfully.",
      });

      await loadSlides();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not delete hero slide.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function moveSlide(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= slides.length ||
      saving
    ) {
      return;
    }

    const current = slides[index];
    const target = slides[targetIndex];

    setSaving(true);
    setNotice(null);

    try {
      const firstResponse = await fetch("/api/admin/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: current.id,
          sort_order: target.sort_order,
        }),
      });

      const firstData = await readJson(firstResponse);

      if (!firstResponse.ok || firstData.success === false) {
        throw new Error(firstData.error || "Could not change slide order.");
      }

      const secondResponse = await fetch("/api/admin/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: target.id,
          sort_order: current.sort_order,
        }),
      });

      const secondData = await readJson(secondResponse);

      if (!secondResponse.ok || secondData.success === false) {
        throw new Error(secondData.error || "Could not finish changing slide order.");
      }

      setNotice({
        type: "success",
        text: "Hero order updated successfully.",
      });

      await loadSlides();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not change slide order.",
      });

      await loadSlides();
    } finally {
      setSaving(false);
    }
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
            <Monitor size={35} strokeWidth={1} />

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#A28A72]">
                TALA Administration
              </p>

              <h1 className="mt-2 text-4xl font-light sm:text-5xl">
                Hero Slider
              </h1>

              <p className="mt-2 text-sm text-[#77695D]">
                Manage the images and content displayed on your homepage.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (showForm) {
                closeForm();
              } else {
                resetForm();
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-2 bg-[#332A23] px-5 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-[#59483B] disabled:opacity-50"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Close Form" : "Add Slide"}
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
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A28A72]">
                {editingId ? "Edit homepage slide" : "New homepage slide"}
              </p>

              <h2 className="mt-2 text-2xl font-light">
                {editingId ? "Edit Hero Slide" : "Create Hero Slide"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}>
                Main title

                <input
                  className={inputClass}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="TALA"
                />
              </label>

              <label className={labelClass}>
                Subtitle / Kicker

                <input
                  className={inputClass}
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  placeholder="THE ART OF EVERYDAY ELEGANCE"
                />
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Description

                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Timeless pieces. Effortless confidence..."
                />
              </label>

              <label className={labelClass}>
                Button text

                <input
                  className={inputClass}
                  value={buttonText}
                  onChange={(event) => setButtonText(event.target.value)}
                  placeholder="Discover Collection"
                />
              </label>

              <label className={labelClass}>
                Button link

                <input
                  className={inputClass}
                  value={buttonLink}
                  onChange={(event) => setButtonLink(event.target.value)}
                  placeholder="/products"
                />
              </label>

              <label className={labelClass}>
                Display order

                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="1"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                />
              </label>

              <label className="flex items-center gap-3 self-end pb-3 text-xs text-[#77695D]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  className="h-4 w-4 accent-[#332A23]"
                />
                Show this slide on the homepage
              </label>
            </div>

            <div className="mt-8 border-t border-[#E5DACE] pt-7">
              <h3 className="text-lg font-light">Desktop hero image *</h3>

              <p className="mt-1 text-xs text-[#8A7969]">
                Recommended landscape image · JPG, PNG, WEBP or AVIF · Max 5 MB
              </p>

              <input
                ref={desktopInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleDesktopFile}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => desktopInputRef.current?.click()}
                className="mt-4 flex min-h-44 w-full flex-col items-center justify-center overflow-hidden border border-dashed border-[#CDBEAE] bg-[#FBF9F6] text-[#8A7969]"
              >
                {desktopPreview || imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={desktopPreview || imageUrl}
                    alt="Desktop hero preview"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus size={26} strokeWidth={1.3} />
                    <span className="mt-3 text-xs">
                      Tap to select desktop image
                    </span>
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center gap-3">
                <Smartphone size={19} strokeWidth={1.3} />
                <h3 className="text-lg font-light">
                  Mobile image
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#A28A72]">
                  Optional
                </span>
              </div>

              <p className="mt-1 text-xs text-[#8A7969]">
                Upload a separate portrait image for mobile screens.
              </p>

              <input
                ref={mobileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleMobileFile}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => mobileInputRef.current?.click()}
                className="mt-4 flex min-h-44 w-full max-w-xs flex-col items-center justify-center overflow-hidden border border-dashed border-[#CDBEAE] bg-[#FBF9F6] text-[#8A7969]"
              >
                {mobilePreview || mobileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mobilePreview || mobileImageUrl}
                    alt="Mobile hero preview"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus size={26} strokeWidth={1.3} />
                    <span className="mt-3 text-xs">
                      Tap to select mobile image
                    </span>
                  </>
                )}
              </button>

              {(mobileImageUrl || mobileFile) && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileImageUrl("");
                    setMobileFile(null);
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-xs text-[#8A3E2D]"
                >
                  <X size={14} />
                  Remove mobile image
                </button>
              )}
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
                ) : (
                  <Upload size={16} />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Create slide"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A28A72]">
              Homepage presentation
            </p>

            <h2 className="mt-2 text-2xl font-light">
              Your Hero Slides
            </h2>

            <p className="mt-1 text-xs text-[#8A7969]">
              {slides.length} slide(s) in your hero collection
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadSlides()}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 border border-[#E5DACE] bg-white px-4 py-3 text-xs uppercase tracking-wider text-[#77695D] disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-7 flex items-center justify-center gap-3 border border-[#E5DACE] bg-white/70 p-12 text-sm text-[#8A7969]">
            <Loader2 size={18} className="animate-spin" />
            Loading hero slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="mt-7 border border-dashed border-[#CDBEAE] bg-white/60 p-12 text-center">
            <ImagePlus
              size={34}
              strokeWidth={1}
              className="mx-auto text-[#B5A493]"
            />

            <h3 className="mt-4 text-xl font-light">
              No hero slides yet
            </h3>

            <p className="mt-2 text-sm text-[#8A7969]">
              Add your first image to start building your homepage slider.
            </p>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-6 inline-flex items-center gap-2 bg-[#332A23] px-5 py-3 text-xs uppercase tracking-wider text-white"
            >
              <Plus size={15} />
              Add First Slide
            </button>
          </div>
        ) : (
          <div className="mt-7 space-y-5">
            {slides.map((slide, index) => (
              <section
                key={slide.id}
                className="overflow-hidden border border-[#E5DACE] bg-white/80"
              >
                <div className="grid sm:grid-cols-[240px_1fr]">
                  <div className="relative min-h-48 bg-[#F1ECE5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image_url}
                      alt={slide.title || "TALA hero slide"}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <span className="absolute left-3 top-3 bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#332A23]">
                      Slide {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 p-5 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-light">
                            {slide.title || "Untitled Slide"}
                          </h3>

                          {slide.is_active ? (
                            <span className="border border-[#C4D0BE] bg-[#F0F5ED] px-2 py-1 text-[9px] uppercase tracking-wider text-[#53684B]">
                              Active
                            </span>
                          ) : (
                            <span className="border border-[#D9CCBE] bg-[#F8F5F0] px-2 py-1 text-[9px] uppercase tracking-wider text-[#8A7969]">
                              Hidden
                            </span>
                          )}
                        </div>

                        {slide.subtitle && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#A28A72]">
                            {slide.subtitle}
                          </p>
                        )}

                        {slide.description && (
                          <p className="mt-3 line-clamp-2 text-xs leading-6 text-[#77695D]">
                            {slide.description}
                          </p>
                        )}

                        <p className="mt-3 flex items-center gap-2 text-xs text-[#8A7969]">
                          <ExternalLink size={13} />
                          {slide.button_text} · {slide.button_link}
                        </p>

                        {slide.mobile_image_url && (
                          <p className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8A7969]">
                            <Smartphone size={13} />
                            Mobile image uploaded
                          </p>
                        )}
                      </div>

                      <span className="text-xs text-[#A28A72]">
                        Order: {slide.sort_order}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDE5DC] pt-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={saving || index === 0}
                          onClick={() => void moveSlide(index, -1)}
                          className="border border-[#E5DACE] p-2.5 text-[#77695D] disabled:opacity-30"
                          aria-label="Move slide up"
                        >
                          <ChevronUp size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={saving || index === slides.length - 1}
                          onClick={() => void moveSlide(index, 1)}
                          className="border border-[#E5DACE] p-2.5 text-[#77695D] disabled:opacity-30"
                          aria-label="Move slide down"
                        >
                          <ChevronDown size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void updateSlide(
                              slide,
                              { is_active: !slide.is_active },
                              slide.is_active
                                ? "Slide hidden from homepage."
                                : "Slide activated successfully."
                            )
                          }
                          className="inline-flex items-center gap-2 border border-[#E5DACE] px-3 py-2 text-[10px] uppercase tracking-wider text-[#59483B] disabled:opacity-50"
                        >
                          {slide.is_active ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}

                          {slide.is_active ? "Hide" : "Activate"}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => openEditForm(slide)}
                          className="inline-flex items-center gap-2 border border-[#BCA995] px-3 py-2 text-[10px] uppercase tracking-wider text-[#59483B] disabled:opacity-50"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void deleteSlide(slide)}
                          className="inline-flex items-center gap-2 border border-[#D8B9AE] px-3 py-2 text-[10px] uppercase tracking-wider text-[#8A3E2D] disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 border-b border-[#A28A72] pb-2 text-xs uppercase tracking-widest"
        >
          <Monitor size={15} />
          View Homepage
        </Link>
      </div>
    </main>
  );
}
