export interface UserDisc {
  discId: string;
  userId: string;
  manufacturer: string;
  name: string;
  plastic: string;
  weight: number;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  inBag: boolean;
  notes?: string;
}
