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
      console.log('Sending schedule update:', data);
      const response = await apiRequest("POST", "/api/schedule", data);
      const result = await response.json();
      console.log('Schedule update response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Schedule update successful, invalidating cache');
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      // Force refetch
      queryClient.refetchQueries({ queryKey: ["/api/schedule"] });
    },
    onError: (error) => {
      console.error('Schedule update error:', error);
    },
  });

  return {
    ...query,
    createOrUpdateSchedule,
  };
}
