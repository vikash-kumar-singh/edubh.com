"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import SectionHeader from "@/components/section-header";
import Image, { StaticImageData } from "next/image";
import Manipal from "@/assets/manipal.png";
// import Bits from "@/assets/bits.png";
// import Indian_Institute_of_Technology_Patna from "@/assets/Indian_Institute_of_Technology,_Patna.png";

import ManipalBackground from "@/assets/manipal-uni.jpg";
import IitBackground from "@/assets/iit-patna-online-bsc.webp";

// Placeholder background images - replace with actual university specific background images
// import IITPBackground from "@/assets/iit-patna-online-bsc.webp";

const DummyContent = ({ description, duration, mode }: { description: string; duration: string; mode: string }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto mb-4">
        {description}
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm md:text-base">
        <div className="font-semibold text-neutral-700 dark:text-neutral-200">Duration: <span className="font-normal text-neutral-600 dark:text-neutral-300">{duration}</span></div>
        <div className="font-semibold text-neutral-700 dark:text-neutral-200">Mode: <span className="font-normal text-neutral-600 dark:text-neutral-300">{mode}</span></div>
      </div>
    </div>
  );
};

const data = [
  {
    category: "University",
    title: "Manipal Online",
    src: Manipal,
    content: <DummyContent description="Manipal University Online offers UGC-entitled online degree programs designed for working professionals and students seeking flexible, high-quality education from a recognized institution." duration="Various" mode="Online" />,
    website: "/manipal-courses",
    backgroundImage: ManipalBackground,
  },
  {
    category: "University",
    title: "Manipal Online",
    src: Manipal,
    content: <DummyContent description="Manipal University Online offers UGC-entitled online degree programs designed for working professionals and students seeking flexible, high-quality education from a recognized institution." duration="Various" mode="Online" />,
    website: "/manipal-courses",
    backgroundImage: ManipalBackground,
  },
];

export const Pricing = () => {
  const cards = data.map((card, index) => (
    <Card key={card.title} card={card} index={index} />
  ));

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]">
      <div className="container">
        <SectionHeader
          title="Choose Your Course"
          description="Explore our comprehensive range of undergraduate, postgraduate, and professional programs designed for modern career success."
        />
        <Carousel items={cards} />
      </div>
    </section>
  );
};
