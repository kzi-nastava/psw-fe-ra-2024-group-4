export interface TourObject {
  id?: number;
  name: string;
  description: string;
  image: string;
  imageBase64?: string;
  category: number;
  longitude: number;
  latitude: number;
  userId: number;
  publicStatus: PublicStatus;
}

export enum PublicStatus {
  PRIVATE = 0,
  REQUESTED_PUBLIC = 1,
  PUBLIC = 2
}
// object-category.enum.ts
export enum ObjectCategory {
  Wc = 0,
  Restaurant = 1,
  Parking = 2,
  Viewpoint = 3,
  Church = 4,
  Mosque = 5,
  Bridge = 6,
  Beach = 7,
  Park = 8,
  Fountain = 9,
  ShoppingCenter = 10,
  Museum = 11,
  MarketPlace = 12,
  NightClub = 13,
  Other = 14
}
export interface CategoryDTO {
  id: number;
  name: string;
}
