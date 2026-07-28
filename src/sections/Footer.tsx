import mainLogo from "@/assets/mainlogo.png";
import footerLogo from "@/assets/footer-logo.png";
import Image from "next/image";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedIn from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";
import facebookPng from "@/assets/facebook.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-16 text-center">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:absolute">
          <Image src={footerLogo} width={200} alt="EduBh logo" className="relative" />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-8">
          <a href="#" onClick={e => {e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'});}} className="hover:text-white transition-colors duration-200">Home</a>
          {pathname === "/contact" ? (
            <>
              <Link href="/#product-showcase" className="hover:text-white transition-colors duration-200">Programs</Link>
              <Link href="/#product-showcase" className="hover:text-white transition-colors duration-200">Universities</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors duration-200">Admissions</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors duration-200">Placements</Link>
            </>
          ) : (
            <>
              <a href="#product-showcase" className="hover:text-white transition-colors duration-200">Programs</a>
              <a href="#product-showcase" className="hover:text-white transition-colors duration-200">Universities</a>
              <a href="#pricing" className="hover:text-white transition-colors duration-200">Admissions</a>
              <a href="#pricing" className="hover:text-white transition-colors duration-200">Placements</a>
            </>
          )}
          <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link>
        </nav>
        <div className="flex justify-center items-center gap-6 mt-8">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><SocialX className="w-5 h-5 hover:opacity-80 transition-opacity cursor-pointer" /></a>
          <a href="https://instagram.com/edubh.official/" target="_blank" rel="noopener noreferrer"><SocialInsta className="w-5 h-5 hover:opacity-80 transition-opacity cursor-pointer" /></a>
          <a href="https://linkedin.com/company/edubhofficial/" target="_blank" rel="noopener noreferrer"><SocialLinkedIn className="w-5 h-5 hover:opacity-80 transition-opacity cursor-pointer" /></a>
          <a href="https://facebook.com/share/1B7B4tL4an/" target="_blank" rel="noopener noreferrer"><Image src={facebookPng} alt="Facebook" width={20} height={20} className="hover:opacity-80 transition-opacity cursor-pointer" /></a>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="mb-3">
            &copy; {new Date().getFullYear()} EduBh. Bridging Academia and Industry. All rights reserved.
          </p>
          <p className="text-xs opacity-75">
            Partner Universities: Manipal University
          </p>
        </div>
      </div>
    </footer>
  );
};
