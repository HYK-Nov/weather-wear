# 웨더웨어

> 기온에 따라 옷차림 추천 해주는 웹

## 📌 프로젝트 개요
- **프로젝트명** : 웨더웨어
- **개발 기간** : 2025.03.31 ~ 2025.04.08
- **설명** : 

## 📄 발표 자료
> [구글 슬라이드](https://docs.google.com/presentation/d/11bKI_HxlgWyCRWru4UGNZstDGTGTbhhSuPeKHBLX3Gg/edit?usp=sharing)

> [사이트 링크](https://weather-wear-alpha.vercel.app/)

## 🌟 주요 기능
### 현재 날씨
![Image](https://github.com/user-attachments/assets/45720000-4f4e-4ddf-87fc-9f83a6cd5905)

현재 위치의 날씨 정보를 나타냅니다.

### 시간별 날씨
![Image](https://github.com/user-attachments/assets/6d9e3897-06cf-4d8c-9188-52eb1224266d)

현재 시간부터 36시간까지의 날씨 정보를 나타냅니다.

### 주간 날씨
![Image](https://github.com/user-attachments/assets/c848576c-7ca1-4b07-886e-48bad463ebf1)

일주일간의 날씨 정보를 나타냅니다.

### 옷 추천
![Image](https://github.com/user-attachments/assets/40afbb23-3849-43a9-8b5d-1a5af2b8375e)

현재 기온을 바탕으로 옷을 추천해줍니다.

### 캘린더
![Image](https://github.com/user-attachments/assets/2f73a9a9-5697-4562-9750-cda3c124ef34)

캘린더에 당일부터 일주일간의 날씨 정보를 나타냅니다.

### 일정 추가
|![Image](https://github.com/user-attachments/assets/fca6a874-ba1b-4a49-91d3-4eab1dad9008)|![Image](https://github.com/user-attachments/assets/a51cba10-a9f4-438a-b986-a8afc217a117)|
|---|---|

캘린더에 일정을 추가할 수 있습니다.

### express
|![Image](https://github.com/user-attachments/assets/df4fc2e4-6218-4b85-ba72-0e79203c77a3)|![Image](https://github.com/user-attachments/assets/0eaa0438-f5a9-4599-a81e-63cc4034ee90)|
|---|---|

데이터 전처리, OpenAPI Key 정보 은닉을 위해 express를 사용하였습니다.

## 🛠️ 기술 스택

### API
> [[ 기상청 단기예보 ]](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084)
> 
> [[ 기상청 중기예보 ]](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15059468)
> 
> [[ 에어코리아 대기오염정보 ]](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073861)
> 
> [[ 카카오 좌표 ➡️ 행정구역정보로 변환 ]](https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-district)

### 💻 프론트엔드
<p>
<img  src="https://img.shields.io/badge/React-ffffff?logo=react"/>
<img  src="https://img.shields.io/badge/Vite-ffffff?logo=vite"/>
<img  src="https://img.shields.io/badge/TypeScript-ffffff?logo=typescript"/>
<img  src="https://img.shields.io/badge/React Router-ffffff?logo=reactrouter"/>
<img  src="https://img.shields.io/badge/Zustand-ffffff?logo=zustand"/>
</p>

### 백엔드
<img  src="https://img.shields.io/badge/Express-000000?logo=express"/>

### 라이브러리
<p>
<img  src="https://img.shields.io/badge/Day.js-ffffff"/>
<img  src="https://img.shields.io/badge/FullCalendar-ffffff"/>
<img  src="https://img.shields.io/badge/react icons-ffffff"/>
<img  src="https://img.shields.io/badge/xlsx-ffffff"/>
</p>

### 🎨 스타일링
<p>
<img  src="https://img.shields.io/badge/Tailwind Css-ffffff?logo=tailwindcss"/>
<img  src="https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui"/>
</p>

### 🚀 배포
<img  src="https://img.shields.io/badge/Vercel-000000?logo=vercel"/>