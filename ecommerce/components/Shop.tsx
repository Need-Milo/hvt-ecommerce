"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import Container from "./Container";
import { Title } from "./ui/text";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { fetchProducts } from "@/lib/redux/products/productsThunk";
import ProductsCard from "./ProductsCard";
import Pagination from "./Pagination";
import { useSearchParams } from "next/navigation";

const Shop = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.trim() || "";

  const { items, loading } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, price, sort, keyword]);

  const parsePrice = (range: string | null) => {
    if (!range) return null;
    const [min, max] = range.split("-").map(Number);
    return { min, max };
  };

  const priceRange = parsePrice(price);

  let filteredItems = items.filter((p) => {
    const matchCategory = category
      ? p.type?.toLowerCase() === category.toLowerCase()
      : true;
    const matchPrice = priceRange
      ? p.price >= priceRange.min && p.price <= priceRange.max
      : true;
    const matchKeyword = keyword
      ? p.name.toLowerCase().includes(keyword.toLowerCase())
      : true;
    return matchCategory && matchPrice && matchKeyword;
  });

  if (sort === "price-asc") {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    filteredItems = [...filteredItems].sort((a, b) =>
      a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
    );
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-[72px] z-10 mb-5 bg-white/90 backdrop-blur-sm py-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <Title className="text-lg uppercase tracking-wide">
              {keyword ? `Kết quả cho “${keyword}”` : "Tất cả sản phẩm"}
            </Title>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Sắp xếp
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-shop-dark-green"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
              </select>
              <button
                onClick={() => {
                  setCategory(null);
                  setPrice(null);
                  setSort("default");
                }}
                className="text-shop-dark-green underline text-sm font-medium hover:text-shop-orange"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop-dark-green/50">
          <div className="md:sticky md:top-28 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop-btn-dark-green/50 scrollbar-hide">
            <CategoryList value={category} onChange={setCategory} />
            <PriceList value={price} onChange={setPrice} />
          </div>

          <div className="flex-1 pt-5">
            {loading && <p>Đang tải sản phẩm...</p>}

            {!loading && paginatedItems.length === 0 && (
              <p className="text-center text-gray-500 py-16">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            )}

            {!loading && paginatedItems.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 py-3">
                  {paginatedItems.map((u) => (
                    <ProductsCard key={u.id} product={u} />
                  ))}
                </div>
                <div className="mb-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
