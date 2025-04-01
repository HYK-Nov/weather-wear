import { TCoord } from "@/types/weather.ts";

export const coordToDistrict = ({ longitude, latitude }: TCoord) =>
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
