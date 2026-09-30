import { memo, useState } from "react";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { buildSrcSet } from "../../lib/responsiveImages";
import type { Stay } from "./stays";

type Props = { title: string; stays: Stay[]; onSelectStay: (stay: Stay) => void };

function StayRail({ title, stays, onSelectStay }: Props) {
  const [saved, setSaved] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const visibleStays = showAll ? stays : stays.slice(0, 7);

  function toggleSaved(id: string) {
    setSaved((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]
    );
  }

  return (
    <section className="mb-0" aria-label={title}>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-3">
        {visibleStays.map((stay, index) => {
          const isSaved = saved.includes(stay.id);
          const srcSet = buildSrcSet(stay.image, [320, 480, 720]);
          return (
            <motion.article
              key={stay.id}
              className="stay-card relative min-w-0 cursor-pointer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: Math.min(index * 0.035, 0.2) }}
            >
              <button
                type="button"
                className="group relative block w-full text-left"
                onClick={() => onSelectStay(stay)}
                aria-label={`View ${stay.kind.toLowerCase()} in ${stay.area}`}
              >
                <div className="stay-image relative">
                  <img
                    src={stay.image}
                    srcSet={srcSet}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 18vw"
                    alt={stay.alt}
                    width="480"
                    height="470"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="blur-up"
                  />
                  <span className="absolute left-2 top-2 rounded-full border border-white/70 bg-white/75 px-2 py-1 text-[8px] font-semibold text-[#27242b] shadow-sm backdrop-blur-md sm:text-[9px]">
                    {stay.badge ?? "Entire home"}
                  </span>
                </div>
              </button>
              <div className="flex items-start justify-between gap-1.5 px-2 py-2 sm:px-2.5 sm:py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-semibold text-white sm:text-[10px]">
                    {stay.area}
                  </p>
                  <p className="mt-0.5 truncate text-[8px] text-white/75 sm:text-[9px]">{stay.alt}</p>
                  <p className="mt-1 truncate text-[8px] text-white/85 sm:text-[9px]">
                    <strong className="font-semibold text-white">{stay.price}</strong> / 2 nights
                  </p>
                </div>
                <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[8px] text-white sm:text-[9px]">
                  <Star className="h-2.5 w-2.5 fill-white text-white" />
                  {stay.rating}
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSaved(stay.id)}
                aria-label={
                  isSaved ? `Remove ${stay.area} from wishlist` : `Save ${stay.area} to wishlist`
                }
                aria-pressed={isSaved}
                className="absolute right-2 top-2 rounded-full bg-black/20 p-1.5 text-white shadow-sm backdrop-blur-sm transition hover:scale-110 active:scale-90"
              >
                <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-[#ff6b99] text-[#ff6b99]" : "fill-black/20 text-white"}`} />
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default memo(StayRail);
