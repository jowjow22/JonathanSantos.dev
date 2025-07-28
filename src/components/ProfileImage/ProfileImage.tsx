import * as motion from "motion/react-client";

export const ProfileImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <img
        src="/me.png"
        alt="Jonathan Santos"
        width={250}
        height={250}
        className="mb-8 md:w-sm min-w-3xs"
      />
    </motion.div>
  );
};
