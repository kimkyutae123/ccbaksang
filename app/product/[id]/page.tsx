'use client'; //
// src/app/product/[id]/page.tsx
import ProductAction from "@/components/ProductAction";
import CartBadge from "@/components/CartBadge";
import Link from "next/link";
import { useState, useEffect, use } from 'react';
interface Product {
    index: number;
    name: string;
    price: string;
    current: number;
    limit: number;
}

// 동적 라우팅 이용하여 검색 Next.js가 폴더 이름을 보고 찾아옴
export default  function ProductDetail({ params }: { params: Promise<{ id: string }> }) {

    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [activeTab, setActiveTab] = useState('정보');
    const [loading, setLoading] = useState(true);

    const [recommendations, setRecommendations] = useState<Product[]>([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const decodedName = decodeURIComponent(id);
                const response = await fetch(`https://api.zeri.pics`);
                const result = await response.json();

                // 상세 상품 찾기
                const found = result.content.find((p: Product) => p.name === decodedName);
                setProduct(found);

                // 추천 상품 섞기 (현재 상품 제외)
                const shuffled = result.content
                    .filter((p: Product) => p.name !== decodedName)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 49);
                setRecommendations(shuffled);
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-20 text-center">로딩 중...</div>;
    if (!product) return <div className="p-20 text-center text-gray-400">상품을 찾을 수 없습니다.</div>;
    const isSoldOut = product.current >= product.limit;
    const remaining = product.limit - product.current;

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-sm border-x relative pb-40">

                <header className="h-14 flex items-center px-4 border-b sticky top-0 bg-white z-10">
                    <Link href="/" className="text-2xl mr-4 text-gray-600 hover:text-green-800 transition-colors">
                        ←
                    </Link>
                    <h1 className="font-bold text-gray-800 flex-1">상품 상세</h1>
                    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-green-800 transition-colors">
                        <span className="text-2xl">🛒</span>
                        <CartBadge />
                    </Link>
                </header>


                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    <span className="text-gray-300">이미지 준비중</span>
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold border-2 border-white px-6 py-2">품절된 상품</span>
                        </div>
                    )}
                </div>


                <div className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h2>
                        <p className="text-2xl font-black text-green-800 mt-2">{product.price}</p>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    <div className="space-y-4 text-sm mb-8">
                        <div className="flex items-center">
                            <span className="w-24 text-gray-400">배송</span>
                            <span className="text-blue-500 font-semibold">무료배송</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-24 text-gray-400">남은수량</span>
                            <span className="text-gray-800 font-bold">{remaining}개</span>
                        </div>
                    </div>


                    <div className="border-t pt-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4 ">공동구매를 원하는 사람들</h3>


                        <div className="space-y-3">
                            {[
                                { id: 1, current: 1, max: 2, status: '대기중' },
                                { id: 2, current: 1, max: 2, status: '대기중' },
                                { id: 3, current: 2, max: 2, status: '완료' },
                                { id: 4, current: 2, max: 2, status: '완료' },
                                { id: 5, current: 2, max: 2, status: '완료' },
                            ].map((group) => (
                                <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:border-green-200">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800">공동구매 {group.id}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                group.status === '완료' ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {group.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">모집 인원 ({group.current}/{group.max})</p>
                                    </div>

                                    <button
                                        disabled={group.status === '완료'}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all ${
                                            group.status === '완료'
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-800 text-white hover:bg-green-900 active:scale-95'
                                        }`}
                                    >
                                        {group.status === '완료' ? '참여불가' : '참여하기'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-[11px] text-gray-400">
                            * 공동구매는 인원이 모두 모이면 자동으로 결제가 진행됩니다.
                        </p>
                    </div>
                </div>

                {/* --- 🛠 탭 메뉴: 이제 클릭이 작동합니다! --- */}
                <div className="flex border-b sticky top-14 bg-white z-20">
                    {['정보', '후기', '문의'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)} // 4. 클릭하면 상태를 변경합니다
                            className={`flex-1 py-4 text-sm font-bold transition-all ${
                                activeTab === tab
                                    ? 'text-green-800 border-b-2 border-green-800 bg-gray-50'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab === '정보' ? '상품정보' : tab === '후기' ? '상품후기' : '상품문의'}
                        </button>
                    ))}
                </div>
                <div className="p-6">

                    {/* 1. 상품정보 내용 (기존 상세 설명 위치) */}
                    <div className="p-6">
                        {/* 상품정보 탭 내용 */}
                        {activeTab === '정보' && (
                            <div className="space-y-0">
                                <p className="font-bold text-gray-800 mb-4">산지에서 갓 따온 신선함</p>
                                {/* 이미지 100개 로직 */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="w-full h-80 bg-gray-100 mb-2 flex items-center justify-center text-gray-300">
                                        상세 이미지 준비중 (a{i+1}.png)
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 상품후기 탭 내용 */}
                        {activeTab === '후기' && (
                            <div className="py-20 text-center text-gray-400">아직 작성된 후기가 없습니다.</div>
                        )}

                        {/* 상품문의 탭 내용 */}
                        {activeTab === '문의' && (
                            <div className="py-20 text-center text-gray-400">문의 사항이 있으시면 남겨주세요.</div>
                        )}
                    </div>

                    {/* 2. 상품리뷰 (내용이 없을 때 예시) */}
                    {/* <div className="py-20 text-center text-gray-400">등록된 리뷰가 없습니다.</div>

                    {/* 3. 상품문의 (내용이 없을 때 예시) */}
                    {/* <div className="py-20 text-center text-gray-400">등록된 문의가 없습니다.</div> */}

                </div>

                {/* --- 이런 상품은 어떠세요 섹션 --- */}
                <section className="pt-10 border-t px-6">
                    <h2 className="font-bold text-lg mb-4 text-gray-900">이런 상품은 어떠세요?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {recommendations.map((p, index) => (
                            <Link key={index} href={`/product/${encodeURIComponent(p.name)}`} className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                <div className="aspect-square bg-gray-50 rounded-lg mb-2" />
                                <p className="text-[12px] text-gray-700 line-clamp-2 h-8 font-medium">{p.name}</p>
                                <p className="font-bold text-sm mt-1 text-green-800">{p.price}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <ProductAction product={product} />
            </div>
        </div>
    );
}