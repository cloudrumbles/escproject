export interface Hotel {
    id: string;
    name: string;
    starRating: number;
    guestRating: number;
    price: number;
    image: string;
  }
  
  export interface FilterState {
    starRating: number[];
    guestRating: number;
    priceRange: [number, number];
  }