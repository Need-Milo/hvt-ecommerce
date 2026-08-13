import { Title } from "./ui/text";
import Link from "next/link";
import { banner_1 } from "@/images";
import Image from "next/image";

const HeaderBanner = () => {
  return (
    <div className="py-16 md:py-0 bg-shop-light-pink rounded-lg px-10 lg:px-24 flex items-center justify-between">
      <div className="space-y-5 py-10">
        <Title>
          Giảm đến 50%
          <br />
          cho tai nghe chọn lọc
        </Title>
        <Link
          href="/shop"
          className="inline-block bg-shop-btn-dark-green/90 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-shop-btn-dark-green hoverEffect"
        >
          Mua ngay
        </Link>
      </div>
      <div>
        <Image
          src={banner_1}
          alt="banner"
          className="hidden md:inline-flex w-96"
        />
      </div>
    </div>
  );
};

export default HeaderBanner;
