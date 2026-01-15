// src/app/page.tsx
import Link from "next/link";

interface Product {
    index: number;
    name: string;
    price: string;
    current: number;
    limit: number;
    image: string | null;
}

interface ApiResponse{
    content:Product[];
    status:number;
}

export default async function Home({searchParams,}: {
    searchParams: { category?: string };
            }) {
    const selectedCategory = (await searchParams).category || '전체';

    const response = await fetch(`https://api.zeri.pics`, {cache: `no-store`});
    const result: ApiResponse = await response.json();
    const products = result.content;

    const getCategory = (name: string) => {
        if (name.includes(`귤`) || name.includes(`감`) || name.includes('배') || name.includes(`사과`)

            || name.includes(`딸기`) || name.includes(`멜론`) || name.includes(`복숭아`)) return `과일`;

        if (name.includes('양파') || name.includes('김치')) return '채소';

        if (name.includes('밀키트') || name.includes(`찌개`) || name.includes(`닭갈비`) || name.includes(`볶음`) || name.includes(`찜닭`) || name.includes(`유나베`)) return '밀키트';

        if (name.includes(`과자`) || name.includes(`쿠키`) || name.includes(`칩`) || name.includes(`팝콘`) || name.includes(`깡`) || name.includes(`쿠키`)) return `과자`;

        if (name.includes(`페스토`) || name.includes(`생지`) || name.includes(`식빵`) || name.includes(`스틱`)) return `빵/잼`

        if (name.includes(`요거트`) || name.includes(`주스`) || name.includes(`우유`) || name.includes(`브리즈`)) return `음료 및 유제품`

        if (name.includes(`김치`) || name.includes(`핑크솔트`) || name.includes(`올리브유`) || name.includes(`굴비`)) return `식재료 및 기타`
    };

    const categories = [`전체`, `과일`, `채소`, `밀키트`, `음료 및 유제품`, `빵/잼`, `식재료 및 기타`];

    const sortedProducts = [...products].sort((a, b) => {
        const isAsoldOut = a.current >= a.limit;
        const isBsoldOut = b.current >= b.limit;


        if (isAsoldOut !== isBsoldOut) {
            return isAsoldOut ? 1 : -1;
        }


        return a.index - b.index;
    })
        .filter(p => selectedCategory === `전체` || getCategory(p.name) === selectedCategory);


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justfly-center h-14 border-b">
                        <h1 className="text-2xl font-extrobold text-green-800 tracking-tight">척척밥상 공구 </h1>

                    </div>
                    <nav className="flex overflow-x-auto no-scrollbar whitespace-nowrap px-2">
                        {categories.map((cat) => (
                            <a
                                key={cat}
                                href={`?category=${cat}`}
                                className={`flex-1 text-center py-3 px-4 text-sm font-medium transition-color ${
                                    selectedCategory === cat
                                        ? `text-green-800 border-b-2 border-green-800`
                                        : `text-gray-500 hover:text-green-800`
                                }`}
                            >
                                {cat}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grld-cols-3 xl:grld-cols-4 gap-6">
                    {sortedProducts.map((product) => {
                        const isSoldOut = product.current >= product.limit;
                        const percent = Math.floor((product.current / product.limit) * 100);

                        return (
                            <Link href={`/product/${product.index}`}
                                  key={product.index}
                                  className="block group"
                            >
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative">
                                <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-300 text-xs">No Image</span>
                                    {isSoldOut && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span
                                                className="text-white font-bold border-2 border-whtie px-3 py-1 rounded"> 품절</span>

                                        </div>
                                    )}
                                </div>
                                <div className="p-3 flex flex-col flex-grow">
                                    <p className="text-xs text-gray-400 mb-1">{getCategory(product.name)}</p>
                                    <h2 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2 leading-tight">
                                        {product.name}
                                    </h2>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-gray-900">{product.price}</span>
                                        </div>

                                        {/* 공구 진행률 바 */}
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-orange-500 font-bold">{percent}% 달성</span>
                                                <span className="text-gray-400">{product.current}/{product.limit}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1 rounded-full">
                                                <div
                                                    className={`h-full rounded-full ${isSoldOut ? 'bg-gray-300' : 'bg-orange-500'}`}
                                                    style={{width: `${Math.min(percent, 100)}%`}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                     </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}