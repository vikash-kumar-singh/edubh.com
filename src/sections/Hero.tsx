"use client";

import ArrowIcon from "@/assets/arrow-right.svg";
import cogImage from "@/assets/cog.png";
import cylImage from "@/assets/cylinder.png";
import noodelImage from "@/assets/noodle.png";
import manipalLogo from "@/assets/manipal.png";
import { ScrollTextReveal } from "@/components/ui/scroll-text-reveal";
import { 
  IconBrandGithub,
  IconBrandX,
  IconSchool,
  IconHome,
  IconUsers,
  IconPhone,
  IconBook,
} from "@tabler/icons-react";
import { easeInOut, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export const Hero = () => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="pt-32 pb-20 md:pt-32 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip"
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px] relative z-10">
            <div className="tag">🎓 EduBh - Industry-Ready Education</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gradient mt-6">
              Unlock Your Potential with Industry-Ready Education
            </h1>
            <ScrollTextReveal 
              words="Bridge the gap between academia and industry with our comprehensive programs designed for modern career success and professional excellence."
              className="text-xl text-[#010D3E] tracking-tight mt-6 font-normal leading-relaxed"
              duration={0.8}
              delay={0.5}
            />
            <div className="flex gap-1 item-center mt-[30px]">
              <button className="btn btn-primary" onClick={() => {
                window.location.href = '/apply';
              }}>Enquire Now</button>
              <button className="btn btn-text gap-1" onClick={() => {
                const el = document.getElementById('product-showcase');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span>View Programs</span>
                <ArrowIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 h-[335px] md:h-[648px] md:flex-1 relative">
            <motion.img
              src={cogImage.src}
              alt="Cog image"
              className="md:absolute h-full w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{ translateY: [-30, 30] }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: easeInOut,
              }}
            />
            <motion.img
              src={cylImage.src}
              alt="Cylinder image"
              width={220}
              height={220}
              className="hidden md:block md:absolute -top-8 -left-32 z-0"
              style={{ translateY: translateY }}
            />
            <motion.img
              src={noodelImage.src}
              alt="Noodel image"
              width={220}
              height={220}
              className="hidden lg:block absolute top-[524px] left-[448px] rotate-[30deg]"
              style={{ translateY: translateY, rotate: 30 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
