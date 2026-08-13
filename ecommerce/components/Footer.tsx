import Container from "./Container";
import FooterTop from "./FooterTop";
import { Logo } from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              Shopcart mang đến trải nghiệm mua sắm điện tử gọn, rõ ràng trên
              máy tính và điện thoại — duyệt sản phẩm, giỏ hàng và thanh toán
              trong vài bước.
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              tooltipClassName="bg-darkColor text-white"
              iconClassName="border-darkColor/60 hover:border-shop_dark_green hover:text-shop_dark_green"
            />
          </div>
          <div>
            <SubTitle>Liên kết</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinksData.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:text-shop_light_green hoverEffect font-medium text-darkColor/60"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Danh mục</SubTitle>
            <ul className="space-y-3 mt-4">
              {categoriesData.map((item) => (
                <li key={item.title}>
                  <Link
                    href="/shop"
                    className="hover:text-shop_light_green hoverEffect font-medium text-darkColor/60"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <SubTitle>Bản tin</SubTitle>
            <SubText>Nhận thông tin khuyến mãi mới nhất</SubText>
            <form className="space-y-3">
              <Input placeholder="Nhập email..." type="email" required />
              <Button className="w-full">Đăng ký</Button>
            </form>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
