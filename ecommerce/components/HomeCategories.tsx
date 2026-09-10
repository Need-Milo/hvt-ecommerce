"use client";

import { useEffect, useMemo } from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProducts } from "@/lib/redux/products/productsThunk";
import { categoryLabels } from "@/constants/data";

type CategoryCard = {
  slug: string;
  name: string;
  image?: string;
  count: number;
};

const HomeCategories = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const categories = useMemo<CategoryCard[]>(() => {
    const grouped = new Map<string, CategoryCard>();

    for (const product of items) {
      const slug = product.type?.toLowerCase();
      if (!slug) continue;

      const existing = grouped.get(slug);
      if (existing) {
        existing.count += 1;
        continue;
      }

      grouped.set(slug, {
        slug,
        name: categoryLabels[slug] || product.category || slug,
        image: product.image?.[0],
        count: 1,
      });
    }

    return Array.from(grouped.values());
  }, [items]);

  return (
    <div className="bg-white border border-shop-light-green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-3">Danh mục phổ biến</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => (
          <div
            key={category.slug}
            className="bg-shop-light-bg p-5 flex items-center gap-3 group"
          >
            <div
              className="overflow-hidden border
                                border-shop-orange/30 hover:border-shop-orange hoverEffect w-20 h-20 p-1"
            >
              <Link href={`/category/${category.slug}`}>
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain 
                                            group-hover:scale-110 hoverEffect"
                    unoptimized
                  />
                )}
              </Link>
            </div>
            <div className="space-y-2">
              <Link href={`/category/${category.slug}`}>
                <h3 className="text-base font-semibold">{category.name}</h3>
              </Link>
              <p className="text-sm">
                <span className="font-bold text-shop-dark-green">
                  {`(${category.count})`}
                </span>{" "}
                sản phẩm có sẵn
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
