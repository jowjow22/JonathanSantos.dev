'use client'

import { Button } from '@/app/components/Button/Button'
import { Card } from '@/app/components/Card/Card'
import { Tag } from '@/app/components/Tag/Tag'
import { TagGroup } from '@/app/components/TagGroup/TagGroup'
import { Typography } from '@/app/components/Typography/Typography'
import { IconMaximize } from '@tabler/icons-react'

export const ProjectsSection = () => {
  return (
    <Card variant="image_background">
      <Card.Header>
        <div className="flex flex-col items-start w-full">
          <Typography.Paragraph>April 20, 2023</Typography.Paragraph>
          <Typography.H3 className="font-bold text-white!">
            Project Title
          </Typography.H3>
        </div>
        <Button onlyIcon icon={<IconMaximize size={20} />} />
      </Card.Header>
      <Card.Content>
        <p className="text-ellipsis whitespace-nowrap overflow-hidden">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Card.Content>
      <Card.Footer>
        <TagGroup>
          <Tag icon={IconMaximize} text="Vue" />
          <Tag icon={IconMaximize} text="Typescript" />
          <Tag icon={IconMaximize} text="Typescript" />
          <Tag icon={IconMaximize} text="Typescript" />
        </TagGroup>
      </Card.Footer>
    </Card>
  )
}
