"use client"

import React from 'react'
import { Title } from './ui/text'
import { Product } from '@/lib/redux/products/productsSlice'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/lib/redux/hooks'



const HomeCategories = () => {
    const {items} = useAppSelector((state) => state.products )
  return (
    <div className='bg-white border border-shop-light-green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md ' >
        <Title className='border-b pb-3' > Danh mục phổ biến </Title>
        <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ' >                        
                    {items?.slice(0,6).map((product) => (
                        <div key={product?.id} className='bg-shop-light-bg p-5 flex items-center gap-3 group '  >
                                <div className='overflow-hidden border
                                border-shop-orange/30 hover:border-shop-orange hoverEffect w-20 h-20 p-1 ' >
                                    <Link href={`/products/${product.id}`} >
                                        <Image  
                                            src={product.image[0]}
                                            alt = "categoryImage"
                                            width={500}
                                            height={500}
                                            className='w-full h-full object-contain 
                                            group-hover:scale-110 hoverEffect'
                                            unoptimized
                                            />
                                    </Link>
                                </div>
                                <div className='space-y-2' >
                                    <h3 className='text-base font-semibold' >{product.name}</h3>
                                    <p className='text-sm' > <span className='font-bold text-shop-dark-green' >{`(${product.stock})`}</span> sản phẩm có sẵn </p>
                                </div>
                            </div>
                            

                    ))}
                   
                
     
        </div>
    </div>
  )
}

export default HomeCategories