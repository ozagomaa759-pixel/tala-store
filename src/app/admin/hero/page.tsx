
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ImagePlus,
  Monitor,
  Smartphone,
  RefreshCw,
  Upload,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  mobile_image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
};

type Notice = {
  type: "success" | "error";
  text: string;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#E8E1D7] bg-white px-4 py-3.5 text-sm text-[#292720] outline-none transition placeholder:text-[#B4AA9D] focus:border-[#87936B] focus:ring-2 focus:ring-[#87936B]/10";

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#81796D]";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] transition disabled:cursor-not-allowed disabled:opacity-40";

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new Error(`Invalid server response (${response.status}).`);
  }
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const desktopInput = useRef<HTMLInputElement>(null);
  const mobileInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Discover Collection");
  const [buttonLink, setButtonLink] = useState("/collections/all-pieces");
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

      const rows = Array.isArray(data.slides) ? data.slides : [];

      setSlides(
        rows.sort(
          (a: HeroSlide, b: HeroSlide) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0)
        )
      );
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
    setButtonLink("/collections/all-pieces");
    setSortOrder(String(slides.length));
    setIsActive(true);
    setImageUrl("");
    setMobileImageUrl("");
    setDesktopFile(null);
    setMobileFile(null);

    if (desktopInput.current) desktopInput.current.value = "";
    if (mobileInput.current) mobileInput.current.value = "";
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    resetForm();
  }

  function openCreateForm() {
    setNotice(null);
    resetForm();
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditForm(slide: HeroSlide) {
    setNotice(null);
    setEditingId(slide.id);
    setTitle(slide.title || "");
    setSubtitle(slide.subtitle || "");
    setDescription(slide.description || "");
    setButtonText(slide.button_text || "Discover Collection");
    setButtonLink(slide.button_link || "/collections/all-pieces");
    setSortOrder(String(slide.sort_order ?? 0));
    setIsActive(slide.is_active);
    setImageUrl(slide.image_url || "");
    setMobileImageUrl(slide.mobile_image_url || "");
    setDesktopFile(null);
    setMobileFile(null);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        text: "Use JPG, PNG, WEBP or AVIF images only.",
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

    if (validateFile(file)) setDesktopFile(file);
    event.target.value = "";
  }

  function handleMobileFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) setMobileFile(file);
    event.target.value = "";
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/hero/upload", {
      method: "POST",
      body: formData,
    });

    const data = await readJson(response);

    if (!response.ok || !data.success || !data.url) {
      throw new Error(data.error || "Image upload failed.");
    }

    if (
      typeof data.url !== "string" ||
      !data.url.startsWith("http")
    ) {
      throw new Error("The uploaded image URL is invalid.");
    }

    return data.url;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    if (!editingId && !desktopFile) {
      setNotice({
        type: "error",
        text: "Please choose a desktop hero image.",
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

    const cleanLink = buttonLink.trim();

    if (!cleanLink.startsWith("/") || cleanLink.startsWith("//")) {
      setNotice({
        type: "error",
        text: "Use an internal link such as /collections/sets.",
      });
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUrl;
      let finalMobileImageUrl: string | null = mobileImageUrl || null;

      if (desktopFile) {
        finalImageUrl = await uploadImage(desktopFile);
      }

      if (mobileFile) {
        finalMobileImageUrl = await uploadImage(mobileFile);
      }

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        image_url: finalImageUrl,
        mobile_image_url: finalMobileImageUrl,
        button_text: buttonText.trim() || "Discover Collection",
        button_link: cleanLink,
        sort_order: order,
        is_active: isActive,
      };

      const response = await fetch("/api/admin/hero", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...payload } : payload
        ),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not save hero slide.");
      }

      setNotice({
        type: "success",
        text: editingId
          ? "Your campaign has been updated."
          : "Your new campaign has been created.",
      });

      setFormOpen(false);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, ...updates }),
      });

      const data = await readJson(response);

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not update slide.");
      }

      setNotice({ type: "success", text: successMessage });
      await loadSlides();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not update slide.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(slide: HeroSlide) {
    const confirmed = window.confirm(
      "Permanently delete this homepage campaign?"
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
        throw new Error(data.error || "Could not delete slide.");
      }

      setNotice({ type: "success", text: "Campaign deleted successfully." });
      await loadSlides();
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not delete slide.",
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
        throw new Error(firstData.error || "Could not update slide order.");
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
        throw new Error(secondData.error || "Could not finish slide ordering.");
      }

      setNotice({ type: "success", text: "Campaign order updated." });
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

  const activeCount = slides.filter((slide) => slide.is_active).length;
  const hiddenCount = slides.length - activeCount;

  return (
    <main className="min-h-screen bg-[#F5F1EB] px-4 py-7 text-[#292720] sm:px-7 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#81796D] transition hover:text-[#292720]"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        <section className="relative mt-8 overflow-hidden rounded-[28px] bg-[#292720] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-14 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#D8ED83]">
                <Sparkles size={15} />
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em]">
                  TALA / Campaign Studio
                </span>
              </div>

              <h1 className="mt-5 font-serif text-4xl font-normal tracking-tight sm:text-6xl">
                Hero Slider
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                Shape the first impression. Manage your homepage campaigns,
                images, messages and collection links in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={formOpen ? closeForm : openCreateForm}
              disabled={saving}
              className={`${buttonClass} ${
                formOpen
                  ? "border border-white/30 text-white hover:bg-white/10"
                  : "bg-[#D8ED83] text-[#292720] hover:bg-[#e4f4a7]"
              }`}
            >
              {formOpen ? <X size={15} /> : <Plus size={15} />}
              {formOpen ? "Close editor" : "Create campaign"}
            </button>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-5 rounded-2xl border px-5 py-4 text-sm ${
              notice.type === "success"
                ? "border-[#C9D5B8] bg-[#F0F4E9] text-[#536342]"
                : "border-[#E3C6BB] bg-[#FBF0EC] text-[#934B3B]"
            }`}
          >
            {notice.text}
          </div>
        )}

        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#93897C]">
              Total campaigns
            </p>
            <p className="mt-3 text-3xl font-light tabular-nums">
              {slides.length.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#93897C]">
              Active campaigns
            </p>
            <p className="mt-3 text-3xl font-light tabular-nums text-[#78865C]">
              {activeCount.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E1D7] bg-white p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#93897C]">
              Hidden campaigns
            </p>
            <p className="mt-3 text-3xl font-light tabular-nums">
              {hiddenCount.toString().padStart(2, "0")}
            </p>
          </div>
        </section>

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="mt-7 overflow-hidden rounded-[26px] border border-[#E8E1D7] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEE8DF] px-5 py-6 sm:px-8">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B966D]">
                  Campaign editor
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                  {editingId ? "Edit campaign" : "New campaign"}
                </h2>
              </div>

              <span className="rounded-full bg-[#F3F1E9] px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-[#777365]">
                {editingId ? "Editing existing slide" : "New homepage slide"}
              </span>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Main headline</label>
                  <input
                    className={inputClass}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="NOT HERE TO BLEND IN."
                  />
                </div>

                <div>
                  <label className={labelClass}>Subtitle / kicker</label>
                  <input
                    className={inputClass}
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                    placeholder="A DIFFERENT KIND OF EVERYDAY."
                  />
                </div>

                <div>
                  <label className={labelClass}>Campaign description</label>
                  <textarea
                    className={`${inputClass} min-h-32 resize-y leading-7`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Write a short message that introduces this campaign..."
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Button label</label>
                    <input
                      className={inputClass}
                      value={buttonText}
                      onChange={(event) => setButtonText(event.target.value)}
                      placeholder="Discover Collection"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Button destination</label>
                    <input
                      className={inputClass}
                      value={buttonLink}
                      onChange={(event) => setButtonLink(event.target.value)}
                      placeholder="/collections/sets"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Display order</label>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="1"
                      value={sortOrder}
                      onChange={(event) => setSortOrder(event.target.value)}
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-[#E8E1D7] px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(event) => setIsActive(event.target.checked)}
                      className="h-4 w-4 accent-[#87936B]"
                    />
                    <span>
                      <span className="block text-xs font-semibold">
                        Show on homepage
                      </span>
                      <span className="mt-1 block text-[10px] text-[#93897C]">
                        Make this campaign visible
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Monitor size={15} className="text-[#87936B]" />
                    <h3 className="text-sm font-semibold">Desktop artwork</h3>
                  </div>
                  <p className="mt-1 text-[10px] leading-5 text-[#93897C]">
                    Landscape image recommended · JPG, PNG, WEBP or AVIF · Max 5 MB
                  </p>

                  <input
                    ref={desktopInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleDesktopFile}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => desktopInput.current?.click()}
                    className="mt-3 flex min-h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#CFC7B9] bg-[#F8F6F1] transition hover:border-[#87936B]"
                  >
                    {desktopPreview || imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={desktopPreview || imageUrl}
                        alt="Desktop campaign preview"
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <span className="flex flex-col items-center gap-3 text-[#928A7C]">
                        <ImagePlus size={28} strokeWidth={1.3} />
                        <span className="text-xs">Choose desktop image</span>
                      </span>
                    )}
                  </button>

                  {(desktopFile || imageUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        setDesktopFile(null);
                        setImageUrl("");
                      }}
                      className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#A45D4A]"
                    >
                      <X size={13} />
                      Remove desktop image
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Smartphone size={15} className="text-[#87936B]" />
                    <h3 className="text-sm font-semibold">Mobile artwork</h3>
                    <span className="rounded-full bg-[#F3F1E9] px-2 py-1 text-[8px] uppercase tracking-wider text-[#81796D]">
                      Optional
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] leading-5 text-[#93897C]">
                    Use a portrait crop for a better mobile experience.
                  </p>

                  <input
                    ref={mobileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleMobileFile}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => mobileInput.current?.click()}
                    className="mt-3 flex min-h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#CFC7B9] bg-[#F8F6F1] transition hover:border-[#87936B]"
                  >
                    {mobilePreview || mobileImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mobilePreview || mobileImageUrl}
                        alt="Mobile campaign preview"
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <span className="flex flex-col items-center gap-3 text-[#928A7C]">
                        <ImagePlus size={25} strokeWidth={1.3} />
                        <span className="text-xs">Choose mobile image</span>
                      </span>
                    )}
                  </button>

                  {(mobileFile || mobileImageUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileFile(null);
                        setMobileImageUrl("");
                      }}
                      className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#A45D4A]"
                    >
                      <X size={13} />
                      Remove mobile image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEE8DF] bg-[#FBFAF7] px-5 py-5 sm:px-8">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className={`${buttonClass} border border-[#DED7CB] text-[#746D61] hover:bg-white`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`${buttonClass} min-w-36 bg-[#292720] text-white hover:bg-[#48463B]`}
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Create campaign"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-9">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B966D]">
                Homepage presentation
              </p>
              <h2 className="mt-2 font-serif text-3xl">Your campaigns</h2>
              <p className="mt-1 text-xs text-[#93897C]">
                Arrange the slides and control what visitors see first.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadSlides()}
              disabled={loading || saving}
              className={`${buttonClass} border border-[#DED7CB] bg-white text-[#746D61] hover:bg-[#F9F7F2]`}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-52 items-center justify-center gap-3 rounded-2xl border border-[#E8E1D7] bg-white text-sm text-[#93897C]">
              <Loader2 size={18} className="animate-spin" />
              Loading campaigns...
            </div>
          ) : slides.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#CFC7B9] bg-white/70 px-6 py-16 text-center">
              <ImagePlus
                size={34}
                strokeWidth={1.2}
                className="mx-auto text-[#9A927F]"
              />
              <h3 className="mt-5 font-serif text-2xl">A blank canvas.</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#93897C]">
                Your homepage campaigns will appear here. Create the first one
                to start shaping your storefront.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className={`${buttonClass} mt-6 bg-[#292720] text-white hover:bg-[#48463B]`}
              >
                <Plus size={15} />
                Create first campaign
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <article
                  key={slide.id}
                  className="overflow-hidden rounded-[22px] border border-[#E8E1D7] bg-white transition hover:border-[#CFC7B9]"
                >
                  <div className="grid md:grid-cols-[280px_1fr]">
                    <div className="relative min-h-52 bg-[#EAE5DC] md:min-h-60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image_url}
                        alt={slide.title || "TALA campaign"}
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#292720]">
                        Campaign {String(index + 1).padStart(2, "0")}
                      </div>

                      {slide.mobile_image_url && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[#292720]/80 px-3 py-1.5 text-[9px] text-white">
                          <Smartphone size={11} />
                          Mobile artwork
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 p-5 sm:p-7">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-2xl">
                              {slide.title || "Untitled campaign"}
                            </h3>

                            {slide.is_active ? (
                              <span className="rounded-full bg-[#EDF2E5] px-3 py-1 text-[8px] font-semibold uppercase tracking-wider text-[#68794E]">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#F1EEE8] px-3 py-1 text-[8px] font-semibold uppercase tracking-wider text-[#81796D]">
                                Hidden
                              </span>
                            )}
                          </div>

                          {slide.subtitle && (
                            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B966D]">
                              {slide.subtitle}
                            </p>
                          )}

                          {slide.description && (
                            <p className="mt-3 line-clamp-2 max-w-2xl text-xs leading-6 text-[#81796D]">
                              {slide.description}
                            </p>
                          )}

                          <p className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-[#93897C]">
                            <ExternalLink size={12} />
                            {slide.button_text || "Discover Collection"}
                            <span>·</span>
                            {slide.button_link || "/collections/all-pieces"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#F5F2EC] px-3 py-2 text-center">
                          <span className="block text-[8px] uppercase tracking-wider text-[#93897C]">
                            Order
                          </span>
                          <span className="mt-1 block text-lg font-light tabular-nums">
                            {String(slide.sort_order).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE8DF] pt-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={saving || index === 0}
                            onClick={() => void moveSlide(index, -1)}
                            aria-label="Move campaign up"
                            className="rounded-full border border-[#E8E1D7] p-2.5 text-[#746D61] transition hover:bg-[#F5F2EC] disabled:opacity-30"
                          >
                            <ArrowUp size={15} />
                          </button>

                          <button
                            type="button"
                            disabled={saving || index === slides.length - 1}
                            onClick={() => void moveSlide(index, 1)}
                            aria-label="Move campaign down"
                            className="rounded-full border border-[#E8E1D7] p-2.5 text-[#746D61] transition hover:bg-[#F5F2EC] disabled:opacity-30"
                          >
                            <ArrowDown size={15} />
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              void updateSlide(
                                slide,
                                { is_active: !slide.is_active },
                                slide.is_active
                                  ? "Campaign hidden from homepage."
                                  : "Campaign activated successfully."
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D7] px-4 py-2 text-[9px] font-semibold uppercase tracking-wider text-[#746D61] transition hover:bg-[#F5F2EC] disabled:opacity-40"
                          >
                            {slide.is_active ? (
                              <EyeOff size={13} />
                            ) : (
                              <Eye size={13} />
                            )}
                            {slide.is_active ? "Hide" : "Activate"}
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => openEditForm(slide)}
                            className="inline-flex items-center gap-2 rounded-full bg-[#292720] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#48463B] disabled:opacity-40"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void deleteSlide(slide)}
                            className="inline-flex items-center gap-2 rounded-full border border-[#E4CFC7] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-[#A45D4A] transition hover:bg-[#FBF0EC] disabled:opacity-40"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5DED3] pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#746D61] transition hover:text-[#292720]"
          >
            <ExternalLink size={14} />
            View live storefront
          </Link>

          <span className="text-[9px] uppercase tracking-[0.16em] text-[#A49B8E]">
            TALA / Luxury Fashion
          </span>
        </div>
      </div>
    </main>
  );
}
