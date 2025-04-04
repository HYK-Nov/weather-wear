import { TCoord } from "@/types/weather.ts";

export const district = ({ longitude, latitude }: TCoord) =>
  fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => data.documents[1]);

const SIDO_NAME = [
  "전국",
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "세종",
];

export const getSidoName = (region: string) => {
  if (!region) return;

  const trimRegion = region
    .replace(/특별|광역|도|시|자치|청|라|상/g, "")
    .trim();

  return SIDO_NAME.find((item) => trimRegion.includes(item));
};
