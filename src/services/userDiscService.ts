import { UserDisc } from "../types/UserDisc";
import { useApiClient } from "../api/apiClient";

export const useUserDiscService = () => {
  const api = useApiClient();

  return {
    getCollection: () => api.get("/collection"),

    addDisc: (disc: UserDisc) => api.post("/collection", disc),

    updateDisc: (disc: UserDisc) => api.put(`/collection/${disc.discId}`, disc),

    removeDisc: (discId: string) => api.delete(`/collection/${discId}`),

    toggleInBag: (discId: string) => api.put(`/collection/${discId}/bag`, {}),
  };
};
