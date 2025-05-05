import { Reveal } from '@/app/animations/Reveal'
import { Button } from '@/app/components/Button/Button'
import { ProfileImage } from '@/app/components/ProfileImage/ProfileImage'
import { Typography } from '@/app/components/Typography/Typography'
import {
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconCoffee,
  IconMail,
} from '@tabler/icons-react'
import Link from 'next/link'
import { ArticlesSection } from './components/ArticlesSection/ArticlesSection'
import { ContactForm } from './components/ContactForm/ContactForm'
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection'

import { fetchArticles } from '@/app/server/actions/articles'

export default async function Home() {
  const articles = await fetchArticles()

  return (
    <>
      <section
        className="w-full h-screen flex flex-col items-center justify-center px-16 md:flex-row-reverse md:gap-x-[5%]"
        id="about"
      >
        <ProfileImage />
        <div className="max-w-2xl flex flex-col gap-y-4 items-center lg:items-start">
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
            <fieldset className="flex justify-between flex-col gap-y-4 lg:flex-row">
              <div className="flex gap-x-4 w-full justify-center lg:justify-start">
                <Button>My Career</Button>
                <Button variant="secondary" icon={<IconCoffee size={20} />}>
                  Buy me a coffee
                </Button>
              </div>
              <div className="flex gap-x-4 w-full items-center justify-center lg:justify-end">
                <Link href="https://github.com/jowjow22" target="_blank">
                  <Button icon={<IconBrandGithub size={20} />} onlyIcon />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/jonathansantossilva/"
                  target="_blank"
                >
                  <Button
                    icon={<IconBrandLinkedinFilled size={20} />}
                    onlyIcon
                  />
                </Link>
                <Button icon={<IconMail size={20} />} onlyIcon />
              </div>
            </fieldset>
          </Reveal>
        </div>
      </section>
      <section
        className="w-full h-screen flex flex-col items-start justify-center px-4 xs:px-8 sm:px-26 lg:px-36 gap-y-8"
        id="projects"
      >
        <Typography.H1>Projects</Typography.H1>
        <ProjectsSection />
      </section>
      <section
        className="w-full h-screen flex flex-col items-start justify-center px-4 xs:px-8 sm:px-26 lg:px-36 gap-y-8"
        id="articles"
      >
        <Typography.H1>Blog</Typography.H1>
        <ArticlesSection articles={articles} />
      </section>
      <section
        className="w-full h-screen flex flex-col items-start justify-center px-4 xs:px-8 sm:px-26 lg:px-36 gap-y-8"
        id="contact"
      >
        <Typography.H1>Want to know more about me?</Typography.H1>
        <div className="w-full flex flex-col">
          <ContactForm />
        </div>
      </section>
    </>
  )
}
