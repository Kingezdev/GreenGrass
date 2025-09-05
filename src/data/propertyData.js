// data/propertyData.js
export const propertyData = [
  {
    id: 1,
    title: "Modern 3-Bedroom Apartment",
    description: "A spacious and modern 3-bedroom apartment located in the heart of Victoria Island. Features include a fully equipped kitchen, modern bathrooms, and a balcony with city views.",
    price: 1800000,
    location: "Victoria Island, Lagos",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=780&q=80"
    ],
    amenities: ["WiFi", "Parking", "Air Conditioning", "Swimming Pool", "Gym"],
    landlord: {
      id: 1,
      name: "Adebola Johnson",
      verified: true,
      rating: 4.8
    },
    availableFrom: "2023-12-01",
    status: "available"
  },
  {
    id: 2,
    title: "Cozy 2-Bedroom Flat",
    description: "A cozy and affordable 2-bedroom flat in Lekki Phase 1. Perfect for small families or professionals. Close to shopping centers and restaurants.",
    price: 850000,
    location: "Lekki Phase 1, Lagos",
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    ],
    amenities: ["WiFi", "Parking", "Security", "Water Supply"],
    landlord: {
      id: 2,
      name: "Chinedu Okoro",
      verified: true,
      rating: 4.5
    },
    availableFrom: "2023-11-20",
    status: "available"
  },
  {
    id: 3,
    title: "Luxury Villa VI",
    description: "A luxurious villa in a secure estate in Victoria Island. Features a private garden, swimming pool, and modern finishes throughout.",
    price: 3500000,
    location: "Victoria Island, Lagos",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80",
      "https://images.unsplash.com/photo-1600566753052-d04fcf6d7d00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    ],
    amenities: ["WiFi", "Parking", "Air Conditioning", "Swimming Pool", "Gym", "Generator", "Security", "Garden"],
    landlord: {
      id: 3,
      name: "Tunde Ojo",
      verified: true,
      rating: 4.9
    },
    availableFrom: "2023-12-15",
    status: "available"
  },
  {
    id: 4,
    title: "Affordable Studio Apartment",
    description: "A budget-friendly studio apartment in Surulere. Perfect for students or young professionals. Close to public transportation.",
    price: 450000,
    location: "Surulere, Lagos",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1560449752-315d17c5b9bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
    ],
    amenities: ["WiFi", "Security", "Water Supply"],
    landlord: {
      id: 4,
      name: "Funke Adebayo",
      verified: false,
      rating: 4.2
    },
    availableFrom: "2023-11-25",
    status: "available"
  },
  {
    id: 5,
    title: "Executive Duplex in Ikeja",
    description: "A spacious executive duplex located in the heart of Ikeja GRA. Perfect for executives and expatriates. Close to the airport and business districts.",
    price: 2800000,
    location: "Ikeja GRA, Lagos",
    bedrooms: 5,
    bathrooms: 4,
    area: 280,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    ],
    amenities: ["WiFi", "Parking", "Air Conditioning", "Swimming Pool", "Gym", "Generator", "Security", "Garden", "CCTV"],
    landlord: {
      id: 5,
      name: "Bola Ahmed",
      verified: true,
      rating: 4.7
    },
    availableFrom: "2023-12-10",
    status: "available"
  },
  {
    id: 6,
    title: "Waterfront Apartment in Lekki",
    description: "A beautiful waterfront apartment with stunning views of the Lagos lagoon. Modern finishes and premium amenities.",
    price: 2200000,
    location: "Lekki, Lagos",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80"
    ],
    amenities: ["WiFi", "Parking", "Air Conditioning", "Swimming Pool", "Gym", "Generator", "Security", "Waterfront"],
    landlord: {
      id: 6,
      name: "Kemi Adetola",
      verified: true,
      rating: 4.8
    },
    availableFrom: "2023-12-05",
    status: "available"
  }
];

export default propertyData;