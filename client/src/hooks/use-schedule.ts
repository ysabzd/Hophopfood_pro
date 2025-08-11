import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Schedule, InsertSchedule } from "@shared/schema";

export function useSchedule() {
  const queryClient = useQueryClient();

  const query = useQuery<Schedule[]>({
    queryKey: ["/api/schedule"],
  });

  const createOrUpdateSchedule = useMutation({
    mutationFn: async (data: InsertSchedule) => {
      const response = await apiRequest("POST", "/api/schedule", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
    },
  });

  return {
    ...query,
    createOrUpdateSchedule,
  };
}
