import Container from "@/components/Container";
import HeaderBanner from "@/components/HeaderBanner";
import HomeCategories from "@/components/HomeCategories";
import ShopByBrands from "@/components/ShopByBrands";
import BodyServer from "@/components/BodyClient";

export default function Home() {
  return (
    <Container>
      <HeaderBanner />
      <div className="py-10">
        <BodyServer />
      </div>
      <HomeCategories />
      <ShopByBrands />
    </Container>
  );
}
