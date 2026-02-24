import { useMutation } from '@tanstack/react-query'
import { submitContactForm } from '@/services/contact.service'
import type { Database } from '@/lib/types/database.types'

type ContactInsert =
  Database['public']['Tables']['contact_submissions']['Insert']

export function useSubmitContact() {
  return useMutation({
    mutationFn: (submission: ContactInsert) => submitContactForm(submission),
  })
}
