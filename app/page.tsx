// src/app/page.tsx
import Link from "next/link";
import DraggableScroll from "@/components/DraggableScroll";
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
    searchParams:Promise< { category?: string; search?: string }>;
            }) {
    const {category, search} = await searchParams;
    // 값이 없을 때를 대비한 기본값 설정
    const selectedCategory = category || `전체`;
    const searchQuery = search || '';

    const response = await fetch(`https://api.zeri.pics`, {cache: `no-store`});
    const result: ApiResponse = await response.json();
    const products = result.content;


    /// DB에 상품 카테고리 등이 없기 때문에 이름만보고 코드로 분류
    const getCategory = (name: string) => {
        if (name.includes(`귤`) || name.includes(`감`) || name.includes('배') || name.includes(`사과`)

            || name.includes(`딸기`) || name.includes(`멜론`) || name.includes(`복숭아`)) return `C001`;

        if (name.includes('양파') || name.includes('김치')) return 'C002';

        if (name.includes('밀키트') || name.includes(`찌개`) || name.includes(`닭갈비`) || name.includes(`볶음`) || name.includes(`찜닭`) || name.includes(`유나베`)) return 'C003';

        if (name.includes(`과자`) || name.includes(`쿠키`) || name.includes(`칩`) || name.includes(`팝콘`) || name.includes(`깡`) || name.includes(`쿠키`)) return `C004`;

        if (name.includes(`페스토`) || name.includes(`생지`) || name.includes(`식빵`) || name.includes(`스틱`)) return `C005`

        if (name.includes(`요거트`) || name.includes(`주스`) || name.includes(`우유`) || name.includes(`브리즈`)) return `C006`

        if (name.includes(`김치`) || name.includes(`핑크솔트`) || name.includes(`올리브유`) || name.includes(`굴비`)) return `C007`
    };

    const categories = [
        { name: '전체', id: '전체' },
        { name: '과일', id: 'C001' },
        { name: '채소', id: 'C002' },
        { name: '밀키트', id: 'C003' },
        { name: '과자', id: 'C004' },
        { name: '빵/잼', id: 'C005' },
        { name: '음료/유제품', id: 'C006' },
        { name: '식재료/기타', id: 'C007' },
    ];
    const getCategoryName = (id: string | undefined) => {
        const category = categories.find(c=> c.id === id);
        return category ? category.name : id;

    }
    const newYearGifts = products
        .filter(p => getCategory(p.name) === `C001`)
        .slice(0,6);


    const newProducts=[...products]
        .sort((a,b) => b.index - a.index)
        .slice(0,6);

    const timeSaleProducts = products.slice(10,14)

    /* C001 과일
       C002 채소
       C003 밀키트
       C004 음료 및 유제품
       C005 빵/잼
       C006 식재료 및 기타
    * */
    const sortedProducts = [...products].sort((a, b) => {
        const isAsoldOut = a.current >= a.limit;
        const isBsoldOut = b.current >= b.limit;


        if (isAsoldOut !== isBsoldOut) {
            return isAsoldOut ? 1 : -1;
        }


        return a.index - b.index;
    })
        .filter(p =>{

            const isCategoryMatch = selectedCategory === `전체` || getCategory(p.name) === selectedCategory;
            const categoryId = getCategory(p.name); // 이 상품의 카테고리 ID
            const categoryName = getCategoryName(categoryId); // 이 상품의 카테고리 한글명

            const isNameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()); // 이름에 단어가 있나?
            const isCategoryNameMatch = categoryName?.includes(searchQuery); // 카테고리 이름이 검색어와 같나?

            const isSearchMatch = isNameMatch || isCategoryNameMatch; //


            return isCategoryMatch && isSearchMatch;
        });

    // 인덱스 sort 정렬 검증

    // console.log("=== [정렬 결과 검증] ===");
    // sortedProducts.forEach((p, i) => {
    //     const isSoldOut = p.current >= p.limit;
    //     console.log(
    //         `순서: ${i + 1} | 인덱스: ${p.index} | 이름: ${p.name.padEnd(10)} | 품절여부: ${isSoldOut ? "O (품절)" : "X"}`
    //     );
    // });
    // console.log("======================");


    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- 헤더 영역 --- */}
            <header className="max-w-6xl mx-auto bg-white border-b sticky top-0 z-10 shadow-sm w-full">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center h-20 px-4 gap-4">
                        <h1 className="text-xl font-extrobold text-green-800 tracking-tight">척척밥상 공구 </h1>
                        <div className="flex-1">
                            <form action="/" method="GET" className="relative">
                                <input type="hidden" name="category" value={selectedCategory}/>
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={searchQuery}
                                    placeholder="먹고 싶은 음식을 검색해보세요!"
                                    className="w-full h-10 bg-gray-100 rounded-full px-6 outline-none focus:ring-2 focus:ring-green-800 text-sm"
                                />
                                <button type="submit" className="absolute right-4 top-2.5 text-gray-400">
                                    🔍
                                </button>
                            </form>
                        </div>
                    </div>
                    <nav className="flex overflow-x-auto no-scrollbar whitespace-nowrap px-2">
                        {categories.map((cat) => (
                            <a
                                key={cat.id}
                                href={`?category=${cat.id}`}
                                className={`flex-1 text-center py-3 px-4 text-sm font-medium transition-color ${
                                    selectedCategory === cat.id
                                        ? `text-green-800 border-b-2 border-green-800`
                                        : `text-gray-500 hover:text-green-800`
                                }`}
                            >
                                {cat.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            {/* --- 메인 콘텐츠 영역 (하나의 main으로 통합) --- */}
            <main className="max-w-6xl mx-auto p-3 sm:p-6">

                {/* 1. 큐레이션 섹션들 (검색 중이 아닐 때만 보여주는 것이 깔끔합니다) */}
                {!searchQuery && selectedCategory === '전체' && (
                    <div className="space-y-10 mb-12">
                        {/* 신년 선물 세트 */}
                        <section>
                            <div className="flex justify-between items-end mb-4 px-1">
                                <div>
                                    <span className="text-orange-600 text-xs font-bold">2026 설 준비 🧧</span>
                                    <h2 className="text-xl font-bold text-gray-900">신년 선물 세트</h2>
                                </div>
                                <Link href="/?category=C001" className="text-sm text-gray-500 hover:text-green-800 font-medium">
                                    전체보기 〉
                                </Link>
                            </div>
                            <DraggableScroll>

                                {newYearGifts.map((product) => (
                                    <Link
                                        key={product.index}
                                        href={`/product/${encodeURIComponent(product.name)}`}
                                        draggable={false}
                                        className="min-w-[160px] sm:min-w-[200px] group"
                                    >
                                        <div className="bg-white rounded-xl shadow-sm border p-2 h-full">
                                            {/* 이미지 영역 */}
                                            <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                                <span className="text-gray-300 text-xs">No Image</span>
                                            </div>
                                            {/* 정보 영역 */}
                                            <div className="px-1">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-base font-bold text-gray-900">{product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </DraggableScroll>

                        </section>

                        {/* 테마 섹션: 3시간 타임세일 */}
                        <section>
                            <div className="flex justify-between items-end mb-4 px-1">
                                <div>
                    <span className="text-red-600 text-xs font-bold flex items-center gap-1">
                        <span className="animate-pulse">⏱</span> 02:59:59 남음
                    </span>
                                    <h2 className="text-xl font-bold text-gray-900">오늘만 이 가격! 타임세일</h2>
                                </div>
                            </div>
                            <DraggableScroll>
                                {timeSaleProducts.map((product) => (
                                    <Link
                                        key={product.index}
                                        href={`/product/${encodeURIComponent(product.name)}`}
                                        draggable={false}
                                        className="min-w-[160px] sm:min-w-[200px] group"
                                    >
                                        <div className="bg-white rounded-xl shadow-sm border p-2 h-full">
                                            {/* 이미지 영역 */}
                                            <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                                <span className="text-gray-300 text-xs">No Image</span>
                                            </div>
                                            {/* 정보 영역 */}
                                            <div className="px-1">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-base font-bold text-gray-900">{product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </DraggableScroll>
                        </section>

                        {/* 테마 섹션: 겨울에 맛있는 과일 */}
                        <section>
                            <div className="flex justify-between items-end mb-4 px-1">
                                <h2 className="text-xl font-bold text-gray-900">겨울에 맛있는 과일 🍓</h2>

                            </div>
                            <DraggableScroll>
                                {newYearGifts.map((product) => (
                                    <Link
                                        key={product.index}
                                        href={`/product/${encodeURIComponent(product.name)}`}
                                        draggable={false}
                                        className="min-w-[160px] sm:min-w-[200px] group"
                                    >
                                        <div className="bg-white rounded-xl shadow-sm border p-2 h-full">
                                            {/* 이미지 영역 */}
                                            <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                                <span className="text-gray-300 text-xs">No Image</span>
                                            </div>
                                            {/* 정보 영역 */}
                                            <div className="px-1">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-base font-bold text-gray-900">{product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </DraggableScroll>
                        </section>

                        {/* 테마 섹션: 새로나온 신상품 */}
                        <section>
                            <div className="mb-4 px-1">
                                <h2 className="text-xl font-bold text-gray-900">이번 주 신상품 ✨</h2>
                                <p className="text-sm text-gray-400">가장 먼저 만나보는 척척밥상 신상</p>
                            </div>
                            <DraggableScroll>
                                {newProducts.map((product) => (
                                    <Link
                                        key={product.index}
                                        href={`/product/${encodeURIComponent(product.name)}`}
                                        draggable={false}
                                        className="min-w-[160px] sm:min-w-[200px] group"
                                    >
                                        <div className="bg-white rounded-xl shadow-sm border p-2 h-full">
                                            {/* 이미지 영역 */}
                                            <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                                <span className="text-gray-300 text-xs">No Image</span>
                                            </div>
                                            {/* 정보 영역 */}
                                            <div className="px-1">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-base font-bold text-gray-900">{product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </DraggableScroll>
                        </section>
                    </div>
                )}

                {/* 2. 검색 결과 없음 예외 처리 */}
                {searchQuery && sortedProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-lg">
                            "<span className="font-bold text-gray-800">{searchQuery}</span>" 에 대한 결과가 없어요.
                        </p>
                        <a href="/" className="inline-block mt-4 text-green-800 underline font-medium">
                            전체 상품 보러가기
                        </a>
                    </div>
                )}

                {/* 3. 전체 상품 리스트 제목 */}
                <div className="mb-6 px-1">
                    <h2 className="text-xl font-bold text-gray-900">
                        {searchQuery ? `"${searchQuery}" 검색 결과` : '전체 상품 보기'}
                    </h2>
                </div>

                {/* 4. 상품 그리드 리스트 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => {
                        const isSoldOut = product.current >= product.limit;
                        const percent = Math.floor((product.current / product.limit) * 100);

                        return (
                            <Link
                                href={`/product/${encodeURIComponent(product.name)}`}
                                key={product.index}
                                className="block group"
                            >
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative">
                                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-300 text-xs">No Image</span>
                                        {isSoldOut && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white font-bold border-2 border-white px-3 py-1 rounded"> 품절</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-grow">
                                        <p className="text-xs text-gray-400 mb-1">{getCategoryName(getCategory(product.name))}</p>
                                        <h2 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2 leading-tight">
                                            {product.name}
                                        </h2>
                                        <div className="mt-auto">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-gray-900">{product.price}</span>
                                            </div>
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
            </main> {/* main 닫기 */}
        </div> /* 최상위 div 닫기 */
    );
}