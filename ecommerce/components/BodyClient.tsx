"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../lib/redux/products/productsThunk";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import ProductsCard from "./ProductsCard";

const BodyClient = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);
  const [selectedTab, setSelectedTab] = useState(
    productType[0]?.value?.toLowerCase() || "featured"
  );

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const filteredData = useMemo(() => {
    if (selectedTab === "featured") {
      const featured = items.filter(
        (p) =>
          p.featured ||
          p.status === "hot" ||
          p.status === "new" ||
          p.status === "sale"
      );
      return featured.length ? featured : items.slice(0, 8);
    }

    return items.filter(
      (p) => p.type?.toLowerCase() === selectedTab.toLowerCase()
    );
  }, [items, selectedTab]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-shop-dark-green">
          Sản phẩm nổi bật
        </h2>
      </div>
      <HomeTabBar
        selectedTab={selectedTab}
        onTabSelect={(val) => setSelectedTab(val.toLowerCase())}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-gray-100 w-full mt-10">
          <div className="space-x-2 flex items-center text-shop-dark-green">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Đang tải sản phẩm...</span>
          </div>
        </div>
      ) : filteredData.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
          <AnimatePresence mode="wait">
            {filteredData.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProductsCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không có sản phẩm nổi bật
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default BodyClient;
