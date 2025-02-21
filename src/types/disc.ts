export interface Disc {
  discId: string;
  name: string;
  manufacturer: string;
  category: string; // Putter, Midrange, Fairway Driver, Distance Driver
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  image?: string;
}

export interface UserDisc extends Disc {
  condition: string; // New, Like New, Good, Fair, Poor
  weight: number; // in grams
  notes?: string;
  inBag: boolean;
}

export interface DiscCollection {
  discs: UserDisc[];
}

export interface DiscBag {
  name: string;
  discs: UserDisc[];
  maxDiscs: number;
}
