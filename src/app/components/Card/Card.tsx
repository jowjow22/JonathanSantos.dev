import { IconMaximize } from '@tabler/icons-react'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import { Button } from '../Button/Button'
import { Typography } from '../Typography/Typography'

export const Card = ({}) => {
  return (
    <motion.article
      className="relative rounded-xl min-w-80 h-72 group overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        duration: 0.2,
      }}
    >
      <Image
        src="/sample-project.png"
        alt="Project Title"
        fill
        sizes="100%"
        className="relative! object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute bg-linear-to-t from-black/80 to-transparent flex-col text-white p-4 h-full bottom-0 flex items-start justify-between gap-y-[auto] min-w-full max-w-full ">
        <header className="flex items-center justify-end w-full">
          <Button icon={<IconMaximize size={20} />} onlyIcon />
        </header>
        <section className="max-w-full flex flex-col gap-y-4">
          <div>
            <Typography.H3 className="font-bold text-white!">
              Project Title
            </Typography.H3>
            <p className="text-ellipsis whitespace-nowrap overflow-hidden">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="flex gap-x-4">
            <Button icon={<IconMaximize size={20} />}>Demo</Button>
            <Button icon={<IconMaximize size={20} />}>GitHub</Button>
          </div>
        </section>
      </div>
    </motion.article>
  )
}
