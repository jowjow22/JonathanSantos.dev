import { Button } from '@/app/components/Button/Button'
import { Typography } from '@/app/components/Typography/Typography'
import {
  IconArrowLeft,
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconMail,
} from '@tabler/icons-react'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <section
        className="w-full h-screen flex flex-col items-center justify-center px-16 md:flex-row-reverse md:gap-x-[5%]"
        id="about"
      >
        <Image
          src="/me.png"
          alt="Jonathan Santos"
          width={250}
          height={250}
          className="mb-8 md:w-sm min-w-3xs"
        />
        <div className="max-w-2xl flex flex-col gap-y-4">
          <Typography.H1 className="text-center md:text-start">
            Jonathan Santos
          </Typography.H1>
          <Typography.H2 className="text-center md:text-start">
            Software Engineer
          </Typography.H2>
          <Typography.Paragraph className="text-center md:text-start">
            I’m a passionate Software Engineer specializing in front-end and
            full-stack development. I excel at creating efficient, user-centric
            interfaces using HTML, CSS, JavaScript, React, Vue, Node, and
            TypeScript. With proven experience at Juntos Somos Mais optimizing
            performance and streamlining code, I thrive in agile, dynamic
            environments and embrace every challenge as an opportunity for
            continuous learning and innovation.
          </Typography.Paragraph>
          <fieldset className="flex justify-between flex-col gap-y-4 lg:flex-row">
            <div className="flex gap-x-4 w-full justify-center">
              <Button>Contact me!</Button>
              <Button variant="secondary">See my projects.</Button>
            </div>
            <div className="flex gap-x-4 w-full items-center justify-center lg:justify-end">
              <Button icon={<IconBrandGithub size={20} />} onlyIcon />
              <Button icon={<IconBrandLinkedinFilled size={20} />} onlyIcon />
              <Button icon={<IconMail size={20} />} onlyIcon />
            </div>
          </fieldset>
        </div>
      </section>
      <section
        className="w-full h-screen flex flex-col items-center justify-center"
        id="projects"
      >
        <Typography.H1>Projects</Typography.H1>
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
