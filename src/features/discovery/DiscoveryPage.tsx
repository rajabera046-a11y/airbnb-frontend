import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Globe2,
  House,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  UserRound,
  Waves,
  Headphones,
  BadgeCheck,
  Leaf,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";
import AirbnbMark from "../../shared/ui/AirbnbMark";
import StayRail from "./StayRail";
import { destinations, stayRows } from "./stays";

type GuestCounts = { adults: number; children: number; infants: number; pets: number };
type Panel = "where" | "when" | "who" | null;
type CalendarPoint = { month: number; day: number };

const categories = [
  { label: "Amazing views", icon: Compass },
  { label: "Cabins", icon: House },
  { label: "Beachfront", icon: Waves },
  { label: "Countryside", icon: Trees },
  { label: "Design", icon: Sparkles },
  { label: "Amazing pools", icon: Waves },
  { label: "Tiny homes", icon: House },
  { label: "Lakefront", icon: Waves },
  { label: "Top cities", icon: Building2 },
  { label: "Trending", icon: Star },
  { label: "All homes", icon: House }
];

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];
const monthData = [
  { name: "July", year: 2026, days: 31, start: 3 },
  { name: "August", year: 2026, days: 31, start: 6 }
];
const spring = { type: "spring" as const, stiffness: 340, damping: 32, mass: 0.8 };

function monthLabel(monthIndex: number, day: number) {
  const date = new Date(2026, monthIndex, day);
  return `${date.getDate()} ${date.toLocaleString("en", { month: "short" })}`;
}

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [arrival, setArrival] = useState<CalendarPoint>({ month: 0, day: 17 });
  const [departure, setDeparture] = useState<CalendarPoint>({ month: 0, day: 18 });
  const [dateSelected, setDateSelected] = useState(false);
  const [choosingArrival, setChoosingArrival] = useState(true);
  const [hoverDay, setHoverDay] = useState<CalendarPoint | null>(null);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });
  const [activeCategory, setActiveCategory] = useState("Amazing views");
  const [toast, setToast] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const guestTotal = guests.adults + guests.children;

  useEffect(() => {
    const onScroll = () => {
      const nextIsScrolled = window.scrollY > 12;
      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled));
      if (nextIsScrolled) {
        setSearchOpen(false);
        setActivePanel(null);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setActivePanel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const whereSuggestions = useMemo(
    () =>
      destinations.filter((item) =>
        `${item.name} ${item.detail}`.toLowerCase().includes(destination.toLowerCase())
      ),
    [destination]
  );

  function updateGuest(key: keyof GuestCounts, delta: number) {
    setGuests((current) => ({
      ...current,
      [key]: Math.max(key === "adults" ? 1 : 0, current[key] + delta)
    }));
  }

  function chooseDate(day: number, monthIndex: number) {
    setDateSelected(true);
    const selected = { month: monthIndex, day };
    const selectedOrder = monthIndex * 32 + day;
    const arrivalOrder = arrival.month * 32 + arrival.day;
    if (choosingArrival) {
      setArrival(selected);
      if (selectedOrder >= departure.month * 32 + departure.day)
        setDeparture({ month: monthIndex, day: Math.min(day + 1, monthData[monthIndex].days) });
      setChoosingArrival(false);
    } else {
      if (selectedOrder <= arrivalOrder) setArrival(selected);
      else setDeparture(selected);
      setChoosingArrival(true);
    }
  }

  const openStay = useCallback(
    (stay?: { id: string }) => navigate(`/rooms/${stay?.id ?? "bali-villa"}`),
    [navigate]
  );

  function applySearch() {
    if (!searchOpen) {
      setActivePanel("where");
      setSearchOpen(true);
      return;
    }
    setSearchOpen(false);
    setActivePanel(null);
    setToast("Search updated");
    window.setTimeout(() => setToast(""), 2200);
  }

  const selectedDestination = destination || "Search destinations";
  const dateSummary = dateSelected
    ? `${monthLabel(arrival.month, arrival.day)} – ${monthLabel(departure.month, departure.day)}`
    : "Any week";
  const guestSummary = `${guestTotal} guest${guestTotal === 1 ? "" : "s"}`;

  return (
    <div className="discovery-screen relative min-h-screen overflow-hidden text-white">
      <div className="discovery-backdrop pointer-events-none fixed inset-0" aria-hidden="true" />
      <header className="relative z-40 pb-3 sm:pb-4">

        <div className="relative z-10 mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:h-[80px] sm:px-8 xl:px-14">
          <a href="#top" aria-label="Airbnb homepage" className="flex items-center gap-2 text-airbnb">
            <AirbnbMark />
            <span className="text-[21px] font-bold tracking-[-1px] text-white">airbnb</span>
          </a>

          <nav className="absolute left-1/2 hidden h-11 -translate-x-1/2 items-center gap-1 rounded-full border border-white/35 bg-white/15 p-1 shadow-[0_8px_28px_rgba(0,0,0,.12)] backdrop-blur-xl md:flex" aria-label="Main navigation">
            <button
              className="flex h-9 items-center gap-2 rounded-full bg-white/85 px-4 text-[12px] font-semibold text-[#ed315e] shadow-sm"
              aria-current="page"
            >
              <House size={14} strokeWidth={1.8} />
              Homes
            </button>
            <button className="flex h-9 items-center gap-2 rounded-full px-4 text-[12px] font-medium text-white/90 transition hover:bg-white/15">
              <Compass size={14} strokeWidth={1.8} />
              Experiences
            </button>
            <button className="flex h-9 items-center gap-2 rounded-full px-4 text-[12px] font-medium text-white/90 transition hover:bg-white/15">
              <Sparkles size={14} strokeWidth={1.8} />
              Services
            </button>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button className="hidden rounded-full px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-white/10 sm:inline-flex">
              Become a host
            </button>
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white/20 sm:flex"
              aria-label="Choose language and currency"
            >
              <Globe2 size={15} className="text-white" />
            </button>
            <button
              className="flex h-10 items-center gap-2 rounded-full border border-white/35 bg-white/15 py-1 pl-3 pr-1 shadow-[0_8px_24px_rgba(0,0,0,.12)] backdrop-blur-md"
              aria-label="Open menu"
            >
              <Menu size={15} className="text-white" />
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#f6d9d8] to-[#e7b6ae] text-[11px] font-semibold text-[#43342f]">
                A
              </span>
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-4 pt-1 sm:px-8 sm:pb-5 xl:px-14">
          <div className="mb-4 max-w-[560px]">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[10px] font-medium text-white/95 backdrop-blur-md sm:text-[11px]">
              <Sparkles size={12} />
              Live anywhere
            </div>
            <h1 className="text-[28px] font-semibold leading-[1.03] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.25)] sm:text-[34px]">
              Find a stay that<br />
              <span className="text-[#ff92b4]">feels like home</span>
            </h1>
            <p className="mt-2 max-w-[360px] text-[12px] leading-[1.45] text-white/90 sm:text-[13px]">
              From cozy cabins to stunning villas, discover your next escape.
            </p>
          </div>

          <div
            className={`relative z-30 mx-auto max-w-[1040px] px-0 transition-all duration-200 ${isScrolled ? "pointer-events-none -translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}
          >
            <div className="mx-auto flex min-h-[66px] max-w-[1040px] items-center rounded-full border border-white/45 bg-white/25 px-2 shadow-[0_12px_34px_rgba(0,0,0,.2)] backdrop-blur-2xl sm:min-h-[72px] sm:px-3">
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setActivePanel("where");
                }}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-2 text-left transition hover:bg-white/15 sm:gap-3 sm:px-4"
                aria-label="Choose a destination"
                aria-expanded={searchOpen && activePanel === "where"}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ff9cba] to-[#e74e91] text-white shadow-[0_4px_12px_rgba(190,48,107,.28)] sm:h-10 sm:w-10">
                  <MapPin size={16} />
                </span>
                <span className="hidden min-w-0 flex-1 sm:block">
                  <strong className="block text-[10px] font-semibold text-white sm:text-[11px]">Where</strong>
                  <span className="mt-0.5 block truncate text-[10px] text-white/85 sm:text-[11px]">
                    {selectedDestination}
                  </span>
                </span>
                <ChevronDown size={12} className="mr-1 shrink-0 text-white/80 sm:mr-2" />
              </button>

              <button
                onClick={() => {
                  setSearchOpen(true);
                  setActivePanel("when");
                }}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-l border-white/25 px-2 text-left transition hover:bg-white/15 sm:gap-3 sm:px-4"
                aria-label="Choose travel dates"
                aria-expanded={searchOpen && activePanel === "when"}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c5afff] to-[#8176df] text-white shadow-[0_4px_12px_rgba(97,83,190,.25)] sm:h-10 sm:w-10">
                  <CalendarDays size={15} />
                </span>
                <span className="hidden min-w-0 flex-1 sm:block">
                  <strong className="block text-[10px] font-semibold text-white sm:text-[11px]">When</strong>
                  <span className="mt-0.5 block truncate text-[10px] text-white/85 sm:text-[11px]">
                    {dateSummary}
                  </span>
                </span>
                <ChevronDown size={12} className="mr-1 shrink-0 text-white/80 sm:mr-2" />
              </button>

              <button
                onClick={() => {
                  setSearchOpen(true);
                  setActivePanel("who");
                }}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-l border-white/25 px-2 text-left transition hover:bg-white/15 sm:gap-3 sm:px-4"
                aria-label="Choose guests"
                aria-expanded={searchOpen && activePanel === "who"}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#9edaf2] to-[#778bdd] text-white shadow-[0_4px_12px_rgba(73,107,181,.25)] sm:h-10 sm:w-10">
                  <UserRound size={15} />
                </span>
                <span className="hidden min-w-0 flex-1 sm:block">
                  <strong className="block text-[10px] font-semibold text-white sm:text-[11px]">Who</strong>
                  <span className="mt-0.5 block truncate text-[10px] text-white/85 sm:text-[11px]">
                    {guestSummary}
                  </span>
                </span>
                <ChevronDown size={12} className="mr-1 shrink-0 text-white/80 sm:mr-2" />
              </button>

              <button
                onClick={applySearch}
                aria-label="Search"
                title="Search"
                className="ml-1 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ff5d98] to-[#e82178] text-white shadow-[0_8px_18px_rgba(224,33,120,.32)] transition hover:brightness-95 active:scale-95 sm:ml-2 sm:h-12 sm:w-12"
              >
                <Search size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

          <AnimatePresence>
            {searchOpen && (
              <>
                <motion.button
                  aria-label="Close search panel"
                  className="fixed inset-0 top-[74px] z-10 cursor-default bg-black/5"
                  onClick={() => {
                    setSearchOpen(false);
                    setActivePanel(null);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.section
                  className="absolute inset-x-0 mx-auto top-[76px] z-20 grid max-h-[calc(100vh-170px)] w-[calc(100vw-24px)] grid-cols-1 overflow-y-auto rounded-[28px] bg-white shadow-[0_22px_60px_rgba(28,33,40,.18)] md:top-[88px] md:w-[min(1220px,calc(100vw-48px))] md:grid-cols-[0.95fr_1.35fr_0.9fr] md:overflow-hidden md:rounded-[32px]"
                  initial={{ opacity: 0, y: -8, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.985 }}
                  transition={spring}
                  aria-label="Search stays"
                >
                  <div
                    className={`min-h-[360px] border-r border-gray-100 p-6 md:p-7 ${activePanel === "where" ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <label className="mb-5 block text-[11px] font-bold uppercase tracking-[.12em] text-[#5b5b5b]">
                      Where
                    </label>
                    <div className="mb-6 flex h-12 items-center gap-3 rounded-2xl border border-[#d9d9d9] bg-white px-3 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] focus-within:border-[#222]">
                      <Search size={18} className="text-[#626262]" />
                      <input
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                        placeholder="Search destinations"
                        className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#222] outline-none placeholder:text-[#6d6d6d]"
                        aria-label="Search destinations"
                      />
                    </div>
                    <h2 className="mb-4 text-[13px] font-semibold text-[#2d2d2d]">Suggested destinations</h2>
                    <ul className="space-y-1.5">
                      {whereSuggestions.slice(0, 6).map((item) => (
                        <li key={item.name}>
                          <button
                            onClick={() => {
                              setDestination(item.name);
                              setActivePanel("when");
                            }}
                            className="flex min-h-[54px] w-full items-center gap-3 rounded-xl px-2 text-left transition hover:bg-[#f7f7f7]"
                          >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e5e5e5] bg-[#fafafa] text-[#4d4d4d]">
                              {item.icon === "beach" ? (
                                <Waves size={18} />
                              ) : item.icon === "city" ? (
                                <Building2 size={18} />
                              ) : item.icon === "nature" ? (
                                <Trees size={18} />
                              ) : item.icon === "lake" ? (
                                <MapPin size={18} />
                              ) : (
                                <Compass size={18} />
                              )}
                            </span>
                            <span className="min-w-0">
                              <strong className="block truncate text-[14px] font-medium text-[#1f1f1f]">
                                {item.name}
                              </strong>
                              <small className="mt-0.5 block truncate text-[11px] text-[#6f6f6f]">
                                {item.detail}
                              </small>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`min-h-[360px] px-5 py-6 md:px-7 md:py-7 ${activePanel === "when" ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <div className="mb-6 flex items-center justify-center gap-2">
                      <button className="rounded-full bg-[#f4f4f4] px-4 py-2 text-[12px] font-semibold text-[#222]">
                        Dates
                      </button>
                      <button className="rounded-full px-4 py-2 text-[12px] text-[#666] transition hover:bg-gray-50">
                        Flexible
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                      {monthData.map((month, monthIndex) => (
                        <div key={month.name} className="min-w-0">
                          <div className="mb-5 flex items-center justify-between px-1">
                            <button
                              aria-label="Previous month"
                              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-gray-100"
                            >
                              <ChevronLeft size={17} />
                            </button>
                            <h3 className="text-[15px] font-semibold text-[#222]">
                              {month.name} {month.year}
                            </h3>
                            <button
                              aria-label="Next month"
                              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-gray-100"
                            >
                              <ChevronRight size={17} />
                            </button>
                          </div>
                          <div className="mb-2 grid grid-cols-7 gap-0">
                            {weekdayLabels.map((label, index) => (
                              <span
                                key={`${label}-${index}`}
                                className="grid h-8 place-items-center text-[10px] font-semibold text-[#7a7a7a]"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-7">
                            {Array.from({ length: month.start }, (_, index) => (
                              <span key={`blank-${month.name}-${index}`} className="aspect-square" />
                            ))}
                            {Array.from({ length: month.days }, (_, index) => {
                              const day = index + 1;
                              const point = monthIndex * 32 + day;
                              const start = arrival.month * 32 + arrival.day;
                              const end = hoverDay
                                ? hoverDay.month * 32 + hoverDay.day
                                : departure.month * 32 + departure.day;
                              const onRange = point > start && point < end;
                              const selected =
                                (arrival.month === monthIndex && arrival.day === day) ||
                                (departure.month === monthIndex && departure.day === day);
                              return (
                                <button
                                  key={`${month.name}-${day}`}
                                  onClick={() => chooseDate(day, monthIndex)}
                                  onMouseEnter={() => setHoverDay({ month: monthIndex, day })}
                                  onMouseLeave={() => setHoverDay(null)}
                                  className={`calendar-day ${selected ? "is-selected" : onRange ? "is-range" : ""}`}
                                  aria-pressed={selected}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                      {["Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days"].map(
                        (choice, index) => (
                          <button
                            key={choice}
                            className={`rounded-full border px-3 py-2 text-[10px] ${index === 0 ? "border-[#222] font-semibold text-[#222]" : "border-gray-200 text-[#666] hover:border-[#222]"}`}
                          >
                            {choice}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    className={`min-h-[360px] border-l border-gray-100 px-5 py-6 md:px-6 md:py-7 ${activePanel === "who" ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[.12em] text-[#5b5b5b]">Who</h2>
                    <div className="space-y-0">
                      {(
                        [
                          { key: "adults", name: "Adults", age: "Ages 13 or above" },
                          { key: "children", name: "Children", age: "Ages 2–12" },
                          { key: "infants", name: "Infants", age: "Under 2" },
                          { key: "pets", name: "Pets", age: "Bringing a service animal?" }
                        ] as const
                      ).map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between border-b border-gray-100 py-[18px] last:border-0"
                        >
                          <div className="min-w-0 pr-5">
                            <strong className="block text-[14px] font-medium text-[#242424]">
                              {item.name}
                            </strong>
                            <span className="mt-1 block text-[10px] text-[#6f6f6f]">{item.age}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              disabled={guests[item.key] <= (item.key === "adults" ? 1 : 0)}
                              onClick={() => updateGuest(item.key, -1)}
                              aria-label={`Decrease ${item.name.toLowerCase()}`}
                              className="grid h-8 w-8 place-items-center rounded-full border border-[#d8d8d8] text-[#666] transition hover:border-[#222] disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-[14px] font-medium text-[#222]">
                              {guests[item.key]}
                            </span>
                            <button
                              onClick={() => updateGuest(item.key, 1)}
                              aria-label={`Increase ${item.name.toLowerCase()}`}
                              className="grid h-8 w-8 place-items-center rounded-full border border-[#d8d8d8] text-[#666] transition hover:border-[#222]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActivePanel(null)}
                      className="mt-6 flex items-center gap-1 text-[11px] font-medium text-[#3a3a3a] underline decoration-[#909090] underline-offset-4"
                    >
                      <CircleHelp size={13} />
                      About guests
                    </button>
                  </div>
                </motion.section>
              </>
            )}
          </AnimatePresence>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-[1440px] px-5 pb-4 pt-1 sm:px-8 xl:px-14">
        <div className="mb-3 flex items-center gap-4 sm:mb-4">
          <h2 className="shrink-0 text-[17px] font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.24)] sm:text-[19px]">
            Stays you&apos;ll love
          </h2>
          <p className="hidden text-[10px] text-white/75 sm:block">Top-rated homes, handpicked for you</p>
          <button className="ml-auto flex h-8 items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 text-[10px] font-medium text-white backdrop-blur-md transition hover:bg-white/20">
            View all <span aria-hidden="true">→</span>
          </button>
        </div>

        {stayRows.slice(0, 1).map((row) => (
          <StayRail key={row.id} title={row.title} stays={row.stays.slice(0, 6)} onSelectStay={openStay} />
        ))}

        <section className="why-airbnb mt-4 grid grid-cols-2 gap-x-3 gap-y-3 rounded-[18px] border border-white/35 bg-white/15 px-4 py-4 shadow-[0_12px_32px_rgba(0,0,0,.16)] backdrop-blur-xl sm:mt-5 sm:grid-cols-[1.05fr_2fr] sm:items-center sm:gap-5 sm:px-5 sm:py-3">
          <img
            src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85"
            alt="Sunset over a tropical island coastline"
            className="col-span-2 hidden h-[82px] w-full rounded-xl object-cover sm:col-span-1 sm:block"
            loading="lazy"
          />
          <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1 sm:grid-cols-4 sm:gap-2">
            <h2 className="col-span-2 text-[12px] font-semibold text-white sm:col-span-4 sm:mb-1 sm:text-[11px]">Why choose Airbnb</h2>
            {[
              { icon: ShieldCheck, title: "Safe & secure", detail: "Your safety is our priority", color: "from-[#8c7bf0] to-[#6856c8]" },
              { icon: Headphones, title: "24/7 support", detail: "We’re here for you", color: "from-[#8c7bf0] to-[#6856c8]" },
              { icon: BadgeCheck, title: "Verified listings", detail: "Quality you can trust", color: "from-[#f18c9d] to-[#df5873]" },
              { icon: Leaf, title: "A more sustainable", detail: "way to travel", color: "from-[#57b7aa] to-[#368f87]" }
            ].map(({ icon: Icon, title, detail, color }) => (
              <div key={title} className="flex min-w-0 items-center gap-2">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${color} text-white shadow-md sm:h-9 sm:w-9`}>
                  <Icon size={15} />
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-[9px] font-semibold text-white sm:text-[9px]">{title}</strong>
                  <span className="mt-0.5 block truncate text-[8px] text-white/75">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 pb-5 pt-3 text-[9px] text-white/80 sm:px-8 xl:px-14">
        <a href="#top" aria-label="Airbnb home" className="flex items-center gap-1 text-white">
          <AirbnbMark />
          <span className="text-[13px] font-bold">airbnb</span>
        </a>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Footer links">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Careers</a>
          <a href="#" className="hover:text-white">Press</a>
          <a href="#" className="hover:text-white">Help</a>
          <a href="#" className="hover:text-white">Safety</a>
        </nav>
        <div className="flex items-center gap-3">
          <Instagram size={13} />
          <Facebook size={12} />
          <span className="text-[11px] font-semibold">X</span>
          <Youtube size={14} />
          <span className="ml-1">© 2026 Airbnb, Inc.</span>
        </div>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-7 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
