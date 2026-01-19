// src/app/product/[id]/page.tsx
import ProductAction from "@/components/ProductAction";
interface Product {
    index: number;
    name: string;
    price: string;
    current: number;
    limit: number;
}

// 동적 라우팅 이용하여 검색 Next.js가 폴더 이름을 보고 찾아옴
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const decodedName = decodeURIComponent(id);
    const response = await fetch(`https://api.zeri.pics`, { cache: 'no-store' });
    const result = await response.json();


    const product = result.content.find((p: Product) => p.name === decodedName);

    if (!product) return(
        <div className="p-20 text-center">
            <p>상품을 찾을 수 없습니다.</p>
            <a href="/" className="text-blue-500 underline mt-4 block"> 홈으로 돌아가기</a>

        </div>

            );

    const isSoldOut = product.current >= product.limit;
    const remaining = product.limit - product.current;

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-sm border-x relative">

                <header className="h-14 flex items-center px-4 border-b sticky top-0 bg-white z-10">
                    <a href="/" className="text-2xl mr-4 text-gray-600">←</a>
                    <h1 className="font-bold text-gray-800">상품 상세</h1>
                </header>


                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    <span className="text-gray-300">이미지 준비중</span>
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold border-2 border-white px-6 py-2">품절된 상품</span>
                        </div>
                    )}
                </div>


                <div className="p-6"> {/* 패딩을 살짝 늘려 쾌적하게 조절 */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 leading-snug">
                            {product.name}
                        </h2>
                        <p className="text-2xl font-black text-green-800 mt-2">{product.price}</p>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    <div className="space-y-4 text-sm">
                        <div className="flex items-center">
                            <span className="w-24 text-gray-400">배송</span>
                            <span className="text-blue-500 font-semibold">무료배송</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-24 text-gray-400">남은수량</span>
                            <span className="text-gray-800 font-bold">{remaining}개</span>
                        </div>
                    </div>
                </div>



                <ProductAction product={product} />
            </div>
        </div>
    );
}