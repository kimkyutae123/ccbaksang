'use client';

import { useRef, useState } from 'react';

export default function DraggableScroll({ children }: { children: React.ReactNode }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDown(true);
        // 드래그 시작 시 스크롤 애니메이션을 잠시 끕니다 (반응 속도를 위해)
        scrollRef.current.style.scrollBehavior = 'auto';
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => setIsDown(false);
    const onMouseUp = () => {
        setIsDown(false);
        if (!scrollRef.current) return;
        // 드래그가 끝나면 다시 부드러운 스크롤을 켭니다
        scrollRef.current.style.scrollBehavior = 'smooth';
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;

        // [포인트 1] 곱하는 숫자(2.5)를 조절해서 '손맛'을 맞추세요.
        // 숫자가 높을수록 마우스 움직임보다 더 많이 밀립니다.
        const walk = (x - startX) * 2.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            // [포인트 2] snap 기능을 쓰면 카드가 자석처럼 착착 붙어서 더 자연스러워집니다.
            className="flex gap-4 overflow-x-auto no-scrollbar pb-2 cursor-default select-none scroll-smooth snap-x snap-mandatory"
        >
            {children}
        </div>
    );
}