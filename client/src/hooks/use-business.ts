import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Business, InsertBusiness } from "@shared/schema";

export function useBusiness() {
  const queryClient = useQueryClient();

  const query = useQuery<Business>({
    queryKey: ["/api/business"],
  });

  const updateBusiness = useMutation({
    mutationFn: async (data: Partial<InsertBusiness>) => {
      const response = await apiRequest("PATCH", "/api/business", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business"] });
    },
  });

  return {
    ...query,
    updateBusiness,
  };
}
