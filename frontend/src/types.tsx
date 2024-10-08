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
    rating: number; 
    imageCount: number;
    categories: Categories[]; 
    image_details: Image_details;
    default_image_index: number;
}

export interface Categories {
    [key: string]: {
        name: string;
        score: number;
    };
}

export interface Image_details {
    prefix: string;
    count: number;
    suffix: string;
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
    destination_id: string;
    checkin: string;
    checkout: string;
    guests: number;
    rooms: number;
  }


  export interface HotelCardProps {
    id: string;
    name: string;
    address: string;
    starRating: number;
    guestRating: number;
    price: number;
    imageUrl: string;
  }

  export interface HotelData {
    name?: string;
    address?: string;
    rating?: number;
    trustyou?: {
      score?: {
        overall?: number;
      };
    };
    categories?: {
      [key: string]: {
        name?: string;
        score?: number;
      };
    };
    amenities_ratings?: Array<{
      name?: string;
      score?: number;
    }>;
  }