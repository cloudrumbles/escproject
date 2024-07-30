export interface Destination {
    UID: string;
    Term: string;
    Lat: number;
    Lng: number;
    State: string;
    Type: 'City' | 'Hotel';
  }
  
  export interface Hotel {
    UID: string;
    Name: string;
    Address: string;
    Rating: number;
    LonLat: [number, number];
    PhoneNumber: string;
    ContactEmail: string;
    FaxNumber: string;
    Amenities: string[];
    Description: string;
    PostalCode: string;
    City: string;
    State: string;
    CountryCode: string;
    ImageCount: number;
    PrimaryDestinationID?: string;
  }
  
  export interface HotelPrice {
    id: string;
    searchRank: number;
    price: number;
    market_rates: Record<string, number>;
  }
  
  export interface RoomPrice {
    Key: string;
    RoomNormalizedDescription: string;
    FreeCancellation: boolean;
    Description: string;
    LongDescription: string;
    Images: string[];
    Amenities: string[];
    Price: number;
    MarketRates: Record<string, number>;
  }
  
  export interface FilterState {
    starRating: number[];
    guestRating: number;
    priceRange: [number, number];
  }