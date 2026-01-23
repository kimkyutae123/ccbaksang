'use client'; // 숫자가 변해야 하니까 클라이언트 컴포넌트!

import { useCart } from "@/app/context/CartContext"; // 보관함 전용 집게 가져오기

export default function CartBadge() {
    const { cartCount } = useCart(); // 보관함에서 진짜 숫자 꺼내기

    return (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {cartCount}
        </span>
    );
}