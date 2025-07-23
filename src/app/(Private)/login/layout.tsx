export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[url(/image-mesh-gradient.png)] overflow-hidden">
      {children}
    </div>
  )
}
