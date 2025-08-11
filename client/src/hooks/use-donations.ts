import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Donation, InsertDonation } from "@shared/schema";

export function useDonations() {
  const queryClient = useQueryClient();

  const query = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  const createDonation = useMutation({
    mutationFn: async (data: InsertDonation) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
    },
  });

  const updateDonation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertDonation> }) => {
      const response = await apiRequest("PATCH", `/api/donations/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
    },
  });

  const deleteDonation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/donations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
    },
  });

  return {
    ...query,
    createDonation,
    updateDonation,
    deleteDonation,
  };
}
