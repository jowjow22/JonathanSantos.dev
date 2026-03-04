import { useState, useEffect, lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Reveal } from '@/animations/Reveal'
import { Button } from '@/components/Button/Button'
import { ProfileImage } from '@/components/ProfileImage/ProfileImage'
import { Typography } from '@/components/Typography/Typography'
import {
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconMail,
} from '@tabler/icons-react'
import { ArticlesSection } from '@/components/ArticlesSection/ArticlesSection'
import { ContactForm } from '@/components/ContactForm/ContactForm'
import { ProjectsSection } from '@/components/ProjectsSection/ProjectsSection'
import { CareerSection } from '@/components/CareerSection/CareerSection'
import { SkillsSection } from '@/components/SkillsSection/SkillsSection'

import { type Article } from '@/lib/types/articles'

import { fetchArticles } from '@/services/articles.service'
import { usePublishedProjects } from '@/hooks/useProjects'
import { usePublishedCareerEntries } from '@/hooks/useCareer'
import { usePublishedSkills, useSkillCategories } from '@/hooks/useSkills'
import * as motion from 'motion/react-client'
import { useMotionValue, useSpring, useTransform } from 'motion/react'

const ParticleBackground = lazy(
  () => import('@/animations/hero/ParticleBackground')
)

export const Route = createFileRoute('/__public/')({
  head: () => ({
    meta: [
      { title: 'Jonathan Santos — Front-End Developer' },
      {
        name: 'description',
        content:
          "Hi, I'm Jonathan Santos — a passionate Front-End Developer specialising in React, TypeScript, and full-stack development.",
      },
      {
        property: 'og:title',
        content: 'Jonathan Santos — Front-End Developer',
      },
      {
        property: 'og:description',
        content:
          'Front-End Developer portfolio — React, TypeScript, Node.js, full-stack web development.',
      },
      { property: 'og:url', content: 'https://jonathansantos.dev/' },
    ],
  }),
  component: Index,
})

export default function Index() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    fetchArticles(setArticles)
  }, [])

  usePublishedProjects()
  const career = usePublishedCareerEntries()
  const skills = usePublishedSkills()
  const categories = useSkillCategories()

  // Hero parallax motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { stiffness: 150, damping: 20 }
  const heroX = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), springConfig)
  const heroY = useSpring(useTransform(mouseY, [-1, 1], [-4, 4]), springConfig)

  const onHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
    mouseY.set(-((e.clientY / window.innerHeight) * 2 - 1))
  }

  return (
    <>
      <section
        className="relative flex h-screen w-full scroll-mt-16 flex-col items-center justify-center overflow-hidden px-16 md:flex-row-reverse md:gap-x-[5%] lg:scroll-mt-0"
        id="about"
        onMouseMove={onHeroMouseMove}
      >
        <Suspense fallback={null}>
          <ParticleBackground />
        </Suspense>
        <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t to-transparent" />
        <motion.div
          style={{ x: heroX, y: heroY }}
          className="relative z-10 flex-shrink-0"
        >
          <ProfileImage />
        </motion.div>
        <motion.article
          style={{ x: heroX, y: heroY }}
          className="relative z-10 flex max-w-2xl flex-col items-center gap-y-4 lg:items-start"
        >
          <Reveal>
            <Typography.H1 className="text-center md:text-start">
              Jonathan Santos
            </Typography.H1>
          </Reveal>
          <Reveal>
            <Typography.H3 className="text-center md:text-start">
              Front-End Developer
            </Typography.H3>
          </Reveal>
          <Reveal>
            <Typography.Paragraph className="text-center md:text-start">
              Im a passionate Software Engineer specializing in front-end and
              full-stack development. I excel at creating efficient,
              user-centric interfaces using HTML, CSS, JavaScript, React, Vue,
              Node, and TypeScript. With proven experience at Juntos Somos Mais
              optimizing performance and streamlining code, I thrive in agile,
              dynamic environments and embrace every challenge as an opportunity
              for continuous learning and innovation.
            </Typography.Paragraph>
          </Reveal>
          <Reveal width="w-full">
            <fieldset className="flex flex-col justify-between gap-y-4 lg:flex-row">
              <div className="flex w-full justify-center gap-x-4 lg:justify-start">
                <a href="#contact">
                  <Button>Contact Me</Button>
                </a>
              </div>
              <div className="flex w-full items-center justify-center gap-x-4 lg:justify-end">
                <a href="https://github.com/jowjow22" target="_blank">
                  <Button icon={<IconBrandGithub size={20} />} onlyIcon />
                </a>
                <a
                  href="https://www.linkedin.com/in/jonathansantossilva/"
                  target="_blank"
                >
                  <Button
                    icon={<IconBrandLinkedinFilled size={20} />}
                    onlyIcon
                  />
                </a>
                <Button
                  aria-label="Send an email"
                  icon={<IconMail size={20} />}
                  onlyIcon
                />
              </div>
            </fieldset>
          </Reveal>
        </motion.article>
      </section>
      <section
        className="xs:px-8 flex min-h-screen w-full flex-col items-start justify-center gap-y-8 px-4 sm:px-26 lg:px-36"
        id="career"
      >
        <CareerSection
          entries={career.data ?? []}
          isLoading={career.isLoading}
        />
      </section>
      <section
        className="xs:px-8 flex min-h-screen w-full flex-col items-start justify-center gap-y-8 px-4 sm:px-26 lg:px-36"
        id="skills"
      >
        <SkillsSection
          skills={skills.data ?? []}
          categories={categories.data ?? []}
          isLoading={skills.isLoading || categories.isLoading}
        />
      </section>
      <section
        className="xs:px-8 flex h-screen w-full flex-col items-start justify-center gap-y-8 px-4 sm:px-26 lg:px-36"
        id="projects"
      >
        <Typography.H1>Projects</Typography.H1>
        <ProjectsSection />
      </section>
      <section
        className="xs:px-8 flex h-screen w-full flex-col items-start justify-center gap-y-8 px-4 sm:px-26 lg:px-36"
        id="articles"
      >
        <Typography.H1>Blog</Typography.H1>
        <ArticlesSection articles={articles} />
      </section>
      <section
        className="xs:px-8 flex h-screen w-full scroll-mt-16 flex-col items-center justify-center gap-y-8 px-4 sm:px-26 lg:scroll-mt-42 lg:flex-row lg:items-start lg:gap-x-12 lg:px-36"
        id="contact"
      >
        <motion.div
          className="flex w-full flex-col items-center justify-center gap-y-8 lg:flex-row lg:items-start lg:gap-x-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex flex-col">
            <Typography.H1 className="text-center lg:text-left">
              Want to know more about me?
            </Typography.H1>
            <Typography.Paragraph className="font-poppins hidden max-w-2xl font-thin lg:block">
              If you have any questions or want to know more about me, feel free
              to send me a message. I will be happy to help you!
            </Typography.Paragraph>
          </div>
          <div className="flex w-full flex-col justify-center gap-y-6">
            <div className="flex flex-col justify-center text-center">
              <Typography.H1 className="mb-5 font-thin lg:hidden">
                Contact me!
              </Typography.H1>
              <Typography.H2 className="mb-5 hidden font-thin lg:block">
                Contact me!
              </Typography.H2>
              <Typography.Paragraph className="font-thin lg:hidden">
                Send me an email and we can schedule a meeting, and maybe work
                together!!
              </Typography.Paragraph>
            </div>
            <ContactForm />
          </div>
        </motion.div>
      </section>
      <footer className="flex w-full flex-col items-center justify-center gap-y-4 py-6">
        <Typography.Paragraph className="font-light!">
          © 2025 Jonathan Santos. All rights reserved.
        </Typography.Paragraph>
        <div className="flex w-2xs justify-around">
          <a href="https://github.com/jowjow22" target="_blank">
            <IconBrandGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/jonathansantossilva/"
            target="_blank"
          >
            <IconBrandLinkedinFilled size={20} />
          </a>
          <a href="mailto:jonathan224santos@gmail.com">
            <IconMail size={20} />
          </a>
        </div>
      </footer>
    </>
  )
}
