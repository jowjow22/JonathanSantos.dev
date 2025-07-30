import * as motion from 'motion/react-client'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState<number>(0)
  const links = [
    { id: 'about-section', name: 'About', path: '#about' },
    { id: 'projects-section', name: 'Projects', path: '#projects' },
    { id: 'articles-section', name: 'Articles', path: '#articles' },
    { id: 'contact-section', name: 'Contact', path: '#contact' },
  ]
  return (
    <motion.nav
      className="sticky top-0 z-10 mb-5 w-full bg-transparent py-5 backdrop-blur-3xl"
      layout
      transition={{ duration: 0.5 }}
    >
      <ol className="flex w-full list-none flex-row items-center justify-center gap-x-4">
        {links.map((link, index) => (
          <Link to={link.path} key={index}>
            <motion.li
              onClick={() => setSelectedLink(index)}
              className={`${
                selectedLink === index
                  ? 'text-gray-200'
                  : 'text-gray-600 hover:text-gray-400'
              } relative cursor-pointer transition-colors duration-200`}
              layout
              data-testid={`link-${link.id}`}
            >
              {link.name}
              {selectedLink === index && (
                <motion.div
                  className="absolute h-0.5 w-full rounded-lg bg-gray-200"
                  data-testid="underline"
                  layoutId="underline"
                />
              )}
            </motion.li>
          </Link>
        ))}
      </ol>
    </motion.nav>
  )
}
