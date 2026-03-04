import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { IconSun, IconMoon } from '@tabler/icons-react'
import * as motion from 'motion/react-client'

export const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState<number>(0)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useDarkMode()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { id: 'about-section', name: 'About', path: '#about' },
    { id: 'career-section', name: 'Career', path: '#career' },
    { id: 'skills-section', name: 'Skills', path: '#skills' },
    { id: 'projects-section', name: 'Projects', path: '#projects' },
    { id: 'articles-section', name: 'Articles', path: '#articles' },
    { id: 'contact-section', name: 'Contact', path: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 z-50 w-full py-5 transition-all duration-500 ${
        scrolled
          ? 'bg-background/70 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <ol
        aria-label="Page links"
        className="flex w-full list-none flex-row items-center justify-center gap-x-2 overflow-x-auto pr-10 sm:gap-x-4 sm:pr-12"
      >
        {links.map((link, index) => (
          <motion.li
            onClick={() => setSelectedLink(index)}
            className={`${
              selectedLink === index
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            } relative shrink-0 cursor-pointer transition-colors duration-200`}
            layout
            data-testid={`link-${link.id}`}
            key={link.id}
          >
            <Link to={link.path}>
              {link.name}
              {selectedLink === index && (
                <motion.div
                  className="bg-foreground absolute h-0.5 w-full rounded-lg"
                  data-testid="underline"
                  layoutId="underline"
                />
              )}
            </Link>
          </motion.li>
        ))}
      </ol>
      <button
        onClick={toggle}
        aria-label={
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        }
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
      >
        {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </button>
    </nav>
  )
}
