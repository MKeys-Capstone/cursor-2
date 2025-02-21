import { Disc } from "../types/disc";

const API_BASE_URL = "https://discit-api.fly.dev";

interface DiscItResponse {
  id: string;
  name: string;
  brand: string; // manufacturer in our interface
  category: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  stability: string;
  link: string;
  pic: string; // we'll use this as image in our interface
}

const mapDiscItResponseToDisc = (disc: DiscItResponse): Disc => ({
  discId: disc.id,
  name: disc.name,
  manufacturer: disc.brand,
  category: disc.category,
  speed: disc.speed,
  glide: disc.glide,
  turn: disc.turn,
  fade: disc.fade,
  image: disc.pic,
});

export const discService = {
  async searchDiscs(query: string): Promise<Disc[]> {
    try {
      // Convert spaces to hyphens and remove special characters as per API docs
      const formattedQuery = query
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      const response = await fetch(
        `${API_BASE_URL}/disc?name=${formattedQuery}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch discs");
      }
      const data: DiscItResponse[] = await response.json();
      return data.map(mapDiscItResponseToDisc);
    } catch (error) {
      console.error("Error searching discs:", error);
      throw error;
    }
  },

  async getDiscById(id: string): Promise<Disc> {
    try {
      const response = await fetch(`${API_BASE_URL}/disc/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch disc");
      }
      const disc: DiscItResponse = await response.json();
      return mapDiscItResponseToDisc(disc);
    } catch (error) {
      console.error("Error fetching disc:", error);
      throw error;
    }
  },

  async searchByField(field: string, value: string): Promise<Disc[]> {
    try {
      // Convert spaces to hyphens and remove special characters as per API docs
      const formattedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      const response = await fetch(
        `${API_BASE_URL}/disc?${field}=${formattedValue}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch discs by ${field}`);
      }
      const data: DiscItResponse[] = await response.json();
      return data.map(mapDiscItResponseToDisc);
    } catch (error) {
      console.error(`Error searching discs by ${field}:`, error);
      throw error;
    }
  },

  async getAllDiscs(): Promise<Disc[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/disc`);
      if (!response.ok) {
        throw new Error("Failed to fetch all discs");
      }
      const data: DiscItResponse[] = await response.json();
      return data.map(mapDiscItResponseToDisc);
    } catch (error) {
      console.error("Error fetching all discs:", error);
      throw error;
    }
  },
};
