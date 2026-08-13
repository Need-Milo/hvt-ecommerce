import { Poppins } from "next/font/google";
import Providers from "./providers";
import { Metadata } from "next";
import "./globals.css";
import AuthBootsTrap from "@/components/AuthBootsTrap";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: {
    template: "%s - Shopcart",
    default: "Shopcart",
  },
  description: "Website thương mại điện tử Shopcart — duyệt sản phẩm, giỏ hàng và thanh toán.",
};

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
})
 {
  return (
    <html lang="vi">
  <body
    className={`${poppins.variable} ${poppins.className} antialiased`}
    suppressHydrationWarning
  >
    <Providers>
      <div className=" flex flex-col min-h-screen" >
        <Toaster position="bottom-right" />
        <AuthBootsTrap/>
      {children}
      </div>
      </Providers>
  </body>
</html>
  );
}
