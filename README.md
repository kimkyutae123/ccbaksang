# 🛒 공동구매 중개 플랫폼 (Joint Purchase Platform)

> **"함께 살수록 더 저렴하게"** > 사용자의 참여로 가격 혜택을 만드는 실시간 달성률 기반 공동구매 웹 서비스입니다.

---

## 🚀 배포 주소
- **Vercel 배포 링크**: [(https://ccbaksang.vercel.app/)]

---

## 🛠 Tech Stack (기술 스택)

### **Frontend**
* **Framework**: **Next.js 15 (App Router)** - 서버/클라이언트 컴포넌트 최적화 분리 및 최신 비동기 라우팅 적용
* **Language**: **TypeScript** - 인터페이스 기반의 엄격한 타입 정의로 런타임 에러 방지
* **Styling**: **Tailwind CSS** - 모바일 퍼스트 디자인 및 반응형 UI 구현
* **State Management**: **React Context API** - 전역 장바구니 데이터 및 실시간 결제 금액 관리

### **Infrastructure**
* **Deployment**: **Vercel** - CI/CD 파이프라인 구축 및 자동 배포
* **Version Control**: **Git & GitHub** - 브랜치 전략 기반의 버전 관리

---

## ✨ Key Features (핵심 기능)

### **1. 모바일 최적화 반응형 2열 그리드**
* 쇼핑몰 앱 표준에 맞춘 **2열 격자 레이아웃**으로 모바일 환경에서 정보 노출 극대화
* `grid-cols-2`와 `aspect-square`를 활용한 정돈된 상품 리스트 UI

### **2. 실시간 공동구매 진행률 시각화**
* `current / limit` 데이터를 계산하여 **실시간 프로그레스 바(Progress Bar)** 구현
* 인원 달성률에 따른 동적 텍스트 및 **'품절' 상태 자동 전환** 로직 적용

### **3. Next.js 15 기반 동적 상세 페이지**
* 비동기 `params` 처리를 위해 `React.use()` 훅을 도입한 최신 배포 규격 준수
* **상품정보 / 후기 / 문의** 탭 시스템을 통한 깔끔한 정보 분리 및 부드러운 전환

### **4. 장바구니 및 정밀 결제 시스템**
* 전역 상태 관리를 통해 여러 페이지에 걸친 데이터 무결성 유지
* 상품별 단가와 수량을 합산하여 실시간 총 결제 금액을 산출하는 **주문/결제 프로세스** 구축

---

## 💡 Troubleshooting (문제 해결 사례)

### **서버/클라이언트 컴포넌트의 역할 분리**
* **문제**: 서버 컴포넌트에서 클릭 이벤트 및 `useState`가 작동하지 않아 탭 전환 불가 현상 발생.
* **해결**: `'use client'` 지시어를 선언하여 브라우저 인터랙션을 담당하는 클라이언트 영역을 명확히 분리함으로써 해결.

### **Next.js 15 비동기 Params 처리**
* **문제**: 프레임워크 업데이트로 인해 `params`에 직접 접근 시 발생하는 런타임 오류 경험.
* **해결**: `params`가 Promise로 변경된 최신 사양에 맞춰 `await` 혹은 `use()`를 통해 데이터를 안전하게 해제(Unwrap)하도록 수정.

---

## 📂 Project Structure
```text
src/
 ├── app/
 │    ├── cart/          # 장바구니 페이지
 │    ├── order/         # 주문 및 결제 페이지
 │    ├── product/[id]/  # 동적 상품 상세 페이지 (탭 시스템 포함)
 │    └── context/       # CartContext (전역 상태 관리)
 ├── components/         # ProductAction, CartBadge 등 공통 컴포넌트
 └── public/             # 상품 상세 이미지 및 정적 파일
