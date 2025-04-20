import { Reveal } from '@/app/animations/Reveal'
import { Button } from '@/app/components/Button/Button'
import { Typography } from '@/app/components/Typography/Typography'
import {
  IconArrowLeft,
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconCoffee,
  IconMail,
} from '@tabler/icons-react'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from './components/Card/Card'

export default function Home() {
  return (
    <>
      <section
        className="w-full h-screen flex flex-col items-center justify-center px-16 md:flex-row-reverse md:gap-x-[5%]"
        id="about"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Image
            src="/me.png"
            alt="Jonathan Santos"
            width={250}
            height={250}
            className="mb-8 md:w-sm min-w-3xs "
          />
        </motion.div>
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
              I’m a passionate Software Engineer specializing in front-end and
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
              <div className="flex gap-x-4 w-full">
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
        className="w-full h-screen flex flex-col items-center justify-center"
        id="projects"
      >
        <Typography.H1>Projects</Typography.H1>
        <Card />
      </section>
      <section
        className="w-full h-screen flex flex-col items-center justify-center"
        id="blog"
      >
        <Typography.H1>Blog</Typography.H1>
      </section>
      <Button
        icon={<IconArrowLeft color="white" size={20} />}
        onlyIcon
        disabled
      >
        View Projects
      </Button>
    </>
  )
}
