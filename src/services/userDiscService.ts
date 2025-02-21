import { UserDisc } from "../types/disc";

const API_BASE_URL =
  import.meta.env.VITE_APIG_URL ||
  "https://your-api-gateway-url.execute-api.region.amazonaws.com/prod";

export const userDiscService = {
  async getUserCollection(): Promise<UserDisc[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/collection`, {
        headers: {
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching collection:", error);
      throw error;
    }
  },

  async addDisc(disc: UserDisc): Promise<UserDisc> {
    try {
      const response = await fetch(`${API_BASE_URL}/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication header if needed
        },
        body: JSON.stringify(disc),
      });

      if (!response.ok) {
        throw new Error("Failed to add disc");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding disc:", error);
      throw error;
    }
  },

  async updateDisc(disc: UserDisc): Promise<UserDisc> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/collection/${disc.discId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add authentication header if needed
          },
          body: JSON.stringify(disc),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update disc");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating disc:", error);
      throw error;
    }
  },

  async removeDisc(discId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/collection/${discId}`, {
        method: "DELETE",
        headers: {
          // Add authentication header if needed
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove disc");
      }
    } catch (error) {
      console.error("Error removing disc:", error);
      throw error;
    }
  },

  async toggleDiscInBag(discId: string, inBag: boolean): Promise<UserDisc> {
    try {
      const response = await fetch(`${API_BASE_URL}/collection/${discId}/bag`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authentication header if needed
        },
        body: JSON.stringify({ inBag }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle disc bag status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error toggling disc bag status:", error);
      throw error;
    }
  },
};
