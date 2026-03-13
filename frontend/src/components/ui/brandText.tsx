import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

const BrandText = () => {
  const [isSinhala, setIsSinhala] = useState(true);

  // Toggle between languages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSinhala((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animation variants for the text switch
  const textVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Background animation for the container
  const containerVariants = {
    initial: { backgroundColor: "rgba(var(--primary), 0)" },
    sinhala: {
      backgroundColor: "rgba(var(--primary), 0.1)",
      transition: { duration: 0.5 },
    },
    english: {
      backgroundColor: "rgba(var(--primary), 0.05)",
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0"
    >
      <Link href="/" className="shrink-0 block">
        <motion.div
          whileHover="hover"
          initial="initial"
          animate={isSinhala ? "sinhala" : "english"}
          variants={containerVariants}
          className="text-2xl md:text-3xl font-bold inline-flex items-center px-3 py-1 rounded-lg"
        >
          <motion.span
            className="bg-primary px-2 py-0.5 rounded-sm mx-2 text-background inline-block"
            variants={{
              initial: { rotate: 0 },
              hover: { rotate: -45 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.5,
              ease: "easeInOut",
            }}
            animate={{
              rotate: isSinhala ? 0 : 45,
              scale: isSinhala ? 1 : 1.1,
            }}
          >
            G
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.span
              key={isSinhala ? "sinhala" : "english"}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block min-w-[120px] text-center"
            >
              {isSinhala ? "ගොඩයන" : "Godayana"}
            </motion.span>
          </AnimatePresence>

          <motion.span
            className="text-gray-400 ml-1"
            animate={{
              opacity: isSinhala ? 0.7 : 1,
              scale: isSinhala ? 0.9 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            .lk
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default BrandText;
