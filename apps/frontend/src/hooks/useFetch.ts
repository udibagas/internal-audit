import { getAll } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useFetch<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
) {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => getAll<T>(endpoint, params),
    staleTime: 60 * 1000 * 10, // 10 minutes
  });
}
