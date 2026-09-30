"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Heart,
  House,
  MapPin,
  Menu,
  Minus,
  Plus,
  Share,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Waves,
  Wifi,
  X
} from "lucide-react";
import AirbnbMark from "../../shared/ui/AirbnbMark";
import { buildSrcSet } from "../../lib/responsiveImages";
import { villa } from "./property";

const GalleryExperience = lazy(() => import("../gallery/GalleryExperience"));
const spring = { type: "spring" as const, stiffness: 330, damping: 30, mass: 0.8 };
const sections = ["Photos", "Amenities", "Reviews", "Location"];
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const months = [
  { name: "July", days: 31, offset: 3 },
  { name: "August", days: 31, offset: 6 }
];

export default function ListingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("Photos");
  const [expanded, setExpanded] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [arrival, setArrival] = useState(17);
  const [departure, setDeparture] = useState(19);
  const [datePicking, setDatePicking] = useState<"arrival" | "departure">("arrival");
  const [guests, setGuests] = useState(2);
  const [toast, setToast] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observers = sections.map((name) => {
      const node = document.getElementById(name.toLowerCase());
      if (!node) return null;
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(name);
        },
        { rootMargin: "-22% 0px -68% 0px" }
      );
    });
    sections.forEach((name, index) => {
      const node = document.getElementById(name.toLowerCase());
      if (node && observers[index]) observers[index]?.observe(node);
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  const modalOpen = showAmenities || showReviews || messageOpen;
  useEffect(() => {
    if (!modalOpen) {
      focusReturnRef.current?.focus();
      focusReturnRef.current = null;
      return;
    }
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.querySelector<HTMLElement>("button, input, a[href]")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "Tab" && modalRef.current) {
        const nodes = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalOpen]);

  function openModal(kind: "amenities" | "reviews" | "message") {
    focusReturnRef.current = document.activeElement as HTMLElement;
    setShowAmenities(kind === "amenities");
    setShowReviews(kind === "reviews");
    setMessageOpen(kind === "message");
  }

  function closeModal() {
    setShowAmenities(false);
    setShowReviews(false);
    setMessageOpen(false);
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function shareListing() {
    try {
      if (navigator.share) await navigator.share({ title: villa.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        notify("Link copied");
      }
    } catch {
      /* Share sheet dismissed. */
    }
  }

  function openPhotoTour(index?: number) {
    const path = `/rooms/${id ?? villa.id}/photos`;
    navigate(index === undefined ? path : `${path}?photo=${index + 1}`, {
      state: { gallery: true }
    });
  }

  function selectDate(day: number) {
    if (datePicking === "arrival") {
      setArrival(day);
      if (day >= departure) setDeparture(Math.min(day + 1, 31));
      setDatePicking("departure");
    } else {
      if (day <= arrival) setArrival(day);
      else setDeparture(day);
      setDatePicking("arrival");
    }
  }

  function scrollToSection(name: string) {
    document
      .getElementById(name.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const dateRange = useMemo(() => `Jul ${arrival} – Jul ${departure}, 2026`, [arrival, departure]);

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid h-[66px] max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-0 sm:px-8 lg:h-[72px] lg:px-12">
          <button
            onClick={() => navigate("/")}
            aria-label="Airbnb home"
            className="flex h-9 w-7 shrink-0 items-center justify-center text-airbnb sm:h-auto sm:w-fit sm:justify-start"
          >
            <AirbnbMark />
            <span className="hidden text-[21px] font-bold tracking-[-1px] sm:inline">airbnb</span>
          </button>
          <button
            onClick={() => scrollToSection("Location")}
            aria-label="Search location, dates, and guests"
            className="flex h-10 min-w-0 w-full items-center justify-self-stretch whitespace-nowrap rounded-full border border-line px-2 text-[9px] shadow-sm transition hover:shadow-card sm:h-11 sm:w-auto sm:justify-self-auto sm:px-5 sm:text-xs"
          >
            <span className="font-semibold">Where to?</span>
            <span className="mx-1.5 hidden h-4 w-px shrink-0 bg-line sm:block sm:mx-3" />
            <span className="hidden sm:inline">Any week</span>
            <span className="mx-1.5 hidden h-4 w-px shrink-0 bg-line sm:block sm:mx-3" />
            <span className="hidden text-muted sm:inline">Add guests</span>
            <span className="ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-airbnb text-white sm:ml-4 sm:h-7 sm:w-7">
              <SlidersHorizontal size={12} className="sm:h-[14px] sm:w-[14px]" />
            </span>
          </button>
          <nav
            className="flex items-center justify-end gap-2 sm:gap-4"
            aria-label="Main navigation"
          >
            <button
              onClick={() => navigate("/")}
              className="hidden rounded-full px-3 py-2 text-xs font-semibold hover:bg-gray-50 sm:inline-flex"
            >
              Homes
            </button>
            <button className="hidden rounded-full px-3 py-2 text-xs text-muted hover:bg-gray-50 md:inline-flex">
              Experiences
            </button>
            <button
              onClick={() => openModal("message")}
              className="hidden rounded-full px-3 py-2 text-xs text-muted hover:bg-gray-50 lg:inline-flex"
            >
              Help
            </button>
            <button
              aria-label="Choose language and currency"
              className="hidden h-10 w-10 place-items-center rounded-full hover:bg-gray-50 sm:grid"
            >
              <Globe2 size={17} />
            </button>
            <button
              aria-label="Open menu"
              className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-line py-1 pl-2 pr-1 sm:pl-3"
            >
              <Menu size={16} />
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#b77968] text-xs font-semibold text-white">
                S
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 pb-4 pt-5 sm:items-center sm:pb-5 sm:pt-7">
          <div>
            <h1 className="text-[21px] font-semibold leading-tight tracking-[-.2px] sm:text-[25px]">
              {villa.title}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <MapPin size={13} />
              <span>{villa.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={shareListing}
              className="flex min-h-11 items-center gap-2 rounded-full px-2 text-xs font-medium underline underline-offset-2 transition hover:bg-gray-50 active:scale-[.97]"
              aria-label="Share listing"
            >
              <Share size={15} />
              <span>{shareCopied ? "Copied" : "Share"}</span>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              aria-pressed={saved}
              className="flex min-h-11 items-center gap-2 rounded-full px-2 text-xs font-medium underline underline-offset-2 transition hover:bg-gray-50 active:scale-[.97]"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart size={16} className={saved ? "fill-airbnb text-airbnb" : ""} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        <section
          id="photos"
          className="relative grid h-[260px] grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-xl sm:h-[330px] sm:gap-2 lg:h-[380px] lg:grid-cols-[1.14fr_1fr_1fr]"
          aria-label="Property photos"
        >
          {villa.photos.slice(0, 5).map((photo, index) => {
            const srcSet = buildSrcSet(photo.src, [480, 720, 1080, 1500]);
            return (
              <button
                key={photo.id}
                onClick={() => openPhotoTour(index)}
                aria-label={`Open photo ${index + 1}: ${photo.alt}`}
                className={`group relative min-h-0 min-w-0 overflow-hidden bg-gray-100 ${index === 0 ? "col-span-2 row-span-2 lg:col-span-1" : "hidden lg:block"}`}
              >
                <img
                  src={photo.src}
                  srcSet={srcSet}
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 100vw, 41vw"
                      : "(max-width: 1024px) 48vw, 28vw"
                  }
                  alt={photo.alt}
                  width="1200"
                  height="800"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                />
                <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
              </button>
            );
          })}
          <button
            onClick={() => openPhotoTour()}
            className="absolute bottom-4 right-4 flex h-10 items-center gap-2 rounded-lg border border-ink/80 bg-white px-3 text-xs font-semibold shadow-sm transition hover:bg-gray-50 active:scale-[.97]"
          >
            <span aria-hidden="true">▦</span>Show all photos
          </button>
        </section>

        <nav
          className="sticky top-[66px] z-30 -mx-5 mt-5 border-b border-gray-200 bg-white/95 px-5 backdrop-blur-xl sm:top-[72px] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
          aria-label="Listing sections"
        >
          <div className="mx-auto flex h-[54px] max-w-[1320px] items-stretch gap-7 overflow-x-auto">
            {sections.map((name) => (
              <button
                key={name}
                onClick={() => scrollToSection(name)}
                aria-current={activeSection === name ? "location" : undefined}
                className={`relative shrink-0 text-xs font-semibold transition ${activeSection === name ? "text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-ink" : "text-muted hover:text-ink"}`}
              >
                {name}
              </button>
            ))}
          </div>
        </nav>

        <div className="grid gap-8 pt-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,.9fr)_minmax(300px,.92fr)] lg:gap-7 xl:gap-9">
          <div className="min-w-0">
            <section className="flex items-center justify-between border-b border-line py-5">
              <div>
                <h2 className="text-lg font-semibold">Entire home hosted by {villa.host.name}</h2>
                <p className="mt-1 text-xs text-muted">
                  {villa.guests} guests · {villa.bedrooms} bedrooms · {villa.beds} beds ·{" "}
                  {villa.baths} baths
                </p>
              </div>
              <div className="relative">
                <img
                  src={villa.host.avatar}
                  alt={`${villa.host.name}, your host`}
                  className="h-[50px] w-[50px] rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-2 grid h-6 w-6 place-items-center rounded-full bg-airbnb text-white">
                  <Star size={12} fill="currentColor" />
                </span>
              </div>
            </section>
            <section className="border-b border-line py-5">
              <h2 className="mb-4 text-base font-semibold">Highlights</h2>
              {[
                {
                  icon: ShieldCheck,
                  title: "Self check-in",
                  text: "Check yourself in with the lockbox."
                },
                {
                  icon: MapPin,
                  title: "Great location",
                  text: "100% of recent guests gave the location a 5-star rating."
                },
                {
                  icon: Sparkles,
                  title: "Free cancellation",
                  text: "Full refund up to 24 hours before check-in."
                }
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3 py-2">
                  <Icon size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs font-semibold">{title}</h3>
                    <p className="mt-1 text-[11px] leading-4 text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </section>
            <section className="border-b border-line py-5">
              <h2 className="mb-3 text-base font-semibold">About this place</h2>
              <p className={`text-xs leading-5 text-[#484848] ${expanded ? "" : "line-clamp-4"}`}>
                {villa.description}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold underline underline-offset-2"
              >
                {expanded ? "Show less" : "Show more"}
                <ArrowRight size={13} />
              </button>
            </section>
            <section className="border-b border-line py-5">
              <h2 className="mb-4 text-base font-semibold">Sleeping arrangements</h2>
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                {[
                  "Bedroom 1 · 1 king bed",
                  "Bedroom 2 · 1 queen bed",
                  "Bedroom 3 · 2 single beds"
                ].map((room) => (
                  <div key={room} className="rounded-xl border border-line p-4">
                    <BedDouble size={20} />
                    <p className="mt-3 text-[11px] font-semibold">{room.split(" · ")[0]}</p>
                    <span className="mt-1 block text-[10px] text-muted">
                      {room.split(" · ")[1]}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            <section id="amenities" className="scroll-mt-28 border-b border-line py-5">
              <h2 className="mb-4 text-base font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {villa.amenities.slice(0, 8).map((item, index) => (
                  <div key={item} className="flex items-center gap-2 text-[11px]">
                    {index === 0 ? (
                      <Wifi size={15} />
                    ) : index === 1 ? (
                      <House size={15} />
                    ) : index === 2 ? (
                      <Waves size={15} />
                    ) : (
                      <Check size={15} />
                    )}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => openModal("amenities")}
                className="mt-4 min-h-10 rounded-lg border border-ink px-4 text-xs font-semibold transition hover:bg-gray-50"
              >
                Show all {villa.amenities.length} amenities
              </button>
            </section>
          </div>

          <div className="min-w-0 space-y-5">
            <section className="rounded-xl border border-line p-4">
              <h2 className="text-sm font-semibold">Availability</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {months.map((month, monthIndex) => (
                  <div key={month.name}>
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        aria-label="Previous month"
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-gray-100"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      <h3 className="text-[11px] font-semibold">{month.name} 2026</h3>
                      <button
                        aria-label="Next month"
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-gray-100"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7">
                      {weekdays.map((day, i) => (
                        <span
                          key={`${month.name}-${day}-${i}`}
                          className="grid h-6 place-items-center text-[8px] text-muted"
                        >
                          {day}
                        </span>
                      ))}
                      {Array.from({ length: month.offset }, (_, i) => (
                        <i key={`offset-${month.name}-${i}`} />
                      ))}
                      {Array.from({ length: month.days }, (_, i) => {
                        const day = i + 1;
                        const active = monthIndex === 0 && (arrival === day || departure === day);
                        return (
                          <button
                            key={`${month.name}-${day}`}
                            onClick={() =>
                              monthIndex === 0 &&
                              (datePicking === "arrival"
                                ? (setArrival(day), setDatePicking("departure"))
                                : selectDate(day))
                            }
                            className={`grid aspect-square place-items-center rounded-full text-[9px] hover:bg-gray-100 ${active ? "bg-airbnb text-white hover:bg-airbnb" : ""}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-[9px] text-muted">
                <span>◦ Available</span>
                <span className="text-airbnb">● Selected</span>
                <span>⊘ Unavailable</span>
              </div>
            </section>
            <section id="reviews" className="scroll-mt-28 rounded-xl border border-line p-4">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Star size={16} fill="currentColor" />
                {villa.rating}
                <span className="text-xs font-normal text-muted">
                  ({villa.reviewCount} reviews)
                </span>
              </h2>
              <div className="mt-4 space-y-2">
                {[
                  { label: "5", value: 92 },
                  { label: "4", value: 4 },
                  { label: "3", value: 1 },
                  { label: "2", value: 1 },
                  { label: "1", value: 2 }
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[14px_1fr_25px] items-center gap-2 text-[9px]"
                  >
                    <span>{label}</span>
                    <div className="h-1 rounded-full bg-gray-100">
                      <i className="block h-1 rounded-full bg-ink" style={{ width: `${value}%` }} />
                    </div>
                    <span className="text-right">{value}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <img
                    src={villa.reviews[0].avatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[10px] font-semibold">{villa.reviews[0].name}</p>
                    <p className="text-[9px] text-muted">{villa.reviews[0].date}</p>
                  </div>
                  <span className="ml-auto text-xs">★★★★★</span>
                </div>
                <p className="mt-2 line-clamp-3 text-[10px] leading-4 text-[#484848]">
                  {villa.reviews[0].text}
                </p>
              </div>
              <button
                onClick={() => openModal("reviews")}
                className="mt-3 min-h-9 text-[10px] font-semibold underline underline-offset-2"
              >
                Show all reviews
              </button>
            </section>
            <section
              id="location"
              className="scroll-mt-28 overflow-hidden rounded-xl border border-line"
            >
              <div className="map-visual relative h-[150px] overflow-hidden">
                <span className="absolute left-[42%] top-[34%] text-[10px] font-semibold text-[#465047]">
                  Uluwatu
                </span>
                <span className="absolute left-[52%] top-[50%] text-airbnb">
                  <MapPin size={26} fill="currentColor" />
                </span>
              </div>
              <div className="p-4">
                <h2 className="text-xs font-semibold">{villa.address}</h2>
                <p className="mt-2 text-[10px] leading-4 text-muted">
                  Located in the heart of Uluwatu, this villa is a short drive from the beach, local
                  restaurants, and popular attractions.
                </p>
                <button className="mt-2 text-[10px] font-semibold underline">Show more</button>
              </div>
            </section>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-[90px] lg:self-start">
            <section className="rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xl font-semibold">${villa.pricePerNight}</strong>
                  <span className="ml-1 text-xs text-muted">/ night</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold">
                  <Star size={12} fill="currentColor" />
                  {villa.rating}
                  <span className="font-normal text-muted">({villa.reviewCount} reviews)</span>
                </span>
              </div>
              <div className="relative mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-line">
                <button
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowGuests(false);
                  }}
                  className="min-h-[48px] border-r border-line px-3 py-2 text-left"
                >
                  <span className="block text-[8px] font-bold uppercase">Check-in</span>
                  <span className="mt-1 block text-[10px]">Jul {arrival}, 2026</span>
                </button>
                <button
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowGuests(false);
                    setDatePicking("departure");
                  }}
                  className="min-h-[48px] px-3 py-2 text-left"
                >
                  <span className="block text-[8px] font-bold uppercase">Check-out</span>
                  <span className="mt-1 block text-[10px]">Jul {departure}, 2026</span>
                </button>
                <button
                  onClick={() => {
                    setShowGuests(!showGuests);
                    setShowCalendar(false);
                  }}
                  className="col-span-2 flex min-h-[48px] items-center justify-between border-t border-line px-3 py-2 text-left"
                >
                  <span>
                    <b className="block text-[8px] uppercase">Guests</b>
                    <small className="mt-1 block text-[10px]">
                      {guests} guest{guests === 1 ? "" : "s"}
                    </small>
                  </span>
                  <ChevronDown size={15} />
                </button>
                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      className="absolute left-0 top-[100px] z-20 w-full rounded-xl border border-line bg-white p-4 shadow-popover"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={spring}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <button
                          aria-label="Previous month"
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-50"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-semibold">July 2026</span>
                        <button
                          aria-label="Next month"
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-50"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-7">
                        {weekdays.map((day, i) => (
                          <span
                            key={`book-${day}-${i}`}
                            className="grid h-7 place-items-center text-[9px] text-muted"
                          >
                            {day}
                          </span>
                        ))}
                        {Array.from({ length: 3 }, (_, i) => (
                          <i key={`book-offset-${i}`} />
                        ))}
                        {Array.from({ length: 31 }, (_, i) => {
                          const day = i + 1;
                          return (
                            <button
                              key={`book-day-${day}`}
                              onClick={() => {
                                if (datePicking === "arrival") {
                                  setArrival(day);
                                  setDatePicking("departure");
                                } else {
                                  setDeparture(Math.max(day, arrival + 1));
                                  setDatePicking("arrival");
                                  setShowCalendar(false);
                                }
                              }}
                              className={`grid aspect-square place-items-center rounded-full text-[10px] hover:bg-gray-100 ${day === arrival || day === departure ? "bg-airbnb text-white" : ""}`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 border-t border-gray-100 pt-3 text-[9px] text-muted">
                        {dateRange}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {showGuests && (
                    <motion.div
                      className="absolute left-0 top-[100px] z-20 w-full rounded-xl border border-line bg-white p-4 shadow-popover"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={spring}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-xs">Guests</strong>
                          <p className="mt-1 text-[9px] text-muted">Maximum {villa.guests}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            aria-label="Decrease guests"
                            className="grid h-8 w-8 place-items-center rounded-full border border-line"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs">{guests}</span>
                          <button
                            onClick={() => setGuests(Math.min(villa.guests, guests + 1))}
                            aria-label="Increase guests"
                            className="grid h-8 w-8 place-items-center rounded-full border border-line"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => notify("Your dates are ready to reserve")}
                className="mt-3 h-11 w-full rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] text-sm font-semibold text-white transition active:scale-[.97]"
              >
                Reserve
              </button>
              <p className="mt-2 text-center text-[9px] text-muted">You won’t be charged yet</p>
              <div className="mt-4 space-y-2 text-[10px]">
                <div className="flex justify-between text-muted">
                  <span>${villa.pricePerNight} x 7 nights</span>
                  <span>$1,743</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Cleaning fee</span>
                  <span>$60</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Service fee</span>
                  <span>$174</span>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-xs font-semibold">
                  <span>Total</span>
                  <span>$1,977</span>
                </div>
              </div>
            </section>
            <section className="mt-4 rounded-xl border border-line p-4">
              <div className="flex items-center gap-3">
                <img
                  src={villa.host.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xs font-semibold">{villa.host.name}</h2>
                  <p className="mt-1 text-[9px] text-muted">
                    Superhost · {villa.host.years} years hosting
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-muted">
                I love hosting guests and sharing the beauty of Bali with them.
              </p>
              <div className="mt-3 grid grid-cols-3 border-y border-line py-3 text-center">
                <div>
                  <strong className="block text-xs">124</strong>
                  <span className="text-[8px] text-muted">Reviews</span>
                </div>
                <div>
                  <strong className="block text-xs">4.92</strong>
                  <span className="text-[8px] text-muted">Rating</span>
                </div>
                <div>
                  <strong className="block text-xs">5</strong>
                  <span className="text-[8px] text-muted">Years hosting</span>
                </div>
              </div>
              <button
                onClick={() => openModal("message")}
                className="mt-3 min-h-10 w-full rounded-lg border border-ink text-xs font-semibold hover:bg-gray-50"
              >
                Message host
              </button>
            </section>
          </aside>
        </div>

        <section className="border-b border-line py-8">
          <h2 className="mb-5 text-lg font-semibold">Things to know</h2>
          <div className="grid gap-5 text-xs sm:grid-cols-3">
            <div>
              <h3 className="mb-3 font-semibold">House rules</h3>
              <p className="mb-2 text-muted">Check-in: 3:00 PM–10:00 PM</p>
              <p className="mb-2 text-muted">Checkout before 11:00 AM</p>
              <p className="text-muted">6 guests maximum</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Safety & property</h3>
              <p className="mb-2 text-muted">Pool without a gate or lock</p>
              <p className="mb-2 text-muted">Carbon monoxide alarm</p>
              <p className="text-muted">Smoke alarm</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Cancellation policy</h3>
              <p className="text-muted">
                Free cancellation before 24 hours. Review the Host’s full policy for details.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-[#f7f7f7]">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-5 py-5 text-[10px] text-[#484848] sm:px-8 lg:px-12">
          <span>© 2025 Airbnb, Inc.</span>
          <div className="flex gap-3">
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Help</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Sitemap</a>
          </div>
          <div className="flex gap-3">
            <Globe2 size={13} />
            <span>English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-black/35 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => event.target === event.currentTarget && closeModal()}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={
                showAmenities ? "All amenities" : showReviews ? "Guest reviews" : "Message host"
              }
              className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={spring}
            >
              <button
                onClick={closeModal}
                aria-label="Close dialog"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
              {showAmenities ? (
                <>
                  <h2 className="mb-5 pr-12 text-lg font-semibold">What this place offers</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {villa.amenities.map((amenity, index) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 border-b border-gray-100 pb-3 text-sm"
                      >
                        {index === 0 ? (
                          <Wifi size={17} />
                        ) : index === 2 ? (
                          <Waves size={17} />
                        ) : (
                          <Check size={17} />
                        )}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : showReviews ? (
                <>
                  <h2 className="mb-5 pr-12 text-lg font-semibold">
                    ★ {villa.rating} · {villa.reviewCount} reviews
                  </h2>
                  <div className="space-y-6">
                    {villa.reviews.map((review) => (
                      <article key={review.name} className="border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-sm font-semibold">{review.name}</h3>
                            <p className="text-xs text-muted">{review.date}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6">{review.text}</p>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-2 pr-12 text-lg font-semibold">Message {villa.host.name}</h2>
                  <p className="mb-5 text-sm text-muted">
                    Ask about the villa or your stay in Bali.
                  </p>
                  <textarea
                    aria-label="Message to host"
                    className="min-h-32 w-full resize-y rounded-xl border border-line p-3 text-sm"
                    placeholder="Write your message..."
                  />
                  <button
                    onClick={() => {
                      closeModal();
                      notify("Message ready to send");
                    }}
                    className="mt-4 h-11 w-full rounded-lg bg-ink text-sm font-semibold text-white"
                  >
                    Continue
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-xs font-semibold text-white shadow-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {window.location.pathname.endsWith("/photos") && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-[100] grid place-items-center bg-[#1f1f1f] text-sm text-white">
                Loading photos…
              </div>
            }
          >
            <GalleryExperience photos={villa.photos.slice(0, 5)} title={villa.title} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
