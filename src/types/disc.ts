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
  color: string; // Hex color code (e.g., "#ff0000")
}

export interface DiscCollection {
  discs: UserDisc[];
}

export interface DiscBag {
  name: string;
  discs: UserDisc[];
  maxDiscs: number;
}

// Default color options (but users can pick any hex color)
export const DEFAULT_COLORS = [
  "#FFFFFF", // White
  "#FFD700", // Gold
  "#FFA500", // Orange
  "#FF0000", // Red
  "#FF69B4", // Pink
  "#800080", // Purple
  "#0000FF", // Blue
  "#008000", // Green
  "#000000", // Black
  "#808080", // Grey
  "#87CEEB", // Sky Blue
  "#98FB98", // Pale Green
] as const;

// Type can be any valid hex color
export type DiscColor = string;
