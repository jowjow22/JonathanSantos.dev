import { useQuery } from '@tanstack/react-query'
import { fetchPublishedCareerEntries } from '@/services/career.service'

export const careerKeys = {
  all: ['career_entries'] as const,
  published: () => [...careerKeys.all, 'published'] as const,
}

export function usePublishedCareerEntries() {
  return useQuery({
    queryKey: careerKeys.published(),
    queryFn: fetchPublishedCareerEntries,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
