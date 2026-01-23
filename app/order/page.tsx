'use client';
import { useRouter } from 'next/navigation';
import { useCart } from "@/app/context/CartContext"; // 1. 장바구니 데이터 불러오기
import { useState } from 'react';
import Link from "next/link";

export default function OrderPage() {
    const { cart } = useCart(); // 2. 장바구니 목록 가져오기
    const router = useRouter();
    // 3. 실제 장바구니 상품 금액 합계 계산 로직
    const totalProductPrice = cart.reduce((total, item) => {
        // 가격 문자열에서 숫자만 추출 (예: "25,000원" -> 25000)
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
        return total + (priceNum * item.quantity);
    }, 0);


    const gohome = () => {
        alert("결제가 완료되었습니다");
        router.push('/');

    }
    const [paymentMethod, setPaymentMethod] = useState('신용카드');

    return (
        <div className="min-h-screen bg-gray-100 pb-32">
            <header className="h-14 bg-white border-b flex items-center px-4 sticky top-0 z-30">
                <Link href="/cart" className="text-xl">←</Link>
                <h1 className="flex-1 text-center font-bold text-base">주문/결제</h1>
            </header>

            <main className="max-w-2xl mx-auto p-3 space-y-4">
                {/* 주문자/배송지 정보 섹션 (생략) */}

                {/* --- 4. 실제 주문상품 목록 --- */}
                <section className="bg-white rounded-lg p-4 shadow-sm">
                    <h2 className="font-bold text-sm mb-4">주문상품 ({cart.length}건)</h2>
                    <div className="space-y-4">
                        {cart.map((item, index) => (
                            <div key={index} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
                                <div className="w-16 h-16 bg-gray-100 rounded" /> {/* 이미지 자리 */}
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-800">{item.name}</p>
                                    <p className="text-[11px] text-gray-400 mt-1">수량: {item.quantity}개</p>
                                    <p className="text-sm font-bold mt-1 text-gray-900">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 5. 실제 계산된 결제금액 --- */}
                <section className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                    <h2 className="font-bold text-sm border-b pb-3">결제금액</h2>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>상품금액</span>
                        <span>{totalProductPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>배송비</span>
                        <span className="text-blue-500 font-bold">무료</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 text-red-600 border-t">
                        <span>총 결제금액</span>
                        <span>{totalProductPrice.toLocaleString()}원</span>
                    </div>
                </section>



                {/* 약관 동의 */}
                <div className="p-2 space-y-2">
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                        <input type="checkbox" className="accent-green-800" />
                        <span>결제 서비스 이용약관 전체 동의</span>
                    </label>
                </div>

            </main>

            {/* --- 💰 하단 고정 결제 버튼 --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
            <div className="max-w-2xl mx-auto p-4">
                <button
                    onClick={gohome}
                    className="w-full bg-green-800 text-white h-14 rounded-xl font-bold text-lg">
                    {totalProductPrice.toLocaleString()}원 결제하기
                </button>
                </div>
            </div>
        </div>
    );
}