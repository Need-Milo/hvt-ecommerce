"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface Props {
  images: string[]
  isStock?: boolean
}

const ImageView = ({ images, isStock }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="w-full md:w-1/2 space-y-4">
      
      <div className="relative w-full min-h-[450px] border border-darkColor/10 rounded-md overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[selectedIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={images[selectedIndex]}
              alt="product"
              width={700}
              height={700}
              unoptimized
              className={`w-full h-[500px] object-contain transition duration-300 group-hover:scale-105 ${
                !isStock ? "opacity-50" : ""
              }`}
            />
          </motion.div>
        </AnimatePresence>

        {!isStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
            Hết hàng
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 border rounded-md cursor-pointer overflow-hidden transition ${
                selectedIndex === index
                  ? "border-shop-dark-green"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={img}
                alt="thumb"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageView