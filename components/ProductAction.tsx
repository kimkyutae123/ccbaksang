'use client';

import {useState} from 'react';
import {useCart} from "@/app/context/CartContext";
import { useRouter } from 'next/navigation';

interface Product{
    name:string;
    price:string;
    current: number;
    limit:number;

}

export default function ProductAction({product}:{product:Product}) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const {addToCart} = useCart();

    const isSoldOut = product.current >= product.limit;

    const handleAddToCart = () => {
        addToCart({
            name:product.name,
            price:product.price,
            quantity: quantity
        });
        alert(`${product.name} ${quantity}개를 장바구니에 담았습니다!`);
        router.push('/order');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-6xl mx-auto p-4 bg-white border-t flex flex-col gap-3 z-20">
            {!isSoldOut && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-600"> 수량 선택</span>
                    <div className="flex items.center gap-4 bg-white border rounded-md px-2 py-1">
                        <button
                            onClick={() => setQuantity(Math.max(1,quantity -1))}
                            className="text-gray-500 font bold px-2"
                            >-</button>
                        <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity +1 )}
                                className="text-gray-500 font-bold px-2"
                                >+</button>
                    </div>
                </div>
            )}
            <div className="flex gap-2 h-14">
                <button
                    disabled={isSoldOut}
                    className={`flex-[1] rounded-xl font-bold text-lg shadow-md transition-all ${
                        isSoldOut
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-800 text-white hover:bg-green-900 active:scale-95'
                    }`}
                >
                    {isSoldOut ? '품절' : '공동구매 하기'}
                </button>
                <button
                    disabled={isSoldOut}
                    onClick={handleAddToCart}
                    className={`flex-[2] rounded-xl font-bold text-lg shadow-md transition-all ${
                        isSoldOut
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-800 text-white hover:bg-green-900 active:scale-95'
                    }`}
                >
                    {isSoldOut ? '품절' : '상품구매하기'}
                </button>
            </div>
        </div>
    );
}