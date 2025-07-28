import CardContextProvider, { CardContext } from "@/contexts/CardContext";
import * as motion from "motion/react-client";
import React, { useContext } from "react";
import { cardVariantSchema } from "./card.schema";
import {
  cardContainer as cardContainerVariants,
  cardContent,
  cardHeader as cardHeaderVariants,
  card as cardVariants,
} from "./card.variants";

const CardHeader = ({
  children,
  className,
  image,
  dataTestId = "card-header",
}: {
  children: React.ReactNode;
  className?: string;
  image?: {
    src: string;
    alt: string;
  };
  dataTestId?: string;
}) => {
  const { variant } = useContext(CardContext);
  const cardVariant = cardVariantSchema.parse(variant);
  const currentVariant = cardHeaderVariants({ variant: cardVariant });
  return (
    <header
      className={`${currentVariant} ${className}`}
      data-testid={dataTestId}
    >
      {variant === "default" && (
        <>
          <img
            src={image?.src ?? "/sample-project.png"}
            alt={image?.alt ?? "Card image"}
            style={{ borderRadius: "0.7rem", width: "100%", height: "100%" }}
            loading="lazy"
            className="relative! object-cover transition-transform duration-500 ease-in-out group-hover:scale-103 overflow-hidden"
          />
          <div className="absolute rounded-lg transition-transform duration-500 ease-in-out top-0 right-0 bg-linear-to-b to-transparent to-100% from-black/80 from-70% w-full h-full flex items-start justify-end p-3 group-hover:scale-103">
            {children}
          </div>
        </>
      )}
      {variant === "image_background" && children}
    </header>
  );
};

const CardFooter = ({
  children,
  className = "",
  dataTestId = "card-footer",
}: {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
}) => {
  return (
    <footer
      className={`flex gap-x-4 row-start-8 row-end-8 items-center ${className}`}
      data-testid={dataTestId}
    >
      {children}
    </footer>
  );
};

const CardContent = ({
  children,
  className,
  dataTestId = "card-content",
}: {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
}) => {
  const { variant } = useContext(CardContext);
  const cardVariant = cardVariantSchema.parse(variant);
  const currentVariant = cardContent({ variant: cardVariant });
  return (
    <section
      className={`${currentVariant} ${className}`}
      data-testid={dataTestId}
    >
      <div>{children}</div>
    </section>
  );
};

export const Card = ({
  children,
  variant,
  className,
  dataTestId = "card",
  image,
}: {
  children: React.ReactNode;
  variant?: "default" | "image_background";
  className?: string;
  dataTestId?: string;
  image?: {
    src: string;
    alt: string;
  };
}) => {
  const currentVariant = cardVariants({ variant });
  const cardContainerVariant = cardContainerVariants({ variant });

  return (
    <motion.article
      className={`${cardContainerVariant} ${className}`}
      data-testid={dataTestId}
      whileHover={{ scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 200,
        duration: 0.2,
      }}
    >
      {variant === "image_background" && (
        <img
          src={image?.src ?? "/sample-project.png"}
          alt={image?.alt ?? "Project Title"}
          loading="lazy"
          className="relative! object-cover max-h-full transition-transform duration-500 ease-in-out group-hover:scale-110 w-full h-full"
        />
      )}
      <div className={currentVariant}>
        <CardContextProvider variant={variant ?? "default"}>
          {children}
        </CardContextProvider>
      </div>
    </motion.article>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
