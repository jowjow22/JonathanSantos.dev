import * as motion from "motion/react-client";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState<number>(0);
  const links = [
    { id: "about-section", name: "About", path: "#about" },
    { id: "projects-section", name: "Projects", path: "#projects" },
    { id: "articles-section", name: "Articles", path: "#articles" },
    { id: "contact-section", name: "Contact", path: "#contact" },
  ];
  return (
    <motion.nav
      className="w-full py-5 sticky top-0 backdrop-blur-3xl bg-transparent mb-5 z-10"
      layout
      transition={{ duration: 0.5 }}
    >
      <ol className="w-full flex flex-row items-center justify-center gap-x-4 list-none">
        {links.map((link, index) => (
          <Link to={link.path} key={index}>
            <motion.li
              onClick={() => setSelectedLink(index)}
              className={`${
                selectedLink === index
                  ? "text-gray-200"
                  : "text-gray-600 hover:text-gray-400"
              } cursor-pointer transition-colors duration-200 relative`}
              layout
              data-testid={`link-${link.id}`}
            >
              {link.name}
              {selectedLink === index && (
                <motion.div
                  className="w-full h-0.5 rounded-lg absolute bg-gray-200"
                  data-testid="underline"
                  layoutId="underline"
                />
              )}
            </motion.li>
          </Link>
        ))}
      </ol>
    </motion.nav>
  );
};
