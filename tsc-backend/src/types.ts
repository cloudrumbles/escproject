export interface HotelAPIResponse {
    id: string;
    imageCount: number;
    latitude: number;
    longitude: number;
    name: string;
    address: string;
    address1: string;
    rating: number;
    distance: number;
    trustyou: TrustYouScore;
    categories: Record<string, Category>;
    amenities_ratings: AmenityRating[];
    description: string;
    amenities: Record<string, boolean>;
    original_metadata: OriginalMetadata;
    image_details: ImageDetails;
    hires_image_index: string;
    number_of_images: number;
    default_image_index: number;
    imgix_url: string;
    cloudflare_image_url: string;
}

interface TrustYouScore {
    id: string;
    score: {
        overall: string;
        kaligo_overall: number;
        solo: string;
        couple: string;
        family: string | null;
        business: string | null;
    };
}

interface Category {
    name: string;
    score: number;
    popularity: number | null;
}

interface AmenityRating {
    name: string;
    score: number;
}

interface OriginalMetadata {
    name: string | null;
    city: string;
    state: string | null;
    country: string;
}

interface ImageDetails {
    suffix: string;
    count: number;
    prefix: string;
}


export interface HotelDetails {
    name: string;
    imageUrl: string;
    description: string;
    starRating: number;
    guestRating: number;
    price: number;
    amenities: string[];
    address: Address;
    location: MapCoordinates;
    availableRooms: Room[];
}

export interface HotelListing {
    name: string;
    imageUrl: string;
    price: number;
    starRating: number;
    guestRating: number;
}

export interface RoomDetail {
    key: string;
    description: string;
    normalizedDescription: string;
    type: string;
    freeCancellation: boolean;
    longDescription: string;
    images: RoomImage[];
    amenities: string[];
    price: number;
}

export interface RoomImage {
    url: string;
    highResolutionUrl: string;
    heroImage: boolean;
}

export interface Address {
    street: string;
    city: string;
    country: string;
}

export interface MapCoordinates {
    latitude: number;
    longitude: number;
}

export interface QueryParams {
    destination_id: string;
    checkIn: string;
    checkOut: string;
    lang: string;
    currency: string;
    guests: string;
    partner_id: number;
}

export interface DestinationSuggestion {
    id: string;
    name: string;
}

export interface FilterParams {
    starRating: number;
    guestRating: number;
    minPrice: number;
    maxPrice: number;
}

export interface RoomResponse {
    searchCompleted: boolean | null;
    completed: boolean;
    status: string | null;
    currency: string | null;
    rooms: Room[];
}

export interface Room {
    key: string;
    roomDescription: string;
    roomNormalizedDescription: string;
    type: string;
    free_cancellation: boolean;
    roomAdditionalInfo: RoomAdditionalInfo;
    description: string;
    long_description: string;
    images: RoomImage[];
    amenities: string[];
    price_type: string;
    max_cash_payment: number;
    coverted_max_cash_payment: number;
    points: number;
    bonuses: number;
    bonus_programs: any[]; // You might want to define a more specific type if you know the structure
    bonus_tiers: any[]; // You might want to define a more specific type if you know the structure
    lowest_price: number;
    price: number;
    converted_price: number;
    lowest_converted_price: number;
    chargeableRate: number;
    market_rates: MarketRate[];
    base_rate: number;
    included_taxes_and_fees_total: number;
    excluded_taxes_and_fees_currency: string;
    excluded_taxes_and_fees_total: number;
    excluded_taxes_and_fees_total_in_currency: number;
    included_taxes_and_fees: TaxAndFee[];
}

interface RoomAdditionalInfo {
    breakfastInfo: string;
    displayFields: DisplayFields;
}

interface DisplayFields {
    special_check_in_instructions: string | null;
    check_in_instructions: string | null;
    know_before_you_go: string | null;
    fees_optional: string | null;
    fees_mandatory: string | null;
    kaligo_service_fee: number;
    hotel_fees: any[]; // You might want to define a more specific type if you know the structure
    surcharges: Surcharge[];
}

interface Surcharge {
    type: string;
    amount: number;
}


interface MarketRate {
    supplier: string;
    rate: number;
}

interface TaxAndFee {
    id: string;
    amount: number;
}


interface MarketRate {
    supplier: string;
    rate: number;
}
  
export interface HotelPrices {
id: string;
searchRank: number;
price_type: string;
max_cash_payment: number;
coverted_max_cash_payment: number;
points: number;
bonuses: number;
bonus_programs: any[];
bonus_tiers: any[];
lowest_price: number;
price: number;
converted_price: number;
lowest_converted_price: number;
market_rates: MarketRate[];
}
  
export interface HotelPricesResult {
searchCompleted: null;
completed: boolean;
status: null;
currency: string;
hotels: HotelPrices[];
}