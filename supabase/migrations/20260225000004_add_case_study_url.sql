-- Add case study / blog post URL to projects table
-- Required by CONT-02: project detail page shows GitHub, live demo, and case study links

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS case_study_url TEXT NULL;

COMMENT ON COLUMN public.projects.case_study_url IS 'Optional URL to a case study or blog post about this project';
