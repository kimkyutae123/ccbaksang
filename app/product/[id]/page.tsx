// src/app/product/[id]/page.tsx
interface Product {
    index: number;
    name: string;
    price: string;
    current: number;
    limit: number;
}
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    // 1. params 자체가 Promise이므로 await로 먼저 뜯어야 합니다.
    const { id } = await params;

    const response = await fetch(`https://api.zeri.pics`, { cache: 'no-store' });
    const result = await response.json();

    // 2. 찾아온 id(문자열)를 숫자(Number)로 바꿔서 비교!
    const product = result.content.find((p: Product) => p.index === Number(id));

    if (!product) return <div>상품을 찾을 수 없습니다. ID: {id}</div>;

    const isSoldOut = product.current >= product.limit;
    const remaining = product.limit - product.current;

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* 상단 네비게이션 */}
            <header className="h-14 flex items-center px-4 border-b sticky top-0 bg-white z-10">
                <a href="/" className="text-2xl mr-4">←</a>
                <h1 className="font-bold">상품 상세</h1>
            </header>

            {/* 1. 이미지 영역 (요청하신 맨 위 이미지) */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                <span className="text-gray-400">이미지 준비중</span>
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold border-2 border-white px-6 py-2">품절된 상품</span>
                    </div>
                )}
            </div>

            {/* 2. 상품 정보 영역 */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-medium text-gray-900 leading-snug">
                        {product.name}
                    </h2>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black text-gray-900">{product.price}</span>
                </div>

                <hr className="border-gray-100 mb-6" />

                {/* 3. 배송 정보 영역 */}
                <div className="space-y-4 text-sm">
                    <div className="flex">
                        <span className="w-20 text-gray-400">배송</span>
                        <span className="text-gray-800 font-medium text-blue-500">무료배송</span>
                    </div>
                    <div className="flex">
                        <span className="w-20 text-gray-400">남은수량</span>
                        <span className="text-gray-800 font-bold">{remaining}개</span>
                    </div>
                </div>
            </div>

            {/* 4. 하단 고정 구매 버튼 (공동구매 참여하기) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-7xl mx-auto">
                <button
                    disabled={isSoldOut}
                    className={`w-full h-14 rounded-lg font-bold text-lg transition-colors ${
                        isSoldOut
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
                    }`}
                >
                    {isSoldOut ? '공동구매 종료' : '공동구매 참여하기'}
                </button>
            </div>
        </div>
    );
}