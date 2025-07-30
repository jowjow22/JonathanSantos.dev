import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Reveal } from '@/animations/Reveal'
import { Button } from '@/components/Button/Button'
import { ProfileImage } from '@/components/ProfileImage/ProfileImage'
import { Typography } from '@/components/Typography/Typography'
import {
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconCoffee,
  IconMail,
} from '@tabler/icons-react'
import { ArticlesSection } from '@/components/ArticlesSection/ArticlesSection'
import { ContactForm } from '@/components/ContactForm/ContactForm'
import { ProjectsSection } from '@/components/ProjectsSection/ProjectsSection'

import { type Article } from '@/lib/types/articles'

import { fetchArticles } from '@/services/articles.service'

export const Route = createFileRoute('/__public/')({
  component: Index,
})

export default function Index() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    fetchArticles(setArticles)
  }, [])

  return (
    <>
      <section
        className="flex h-screen w-full scroll-mt-16 flex-col items-center justify-center px-16 md:flex-row-reverse md:gap-x-[5%] lg:scroll-mt-0"
        id="about"
      >
        <ProfileImage />
        <div className="flex max-w-2xl flex-col items-center gap-y-4 lg:items-start">
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
                <Button>My Career</Button>
                <Button variant="secondary" icon={<IconCoffee size={20} />}>
                  Buy me a coffee
                </Button>
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
                <Button icon={<IconMail size={20} />} onlyIcon />
              </div>
            </fieldset>
          </Reveal>
        </div>
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
