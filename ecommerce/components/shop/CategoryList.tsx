"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useMemo } from "react";
import { Title } from "../ui/text";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { fetchProducts } from "@/lib/redux/products/productsThunk";
import { categoryLabels } from "@/constants/data";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
}

const CategoryList = ({ value, onChange }: Props) => {
  const { items } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const categories = useMemo<string[]>(() => {
    const unique = Array.from(
      new Set(
        items
          .map((p) => p.type?.toLowerCase())
          .filter((cat): cat is string => Boolean(cat))
      )
    );

    return unique.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [items]);

  return (
    <div className="w-full bg-white p-4 md:p-5 rounded-lg">
      <Title className="text-base font-bold">Danh mục</Title>

      <RadioGroup
        value={value?.toLowerCase() ?? ""}
        onValueChange={(val) => onChange(val ? val.toLowerCase() : null)}
        className="mt-3 space-y-1"
      >
        {categories.map((cat) => {
          const active = value?.toLowerCase() === cat;

          return (
            <label
              key={`category-${cat}`}
              htmlFor={cat}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-md
                transition cursor-pointer
                hover:bg-gray-100
                ${
                  active
                    ? "font-semibold text-shop-dark-green bg-green-50"
                    : "text-gray-700"
                }
              `}
            >
              <RadioGroupItem value={cat} id={cat} />
              <span className="text-sm md:text-base capitalize">
                {categoryLabels[cat] || cat}
              </span>
            </label>
          );
        })}
      </RadioGroup>

      {value && (
        <button
          onClick={() => onChange(null)}
          className="text-sm font-medium mt-3 underline underline-offset-2 hover:text-shop-dark-green transition"
        >
          Xóa danh mục
        </button>
      )}
    </div>
  );
};

export default CategoryList;
