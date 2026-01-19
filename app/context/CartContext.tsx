'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    name: string;
    price: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    cartCount: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (name: string) => void; // [추가] 삭제 함수 설계도
    updateQuantity: (name: string, quantity: number) => void; // [추가] 수량 수정 설계도
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // 1. [불러오기] 브라우저 창고에서 데이터 로드
    useEffect(() => {
        const savedCart = localStorage.getItem('my-app-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // 2. [저장하기] 장바구니 내용이 바뀔 때마다 창고 업데이트
    useEffect(() => {
        localStorage.setItem('my-app-cart', JSON.stringify(cart));
    }, [cart]);

    // [계산] 전체 수량 합계
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    // [기능1] 장바구니 담기
    const addToCart = (newItem: CartItem) => {
        setCart((prev) => {
            const existing = prev.findIndex((item) => item.name === newItem.name);
            if (existing > -1) {
                const newCart = [...prev];
                newCart[existing].quantity += newItem.quantity;
                return newCart;
            }
            return [...prev, newItem];
        });
    };

    // [기능2] 장바구니에서 삭제 (새로 추가됨!)
    const removeFromCart = (name: string) => {
        // filter 함수를 사용해서 '내가 선택한 이름과 다른 상품들'만 남깁니다.
        // 결과적으로 선택한 그 상품만 목록에서 쏙 빠지게 됩니다.
        setCart((prev) => prev.filter((item) => item.name !== name));
    };

    // [기능3] 수량 직접 수정 (새로 추가됨!)
    const updateQuantity = (name: string, newQuantity: number) => {
        // 수량이 1보다 작아지려고 하면 실행하지 않고 종료합니다.
        if (newQuantity < 1) return;

        setCart((prev) =>
            // map 함수로 배열을 돌면서 이름이 같은 상품을 찾습니다.
            prev.map((item) =>
                // 이름이 같으면 수량만 새 값으로 바꾸고, 다르면 원래대로 둡니다.
                item.name === name ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    return (
        // [중요] 새로 만든removeFromCart와 updateQuantity를 value에 꼭 넣어줘야 합니다!
        <CartContext.Provider value={{
            cart,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart error');
    return context;
};