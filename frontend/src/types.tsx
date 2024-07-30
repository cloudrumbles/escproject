export interface Hotel {
    id: string;
    name: string;
    starRating: number;
    guestRating: number;
    price: number;
    image: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    amenities: string[];
  }
  
  export interface Room {
    id: string;
    name: string;
    description: string;
    price: number;
    freeCancellation: boolean;
    amenities: string[];
  }
  
  export interface FilterState {
    starRating: number[];
    guestRating: number;
    priceRange: [number, number];
  }
  
  export interface SearchParams {
    destinationId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
  }