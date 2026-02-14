import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down';
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  delay = 0,
  direction = 'down'
}) => {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      }
    }
  };

  const childVariants: Variants = {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: direction === 'down' ? -20 : 20
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  return (
    <motion.div
      className={`flex flex-wrap gap-x-[0.25em] ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-visible py-2">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${index}-${charIndex}`}
              variants={childVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default BlurText;