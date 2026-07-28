"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Show extra nav items only on home page
  const navItems =
    pathname === "/"
      ? [
          { name: "Home", link: "/" },
          { name: "Overview", link: "#product-showcase" },
          { name: "Courses",  // Placeholder link, will not be used directly
            link: "#",
            dropdown: [
              { name: "Manipal University", link: "/manipal-courses" },
            ],
          },
          { name: "Contact", link: "/contact" },
        ]
      : [
          { name: "Home", link: "/" },
          { name: "Courses", 
            link: "#", // Placeholder link, will not be used directly
            dropdown: [
              { name: "Manipal University", link: "/manipal-courses" },
            ],
          },
          { name: "Contact", link: "/contact" },
        ];

  const handleItemClick = (link?: string) => (e?: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
    if (link && link.startsWith("#")) {
      e?.preventDefault();
      const id = link.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Navbar className="fixed top-0 z-40">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems
          items={navItems}
          onItemClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            const link = e.currentTarget.getAttribute("href") || undefined;
            handleItemClick(link)(e);
          }}
        />
        <NavbarButton
          variant="dark"
          className="bg-[#1A3EC3] hover:bg-[#2546a8]"
          href="/apply"
        >
          Enquire Now
        </NavbarButton>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)} dropdown={navItems.find(item => item.name === "Courses")?.dropdown}>
          <div className="flex flex-col gap-2 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg w-full">
            {navItems.map((item, idx) => (
              item.dropdown ? null : (
                <a
                  key={idx}
                  href={item.link}
                  onClick={handleItemClick(item.link)}
                  className="block w-full px-4 py-3 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  {item.name}
                </a>
              )
            ))}
            <NavbarButton variant="dark" className="w-full mt-2 bg-[#1A3EC3] hover:bg-[#2546a8]" href="/apply" onClick={() => setIsOpen(false)}>
              Enquire Now
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};
