"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const products = useAppSelector((state) => state.products.items);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const results =
    keyword.length > 0
      ? products.filter((product) =>
          product.name.toLowerCase().includes(keyword.toLowerCase())
        )
      : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hover:text-shop-light-green hoverEffect"
        aria-label="Tìm kiếm sản phẩm"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-72 md:w-80 bg-white border rounded-lg shadow-lg p-2 z-50">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tìm sản phẩm theo tên..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full border px-3 py-2 rounded outline-none text-sm"
              autoFocus
            />
          </form>

          {keyword && (
            <div className="mt-2 max-h-72 overflow-y-auto">
              {results.length > 0 ? (
                results.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                  >
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-contain border border-gray-300 rounded-md"
                      unoptimized
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ${product.price}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-400 p-2">
                  Không tìm thấy sản phẩm
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
