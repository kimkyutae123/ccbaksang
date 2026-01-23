'use client';
import { useRouter } from 'next/navigation';
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const router = useRouter();
    useEffect(() => {
        fetch('https://api.zeri.pics')
            .then(res => res.json())
            .then(data => {
                const shuffled = data.content.sort(() => 0.5 - Math.random());
                setRecommendations(shuffled.slice(0, 6));
            });
    }, []);

    const totalProductPrice = cart.reduce((total, item) => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
        return total + (priceNum * item.quantity);
    }, 0);

    return (
        <div className="min-h-screen bg-[#f4f4f4] pb-24">
            {/* --- 📱 모바일 최적화 헤더 --- */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
                <div className="max-w-2xl mx-auto h-14 flex items-center justify-between px-4">
                    {/* 왼쪽: 뒤로가기 */}
                    <Link href="/" className="text-2xl text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </Link>

                    {/* 중앙: 타이틀 */}
                    <h1 className="text-base font-bold text-gray-900">장바구니</h1>

                    {/* 오른쪽: 여백 (중앙 정렬을 위한 공간) */}
                    <div className="w-6"></div>
                </div>
            </header>

            {/* 헤더가 고정(fixed)이라서 그만큼 공간을 띄워줍니다 */}
            <div className="h-14"></div>

            {/* --- 탭 부분 (초록색 포인트) --- */}
            <div className="bg-white border-b sticky top-14 z-40">
                <div className="max-w-2xl mx-auto flex text-sm font-bold text-gray-400">
                    <div className="flex-1 text-center py-3 border-b-2 border-green-800 text-green-800">일반 상품</div>

                </div>
            </div>

            <main className="max-w-2xl mx-auto p-3 space-y-3 mt-2">
                {/* --- 상품 리스트 --- */}
                {cart.length === 0 ? (
                    <div className="bg-white rounded-lg py-20 text-center text-gray-400 shadow-sm">
                        담긴 상품이 없습니다.
                    </div>
                ) : (
                    cart.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 relative">
                            {/* 삭제 버튼 */}
                            <button
                                onClick={() => {
                                    if(confirm("정말 삭제하시겠습니까?")) removeFromCart(item.name);
                                }}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-20">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="flex gap-3">
                                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-[13px] text-gray-800 line-clamp-2 leading-snug mb-2 pr-6">{item.name}</h3>

                                    {/* 수량 조절 */}
                                    <div className="flex items-center gap-2 border w-fit px-1 py-0.5 rounded text-sm">
                                        <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="px-2 text-gray-400">-</button>
                                        <span className="px-1 font-bold min-w-[20px] text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="px-2 text-gray-400">+</button>
                                    </div>
                                </div>
                                <div className="font-bold text-sm text-gray-900 pt-1">{item.price}</div>
                            </div>
                        </div>
                    ))
                )}

                {/* --- 결제 정보 --- */}
                <div className="bg-white rounded-lg p-5 space-y-2 shadow-sm">
                    <div className="flex justify-between text-[13px] text-gray-500">
                        <span>총 상품금액</span>
                        <span>{totalProductPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                        <span>총 결제예정금액</span>
                        <span className="text-stone-700">{totalProductPrice.toLocaleString()}원</span>
                    </div>
                </div>

                {/* --- 추천 섹션 --- */}
                <section className="pt-4">
                    <h2 className="font-bold text-base mb-3 px-1">이런 상품은 어떠세요?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {recommendations.map((p) => (
                            <Link key={p.index} href={`/product/${encodeURIComponent(p.name)}`} className="bg-white p-2 rounded-lg shadow-xs">
                                <div className="aspect-square bg-gray-100 rounded mb-2" />
                                <p className="text-[11px] text-gray-600 line-clamp-2 h-7">{p.name}</p>
                                <p className="font-bold text-[13px] mt-1 text-stone-700">{p.price}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* --- 💰 하단 고정 결제 바 --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto p-3 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] text-stone-700 font-medium">총 결제금액 ({cart.length}건)</p>
                            </div>
                    <button
                        onClick={() => router.push(`/order`)}
                        className="flex-1 bg-green-800 text-white h-12 rounded-lg font-bold text-base active:scale-95 transition-all">
                        주문하기
                    </button>
                </div>
            </div>
        </div>
    );
}