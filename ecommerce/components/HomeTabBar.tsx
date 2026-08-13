import { productType } from '@/constants/data'
import Link from 'next/link'

interface Props {
  selectedTab: string
  onTabSelect: (tab: string) => void
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-5">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {productType.map((item) => {
          const isActive = selectedTab === item.value
          return (
            <button
              key={item.title}
              onClick={() => onTabSelect(item.value)}
              className={`border px-4 py-1.5 md:px-6 md:py-2 rounded-full hoverEffect
                ${
                  isActive
                    ? 'bg-shop-light-green text-white border-shop-light-green'
                    : 'border-shop-light-green/30 hover:bg-shop-light-green hover:border-shop-light-green hover:text-white'
                }
              `}
            >
              {item.title}
            </button>
          )
        })}
      </div>

      <Link
        href="/shop"
        className="border border-shop-light-green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop-light-green hover:border-shop-light-green hover:text-white hoverEffect"
      >
        Xem tất cả
      </Link>
    </div>
  )
}

export default HomeTabBar
