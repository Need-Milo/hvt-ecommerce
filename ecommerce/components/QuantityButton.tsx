import { useAppDispatch } from "@/lib/redux/hooks";
import { Product } from "@/lib/redux/products/productsSlice";
import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { addToCart, removeFromCart } from "@/lib/redux/carts/cartsThunk";

interface Props {
  userId: string | number;
  itemId: number;
  productId: number;
  quantity: number;
  product: Product;
  className?: string;
}

const QuantityButton = ({
  userId,
  itemId,
  product,
  productId,
  quantity,
  className,
}: Props) => {
  const dispatch = useAppDispatch();
  const isMaxQuantity = quantity >= product.stock;

  const handlePlus = () => {
    if (isMaxQuantity) return;

    dispatch(
      addToCart({
        userId,
        item: {
          productId,
          quantity: 1,
        },
      })
    );
  };

  const handleMinus = () => {
    if (!itemId) return;

    dispatch(
      removeFromCart({
        userId,
        itemId,
      })
    );
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={quantity <= 0}
        onClick={handleMinus}
        className="w-6 h-6 hover:bg-shop-dark-green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {quantity}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={isMaxQuantity}
        className="w-6 h-6 hover:bg-shop-dark-green/20 hoverEffect"
        onClick={handlePlus}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButton;
