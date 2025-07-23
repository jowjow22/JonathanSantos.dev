import { Navbar } from '@/app/components/Navbar/Navbar'
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative">
      <Navbar />
      {children}
    </main>
  )
}
