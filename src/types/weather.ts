export type TObjectStringKey = {
  [key: string]: string;
};

type WeatherCategory =
  | "POP"
  | "PTY"
  | "PCP"
  | "REH"
  | "SNO"
  | "SKY"
  | "TMP"
  | "TMN"
  | "TMX"
  | "UUU"
  | "VVV"
  | "WAV"
  | "VEC"
  | "WSD";

// 하늘 상태 코드
export const SkyCode: TObjectStringKey = {
  "1": "맑음",
  "3": "구름 많음",
  "4": "흐림",
} as const;

// 강수 형태 코드
export const PtyCode: TObjectStringKey = {
  "0": "없음",
  "1": "비",
  "2": "눈비",
  "3": "눈",
  "4": "소나기",
  "5": "빗방울",
  "6": "눈/비날림",
  "7": "눈날림",
} as const;

export type TWeather = {
  baseDate: string; // 발표 일자
  baseTime: string; // 발표 시각
  category: WeatherCategory; // 예보 코드
  fcstDate: string; // 예보 일자
  fcstTime: string; // 예보 시각
  fcstValue: string; // 예보 값
  nx: number; // 예보 지점 X값
  ny: number; // 예보 지점 Y값
};
