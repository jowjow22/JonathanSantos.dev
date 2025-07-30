import { Button } from '@/components/Button/Button'
import { Card } from '@/components/Card/Card'
import { Typography } from '@/components/Typography/Typography'
import { IconMaximize } from '@tabler/icons-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { dateFormatter } from '@/lib/helpers/date-formater'
import { type Article } from '@/lib/types/articles'
import { motion } from 'motion/react'

export const ArticlesSection = ({ articles }: { articles: Article[] }) => {
  const MotionCarouselItem = motion.create(CarouselItem)

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent className="py-4 px-2">
        {articles.map((article, index: number) => (
          <a key={article.id} href={article.url} target="_blank">
            <MotionCarouselItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="md:basis-1/2 xl:basis-1/3"
            >
              <Card>
                <Card.Header
                  className="flex justify-between items-center"
                  image={{
                    src: article.cover_image,
                    alt: article.title,
                  }}
                >
                  <div className="flex flex-col items-start w-full">
                    <Typography.Paragraph>
                      {dateFormatter(article.published_at)}
                    </Typography.Paragraph>
                    <Typography.H4 className="font-semibold text-white! max-h-22 max-w-4/5 overflow-y-hidden">
                      {article.title.length > 40
                        ? `${article.title.slice(0, 40)}...`
                        : article.title}
                    </Typography.H4>
                  </div>
                  <Button onlyIcon icon={<IconMaximize size={20} />} />
                </Card.Header>
                <Card.Content>
                  <p>{article.description}</p>
                </Card.Content>
              </Card>
            </MotionCarouselItem>
          </a>
        ))}
      </CarouselContent>
      <CarouselPrevious className="rounded-sm bg-indigo-600 border-none hidden sm:flex" />
      <CarouselNext className="rounded-sm bg-indigo-600 border-none hidden sm:flex" />
    </Carousel>
  )
}
