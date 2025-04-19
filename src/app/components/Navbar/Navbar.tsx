'use client'

import * as motion from 'motion/react-client'
import Link from 'next/link'
import { useState } from 'react'

export const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState<number>(0)
  const links = [
    { name: 'About', path: '#about' },
    { name: 'Projects', path: '#projects' },
    { name: 'Blog', path: '#blog' },
  ]
  return (
    <motion.nav
      className="w-full py-5 sticky top-0 backdrop-blur-3xl bg-transparent mb-5 z-10"
      layout
      transition={{ duration: 0.5 }}
    >
      <ol className="w-full flex flex-row items-center justify-center gap-x-4 list-none">
        {links.map((link, index) => (
          <motion.li
            key={index}
            onClick={() => setSelectedLink(index)}
            className={`${
              selectedLink === index
                ? 'text-gray-200'
                : 'text-gray-600 hover:text-gray-400'
            } cursor-pointer transition-colors duration-200 relative`}
            layout
          >
            <Link href={link.path}>{link.name}</Link>
            {selectedLink === index && (
              <motion.div
                className="w-full h-0.5 rounded-lg absolute bg-gray-200"
                layoutId="underline"
              />
            )}
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  )
}
