import Shop from "@/components/Shop";
import { Suspense } from "react";

const ShopClient = () => {
  return (
    <div className="bg-white">
      <Suspense
        fallback={
          <p className="py-20 text-center text-gray-500">Đang tải sản phẩm...</p>
        }
      >
        <Shop />
      </Suspense>
    </div>
  );
};

export default ShopClient;
