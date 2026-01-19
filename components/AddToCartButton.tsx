'use client'; // 이 버튼만 클라이언트 컴포넌트라고 선언!

interface Props {
    productName: string;
}

export default function AddToCartButton({ productName }: Props) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert(`${productName} 장바구니에 담았습니다!`);
            }}
            className="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-green-800 hover:text-white transition-all transform active:scale-90 z-20"
        >
            <span className="text-xl">🛒</span>
        </button>
    );
}