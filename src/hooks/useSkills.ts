import { useQuery } from '@tanstack/react-query'
import {
  fetchPublishedSkills,
  fetchSkillCategories,
} from '@/services/skills.service'

export const skillKeys = {
  all: ['skills'] as const,
  published: () => [...skillKeys.all, 'published'] as const,
  categories: () => ['skill_categories'] as const,
}

export function usePublishedSkills() {
  return useQuery({
    queryKey: skillKeys.published(),
    queryFn: fetchPublishedSkills,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useSkillCategories() {
  return useQuery({
    queryKey: skillKeys.categories(),
    queryFn: fetchSkillCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
