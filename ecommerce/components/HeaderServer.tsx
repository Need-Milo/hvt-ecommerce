"use client";

import Container from "./Container";
import { Logo } from "./Logo";
import { HeaderMenu } from "./HeaderMenu";
import { SearchBar } from "./SearchBar";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import AuthNav from "./AuthNav";

const Header = () => {
  return (
    <header className="bg-white/80 py-4 sticky top-0 z-50 backdrop-blur-md border-b border-darkColor/5">
      <Container className="flex items-center justify-between gap-3">
        <MobileMenu />
        <div className="flex items-center">
          <Logo />
        </div>
        <HeaderMenu />
        <div className="flex items-center justify-end gap-4 md:gap-5 ml-auto">
          <SearchBar />
          <CartIcon />
          <AuthNav />
        </div>
      </Container>
    </header>
  );
};

export default Header;
