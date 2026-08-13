"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const HeaderMenu = () => {
  const pathName = usePathname();

  return (
    <nav className="hidden md:flex flex-1 items-center justify-center gap-7 font-semibold text-lightColor">
      {headerData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={`hover:text-shop-light-green hoverEffect relative group ${
            pathName === item.href ? "text-shop-light-green" : ""
          }`}
        >
          {item.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop-light-green group-hover:w-1/2 hoverEffect group-hover:left-0 ${
              pathName === item.href ? "w-1/2" : ""
            }`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop-light-green group-hover:w-1/2 hoverEffect group-hover:right-0 ${
              pathName === item.href ? "w-1/2" : ""
            }`}
          />
        </Link>
      ))}
    </nav>
  );
};
