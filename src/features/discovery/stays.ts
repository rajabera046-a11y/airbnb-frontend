export type Stay = {
  id: string;
  kind: "Flat" | "Apartment" | "Villa" | "Hotel";
  area: string;
  price: string;
  rating: string;
  image: string;
  alt: string;
  badge?: string;
  dates: string;
};

const photos = [
  ["photo-1518837695005-2083093ee35b", "Villa with ocean view"],
  ["photo-1613490493576-7fde63acd811", "Beachfront bungalow"],
  ["photo-1505693416388-ac5ce068fe85", "Alpine chalet with views"],
  ["photo-1600607687939-ce8a6c25118c", "Luxury villa with pool"],
  ["photo-1511818966892-d7d671e672a2", "Modern city apartment"],
  ["photo-1600607687920-4e2a09cf159d", "Private villa with pool"],
  ["photo-1600607687939-ce8a6c25118c", "Modern home with a quiet private garden"],
  ["photo-1600210492486-724fe5c67fb0", "Carefully styled lounge with comfortable seating"]
] as const;

const buildImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=720&q=82`;

function row(
  prefix: string,
  areas: string[],
  prices: string[],
  ratings: string[],
  badges = true
): Stay[] {
  return areas.map((area, index) => ({
    id: `${prefix}-${index + 1}`,
    kind: index === 2 ? "Apartment" : index === 5 ? "Villa" : "Flat",
    area,
    price: prices[index],
    rating: ratings[index],
    image: buildImage(photos[index][0]),
    alt: photos[index][1],
    badge: badges && index !== 3 ? "Guest favourite" : undefined,
    dates: "17–19 Jul"
  }));
}

export const stayRows = [
  {
    id: "pune",
    title: "Places to stay in Pune",
    stays: row(
      "pune",
      [
        "Maui, Hawaii",
        "Tulum, Mexico",
        "Zermatt, Switzerland",
        "Santorini, Greece",
        "New York, USA",
        "Bali, Indonesia",
        "Lisbon, Portugal",
        "Amalfi Coast, Italy"
      ],
      ["$2,480", "$1,867", "$2,421", "$2,876", "$2,315", "$2,076", "$1,980", "$2,690"],
      ["4.92", "4.88", "4.95", "4.89", "4.86", "4.91", "4.97", "4.94"]
    )
  },
  {
    id: "goa",
    title: "Popular homes in North Goa",
    stays: row(
      "goa",
      ["Candolim", "Nerul", "Candolim", "Anjuna", "Candolim", "Anjuna", "Anjuna", "Assagao"],
      ["₹10,999", "₹12,896", "₹8,296", "₹7,989", "₹20,339", "₹19,988", "₹30,108", "₹14,760"],
      ["4.93", "4.94", "4.98", "4.92", "4.94", "4.97", "5.00", "4.96"]
    )
  }
];

export const destinations = [
  { name: "Nearby", detail: "Find what's around you", icon: "nearby" },
  { name: "North Goa, Goa", detail: "Popular beach destination", icon: "beach" },
  { name: "Mumbai, Maharashtra", detail: "For sights like Gateway of India", icon: "city" },
  { name: "Udaipur, Rajasthan", detail: "For its stunning architecture", icon: "lake" },
  { name: "Lonavala, Maharashtra", detail: "For nature lovers", icon: "nature" },
  { name: "South Goa, Goa", detail: "Popular beach destination", icon: "beach" },
  { name: "Dubai, United Arab Emirates", detail: "For sights like Burj Khalifa", icon: "city" }
];
