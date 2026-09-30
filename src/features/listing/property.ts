export type VillaPhoto = { id: string; src: string; alt: string };

export type VillaProperty = {
  id: string;
  title: string;
  location: string;
  address: string;
  rating: string;
  reviewCount: number;
  pricePerNight: number;
  host: { name: string; years: number; avatar: string };
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  description: string;
  amenities: string[];
  photos: VillaPhoto[];
  reviews: { name: string; date: string; text: string; avatar: string }[];
  coordinates: { latitude: number; longitude: number };
};

const photoIds = [
  "photo-1571896349842-33c89424de2d",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600210492486-724fe5c67fb0",
  "photo-1600607687920-4e2a09cf159d",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1600607687644-c7171b42498f",
  "photo-1564013799919-ab600027ffc6",
  "photo-1540541338287-41700207dee6",
  "photo-1570213489059-0aac6626cade",
  "photo-1566073771259-6a8506099945",
  "photo-1512917774080-9991f1c4c750",
  "photo-1571003123894-1f0594d2b5d9",
  "photo-1582719508461-905c673771fd",
  "photo-1576013551627-0cc20b96c2a7",
  "photo-1613977257363-707ba9348227",
  "photo-1584132967334-10e028bd69f7",
  "photo-1578683010236-d716f9a3f461",
  "photo-1590490360182-c33d57733427",
  "photo-1520250497591-112f2f40a3f4",
  "photo-1551882547-ff40c63fe5fa",
  "photo-1601918774946-25832a4be0d6",
  "photo-1611892440504-42a792e24d32",
  "photo-1631049307264-da0ec9d70304",
  "photo-1571508601891-ca5e7a713859",
  "photo-1615874959474-d609969a20ed"
];

const photoAlts = [
  "Ocean-facing infinity pool at sunset",
  "Open-plan villa lounge with views of the sea",
  "Bright living room with a terrace beyond",
  "Private pool framed by tropical greenery",
  "Warm dining room with timber finishes",
  "Calm bedroom with a view over the garden",
  "Modern tropical villa surrounded by palms",
  "Infinity pool at a hillside resort",
  "Outdoor lounge beside the pool",
  "Villa bedroom dressed in natural linen",
  "Stone terrace overlooking the water",
  "Sunset view from the swimming pool",
  "Open-air dining pavilion at the villa",
  "Pool deck with loungers and tropical plants",
  "Exterior of a modern Bali villa",
  "Guest suite with a private balcony",
  "King bedroom with soft neutral details",
  "Guest bedroom with a garden view",
  "Living space with full-height windows",
  "Covered terrace set for dinner",
  "Small sitting room with woven furniture",
  "Bathroom with natural stone and warm wood",
  "Bedroom opening onto the garden",
  "Poolside cabana under palm trees",
  "Golden hour over the ocean and villa"
];

export const villa: VillaProperty = {
  id: "bali-villa",
  title: "Modern Villa with Ocean View",
  location: "Bali, Indonesia",
  address: "Uluwatu, Bali, Indonesia",
  rating: "4.92",
  reviewCount: 128,
  pricePerNight: 249,
  host: {
    name: "Sarah",
    years: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces"
  },
  guests: 6,
  bedrooms: 3,
  beds: 4,
  baths: 2,
  description:
    "Welcome to our modern villa in Bali, offering stunning ocean views, a private infinity pool, and the perfect space to relax. Enjoy the open living area with a modern kitchen and traditional Balinese details, surrounded by lush tropical gardens and the sound of the sea.",
  amenities: [
    "Wifi",
    "Kitchen",
    "Pool",
    "Free parking",
    "Air conditioning",
    "TV",
    "Washer",
    "Dryer",
    "Ocean view",
    "Outdoor dining area",
    "Dedicated workspace",
    "Hair dryer",
    "Hot water",
    "Bed linens",
    "Refrigerator",
    "Cooking basics",
    "Private entrance",
    "Patio",
    "BBQ grill",
    "Security cameras",
    "Smoke alarm",
    "First aid kit",
    "Long-term stays allowed",
    "Luggage dropoff"
  ],
  photos: photoIds.map((id, index) => ({
    id: `${id}-${index}`,
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1500&q=85`,
    alt: photoAlts[index]
  })),
  reviews: [
    {
      name: "Emma",
      date: "June 2025",
      text: "Amazing place! The villa was even better than expected. The view is breathtaking and the pool is perfect.",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Oliver",
      date: "May 2025",
      text: "We loved waking up to the ocean each morning. Sarah was a wonderful host and made everything easy.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Maya",
      date: "April 2025",
      text: "A peaceful, beautifully designed place. The sunsets from the infinity pool are unforgettable.",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    }
  ],
  coordinates: { latitude: -8.829, longitude: 115.084 }
};
