import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildSrcSet } from "../../lib/responsiveImages";
import type { VillaPhoto } from "../listing/property";

type Props = { photos: VillaPhoto[]; title: string };
const easing = [0.32, 0.72, 0, 1] as const;

export default function GalleryExperience({ photos, title }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const photoNumber = Number(searchParams.get("photo"));
  const activeIndex =
    Number.isInteger(photoNumber) && photoNumber > 0 && photoNumber <= photos.length
      ? photoNumber - 1
      : null;
  const overlayRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const counterText =
    activeIndex === null ? `${photos.length} photos` : `${activeIndex + 1} / ${photos.length}`;

  function openPhoto(index: number) {
    if (activeIndex === null) returnFocusRef.current = document.activeElement as HTMLElement;
    navigate(`?photo=${index + 1}`, { state: { gallery: true } });
  }

  function closeGallery() {
    if (window.history.state?.usr?.gallery) {
      navigate(-1);
      return;
    }

    const routePath = window.location.pathname.replace(/\/photos$/, "");
    navigate(routePath.startsWith("/rooms/") ? routePath : "/");
  }

  function stepPhoto(direction: number) {
    if (activeIndex === null) return;
    const nextIndex = activeIndex + direction;
    if (nextIndex >= 0 && nextIndex < photos.length)
      navigate(`?photo=${nextIndex + 1}`, { replace: true, state: { gallery: true } });
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    overlayRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGallery();
      if (activeIndex !== null && event.key === "ArrowRight") stepPhoto(1);
      if (activeIndex !== null && event.key === "ArrowLeft") stepPhoto(-1);
      if (event.key === "Tab" && overlayRef.current) {
        const items = overlayRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      if (activeIndex === null) returnFocusRef.current?.focus();
    };
  }, [activeIndex]);

  useEffect(() => {
    for (const index of [
      activeIndex === null ? -1 : activeIndex - 1,
      activeIndex === null ? -1 : activeIndex + 1
    ]) {
      if (index >= 0 && index < photos.length) {
        const image = new Image();
        image.srcset = buildSrcSet(photos[index].src, [720, 1080, 1500]) ?? "";
        image.sizes = "82vw";
        image.src = photos[index].src;
      }
    }
  }, [activeIndex, photos]);

  return (
    <motion.main
      ref={overlayRef}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#1f1f1f] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: easing }}
      role={activeIndex === null ? "region" : "dialog"}
      aria-label={activeIndex === null ? "Photo tour" : "Photo viewer"}
      aria-modal={activeIndex === null ? undefined : true}
    >
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#1f1f1f]/95 px-5 backdrop-blur-xl sm:px-8">
        <button
          onClick={closeGallery}
          className="flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-medium transition hover:bg-white/10"
          aria-label="Back to listing"
        >
          <ArrowLeft size={19} />
          <span>Photo Tour</span>
        </button>
        <span className="text-sm tabular-nums" aria-live="polite">
          {counterText}
        </span>
        <button
          onClick={closeGallery}
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/10"
          aria-label="Close photo tour"
        >
          <X size={21} />
        </button>
      </header>

      <AnimatePresence mode="wait">
        {activeIndex === null ? (
          <motion.section
            key="tour"
            className="mx-auto grid max-w-[1320px] grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: easing }}
            aria-label={`${title} photos`}
          >
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openPhoto(index)}
                aria-label={`Open photo ${index + 1}: ${photo.alt}`}
                className={`group overflow-hidden rounded-lg text-left focus-visible:outline-white ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <img
                  src={photo.src}
                  srcSet={buildSrcSet(photo.src, [480, 720, 1080, 1500])}
                  sizes="(max-width: 640px) 96vw, (max-width: 1024px) 48vw, 32vw"
                  alt={photo.alt}
                  width="1200"
                  height="800"
                  loading={index < 4 ? "eager" : "lazy"}
                  className="aspect-[1.25] h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] lg:aspect-[1.45]"
                />
                <span className="sr-only">{photo.alt}</span>
              </button>
            ))}
          </motion.section>
        ) : (
          <motion.section
            key={`photo-${activeIndex}`}
            className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center gap-5 px-4 pb-8 pt-5"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: easing }}
          >
            <div className="relative flex w-full flex-1 items-center justify-center">
              <button
                onClick={() => stepPhoto(-1)}
                disabled={activeIndex === 0}
                aria-label="Previous photo"
                className="absolute left-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-black/20 transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 sm:left-6"
              >
                <ArrowLeft />
              </button>
              <figure className="m-0 flex max-h-[calc(100vh-180px)] max-w-[min(82vw,1500px)] flex-col items-center justify-center">
                <img
                  src={photos[activeIndex].src}
                  srcSet={buildSrcSet(photos[activeIndex].src, [720, 1080, 1500])}
                  sizes="82vw"
                  alt={photos[activeIndex].alt}
                  width="1800"
                  height="1200"
                  className="max-h-[calc(100vh-230px)] max-w-full object-contain"
                />
                <figcaption className="mt-3 text-center text-sm text-white/75">
                  {photos[activeIndex].alt}
                </figcaption>
              </figure>
              <button
                onClick={() => stepPhoto(1)}
                disabled={activeIndex === photos.length - 1}
                aria-label="Next photo"
                className="absolute right-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-black/20 transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 sm:right-6"
              >
                <ArrowRight />
              </button>
            </div>
            <div
              className="flex max-w-full gap-2 overflow-x-auto px-2 pb-1"
              aria-label="Choose a photo"
            >
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => openPhoto(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={activeIndex === index}
                  className={`h-[52px] w-[72px] shrink-0 overflow-hidden rounded-md transition ${activeIndex === index ? "ring-2 ring-airbnb" : "opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={photo.src}
                    srcSet={buildSrcSet(photo.src, [144, 240, 360])}
                    sizes="72px"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
