import { Button } from '@/app/components/Button/Button'
import { IconArrowLeft } from '@tabler/icons-react'

export default function Home() {
  return (
    <Button icon={<IconArrowLeft color="white" size={20} />} onlyIcon disabled>
      View Projects
    </Button>
  )
}
