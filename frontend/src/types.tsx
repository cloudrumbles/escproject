export interface Hotel {
    id: string;
    name: string;
    starRating: number;
    guestRating: number;
    price: number;
    image: string;
    description: string;
  }
  
export interface FilterState {
starRating: number[];
guestRating: number;
priceRange: [number, number];
}

export interface Room {
id: string;
name: string;
description: string;
price: number;
capacity: number;
}