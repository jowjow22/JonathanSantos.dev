'use client'

import { Button } from '@/app/components/Button/Button'
import { Card } from '@/app/components/Card/Card'
import { Tag } from '@/app/components/Tag/Tag'
import { TagGroup } from '@/app/components/TagGroup/TagGroup'
import { Typography } from '@/app/components/Typography/Typography'
import {
  IconBooks,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBrandVue,
  IconMaximize,
} from '@tabler/icons-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { motion } from 'motion/react'

export const ProjectsSection = () => {
  const MotionCarouselItem = motion(CarouselItem)
  const tags = [
    { text: 'Vue', icon: IconBrandVue, color: 'bg-green-500' },
    { text: 'Typescript', icon: IconBrandTypescript, color: 'bg-blue-500' },
    { text: 'Pinia', icon: IconBooks, color: 'bg-yellow-500' },
    { text: 'Tailwind', icon: IconBrandTailwind, color: 'bg-purple-500' },
  ]
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {Array.from({ length: 6 }, (_, index) => (
          <MotionCarouselItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            key={`${index} - ${Math.random()}`}
            className="md:basis-1/2 xl:basis-1/3 px-6"
          >
            <Card variant="image_background">
              <Card.Header>
                <Button onlyIcon icon={<IconMaximize size={20} />} />
              </Card.Header>
              <Card.Content>
                <Typography.H3 className="font-bold text-white!">
                  Project Title
                </Typography.H3>
                <p className="text-ellipsis whitespace-nowrap overflow-hidden">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </Card.Content>
              <Card.Footer>
                <TagGroup>
                  {tags.map((tag, index) => (
                    <Tag
                      key={index}
                      icon={tag.icon}
                      className={`text-white ${tag.color}`}
                      color={tag.color}
                      text={tag.text}
                    />
                  ))}
                </TagGroup>
              </Card.Footer>
            </Card>
          </MotionCarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="rounded-sm bg-indigo-600 border-none hidden sm:flex" />
      <CarouselNext className="rounded-sm bg-indigo-600 border-none hidden sm:flex" />
    </Carousel>
  )
}
