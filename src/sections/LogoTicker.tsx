"use client";

import manipalLogo from "@/assets/manipal.png";
// import bitsLogo from "@/assets/bits.png";
// import iitPatnaLogo from "@/assets/Indian_Institute_of_Technology,_Patna.png";
import { ScrollTextReveal } from "@/components/ui/scroll-text-reveal";
import Image from "next/image";
import { motion } from "framer-motion";

const allLogos = Array.from({ length: 7 }, () => manipalLogo);

export const LogoTicker = () => {
  return (
    <section id="logoticker" className="py-8 bg-white md:py-12">
      <div className="container">
        <div className="text-center mb-8">
          <ScrollTextReveal 
            words="Trusted University Partners"
            className="text-lg font-semibold text-gray-600 mb-4"
            duration={0.6}
            delay={0.1}
          />
        </div>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-14 flex-none pr-14"
            animate={{
              translateX: ["0%", "-100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {allLogos.map((logo, index) => (
              <Image
                key={index}
                src={logo}
                alt="University Logo"
                className="logo-ticker-image h-20 w-auto"
              />
            ))}
            {allLogos.map((logo, index) => (
              <Image
                key={`duplicate-${index}`}
                src={logo}
                alt="University Logo"
                className="logo-ticker-image h-20 w-auto"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
