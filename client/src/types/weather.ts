export type TObjectStringKey = {
  [key: string]: string;
};

type WeatherCategory =
  | "POP" //  강수확률
  | "PTY" //  강수형태
  | "PCP" //  1시간 강수량
  | "REH" //  습도
  | "SNO" //  1시간 신적설
  | "SKY" //  하늘상태
  | "TMP" //  1시간 기온
  | "TMN" //  일 최저기온
  | "TMX" //  일 최고기온
  | "UUU" //  풍속(동서성분)
  | "VVV" //  풍속(남북성분)
  | "WAV" //  파고
  | "VEC" //  풍향
  | "WSD" //  풍속
  | "RN1" //  1시간 강수량
  | "T1H"; //  기온 (초단기)

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

export type TNowWeather = {
  baseDate: string; // 발표 일자
  baseTime: string; // 발표 시각
  category: WeatherCategory; // 예보 코드
  nx: number; // 예보 지점 X값
  ny: number; // 예보 지점 Y값
  obsrValue: string; // 단기 예보 값
  fcstDate: string; // 예보 일자
  fcstTime: string; // 예보 시각
  fcstValue: string; // 예보 값
};

export type TWeekWeather = {
  regId: string; // 예보구역코드
  rnSt4Am: number; // 4일 후 오전 강수 확률
  rnSt4Pm: number; // 4일 후 오후 강수 확률
  rnSt5Am: number; // 5일 후 오전 강수 확률
  rnSt5Pm: number; // 5일 후 오후 강수 확률
  rnSt6Am: number; // 6일 후 오전 강수 확률
  rnSt6Pm: number; // 6일 후 오후 강수 확률
  rnSt7Am: number; // 7일 후 오전 강수 확률
  rnSt7Pm: number; // 7일 후 오후 강수 확률
  rnSt8: number; // 8일 후 강수 확률
  rnSt9: number; // 9일 후 강수 확률
  rnSt10: number; // 10일 후 강수 확률
  wf4Am: string; // 4일 후 오전 날씨예보
  wf4Pm: string; // 4일 후 오후 날씨예보
  wf5Am: string; // 5일 후 오전 날씨예보
  wf5Pm: string; // 5일 후 오후 날씨예보
  wf6Am: string; // 6일 후 오전 날씨예보
  wf6Pm: string; // 6일 후 오후 날씨예보
  wf7Am: string; // 7일 후 오전 날씨예보
  wf7Pm: string; // 7일 후 오후 날씨예보
  wf8: string; // 8일 후 날씨예보
  wf9: string; // 9일 후 날씨예보
  wf10: string; // 10일 후 날씨예보
};

export type TWeekTempDetail = {
  regId: string; // 예보구역코드 (예: "11D20501")
  taMin4: number; // 4일 후 예상최저기온(℃)
  taMin4Low: number; // 4일 후 예상최저기온 하한 범위
  taMin4High: number; // 4일 후 예상최저기온 상한 범위
  taMax4: number; // 4일 후 예상최고기온(℃)
  taMax4Low: number; // 4일 후 예상최고기온 하한 범위
  taMax4High: number; // 4일 후 예상최고기온 상한 범위
  taMin5: number; // 5일 후 예상최저기온(℃)
  taMin5Low: number; // 5일 후 예상최저기온 하한 범위
  taMin5High: number; // 5일 후 예상최저기온 상한 범위
  taMax5: number; // 5일 후 예상최고기온(℃)
  taMax5Low: number; // 5일 후 예상최고기온 하한 범위
  taMax5High: number; // 5일 후 예상최고기온 상한 범위
  taMin6: number; // 6일 후 예상최저기온(℃)
  taMin6Low: number; // 6일 후 예상최저기온 하한 범위
  taMin6High: number; // 6일 후 예상최저기온 상한 범위
  taMax6: number; // 6일 후 예상최고기온(℃)
  taMax6Low: number; // 6일 후 예상최고기온 하한 범위
  taMax6High: number; // 6일 후 예상최고기온 상한 범위
  taMin7: number; // 7일 후 예상최저기온(℃)
  taMin7Low: number; // 7일 후 예상최저기온 하한 범위
  taMin7High: number; // 7일 후 예상최저기온 상한 범위
  taMax7: number; // 7일 후 예상최고기온(℃)
  taMax7Low: number; // 7일 후 예상최고기온 하한 범위
  taMax7High: number; // 7일 후 예상최고기온 상한 범위
  taMin8: number; // 8일 후 예상최저기온(℃)
  taMin8Low: number; // 8일 후 예상최저기온 하한 범위
  taMin8High: number; // 8일 후 예상최저기온 상한 범위
  taMax8: number; // 8일 후 예상최고기온(℃)
  taMax8Low: number; // 8일 후 예상최고기온 하한 범위
  taMax8High: number; // 8일 후 예상최고기온 상한 범위
  taMin9: number; // 9일 후 예상최저기온(℃)
  taMin9Low: number; // 9일 후 예상최저기온 하한 범위
  taMin9High: number; // 9일 후 예상최저기온 상한 범위
  taMax9: number; // 9일 후 예상최고기온(℃)
  taMax9Low: number; // 9일 후 예상최고기온 하한 범위
  taMax9High: number; // 9일 후 예상최고기온 상한 범위
  taMin10: number; // 10일 후 예상최저기온(℃)
  taMin10Low: number; // 10일 후 예상최저기온 하한 범위
  taMin10High: number; // 10일 후 예상최저기온 상한 범위
  taMax10: number; // 10일 후 예상최고기온(℃)
  taMax10Low: number; // 10일 후 예상최고기온 하한 범위
  taMax10High: number; // 10일 후 예상최고기온 상한 범위
};

export type TCoord = {
  latitude: number;
  longitude: number;
};

export type TDayTemp = {
  min: string;
  max: string;
  amPop: string;
  pmPop: string;
  amWf: string;
  pmWf: string;
};

export type TWeekTemp = {
  [day: string]: TDayTemp;
};

type TWeatherItem = {
  TMP: string;
  UUU: string;
  VVV: string;
  VEC: string;
  WSD: string;
  SKY: string;
  PTY: string;
  POP: string;
  WAV: string;
  PCP: string;
  REH: string;
  SNO: string;
  TMN: string;
  TMX: string;
  [key: string]: string;
};

export type TWeatherForecast = Record<string, Record<string, TWeatherItem>>;
