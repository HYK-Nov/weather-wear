export type TWeekTemp = {
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
  | "WSD"
  | "RN1"
  | "T1H";

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