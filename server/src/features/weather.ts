import request = require("request");
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {TNowWeather, TWeekTemp} from "../types/weather";
import {fetchWithRetry} from "./fetch";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const NOW = dayjs().tz("Asia/Seoul");
const RECENTLY_BASETIME = ["2300", "2000", "1700", "1400", "1100", "0800", "0500", "0200"];

// 초단기 예보 조회
export const fetchNowWeather = (retryCount = 1, nx: string, ny: string): Promise<any[]> => {
  const basetime = NOW
    .subtract(NOW.minute() > 30 ? 0 : 1, "hours")
    .format("HH30");

  return new Promise((resolve, reject) => {
    fetchWithRetry(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?numOfRows=60&base_time=${basetime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.format("YYYYMMDD")}`)
      .then((res:any) => {
        const filteredData = res.reduce((acc: any[], item: { category: any }) => {
          if (!acc.some(el => el.category === item.category)) {
            acc.push(item);
          }
          return acc;
        }, []);
        resolve(filteredData);
    })
      .catch((err) => {
        console.error(err);
        reject("Failed to process weather data");
      });
  });
};

// 단기 예보 조회 (1~3일)
export const fetchRecentlyTimeline = (retryCount = 1, nx: string, ny: string): Promise<any[]> => {
  let baseDate = NOW.format("YYYYMMDD");
  let baseTime = RECENTLY_BASETIME.find((time) => Number(time) <= Number(NOW.format("HHmm")));

// 2시 이전이라면 baseTime을 "2300"으로, baseDate를 전날로 변경
  if (!baseTime) {
    baseTime = "2300";
    baseDate = NOW.subtract(1, "day").format("YYYYMMDD");
  }

  console.log(baseTime, baseDate);

  return new Promise((resolve, reject) => {
    fetchWithRetry(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=490&base_time=${baseTime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${baseDate}`)
      .then((res:any) => {
        const data = res;
        const nowTime = NOW.format("HHmm");
        const todayDate = NOW.format("YYYYMMDD");

        // 날짜별 + 시간별 그룹화
        const groupedData = data.reduce((acc: any, item: any) => {
          const {fcstDate, fcstTime, category, fcstValue} = item;

          // 현재 날짜의 경우, 현재 시간보다 이전 데이터 제외
          if (fcstDate === todayDate && fcstTime < nowTime) return acc;

          // 시간에서 "00" 제거 (ex: "2000" → "20", "0300" → "3")
          const timeKey = String(Number(fcstTime.slice(0, 2)));

          if (!acc[fcstDate]) acc[fcstDate] = {};
          if (!acc[fcstDate][timeKey]) acc[fcstDate][timeKey] = {};

          acc[fcstDate][timeKey][category] = fcstValue;
          return acc;
        }, {});

        resolve(groupedData);
      })
      .catch((err) => {
        console.error(err);
        reject("Failed to process weather data");
      });
  });
};

// 단기 예보 조회 (최저, 최고 기온)
export const fetchNowTempMinMax = (retryCount = 1, nx: string, ny: string): Promise<{
  TMX: string | null;
  TMN: string | null
}> => {
  return new Promise((resolve, reject) => {
    fetchWithRetry(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=290&base_time=${NOW.hour() < 2 ? "23" : "02"}00&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.subtract(NOW.hour() < 2 ? 1 : 0, "days").format("YYYYMMDD")}`)
      .then((res: any) => {
        const data: TNowWeather[] = res;
        const firstTMX = data.find(item => item.fcstDate === NOW.format("YYYYMMDD") && item.category === "TMX");
        const firstTMN = data.find(item => item.fcstDate === NOW.format("YYYYMMDD") && item.category === "TMN");

        resolve({
          TMX: firstTMX ? firstTMX.fcstValue : null,
          TMN: firstTMN ? firstTMN.fcstValue : null
        });
      })
      .catch((err) => {
        console.error(err);
        reject("Failed to process weather data");
      });
  });
};

// 중기 예보 기온 조회 (1~3일)
export const fetchRecentlyTA = (retryCount = 1, nx: string, ny: string) => {
  return new Promise((resolve, reject) => {
    fetchWithRetry(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=944&base_time=${NOW.hour() < 2 ? "23" : "02"}00&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.subtract(NOW.hour() < 2 ? 1 : 0, "days").format("YYYYMMDD")}`)
      .then((res: any) => {
        const data: TNowWeather[] = res;

        // TMX, TMN, POP 데이터 필터링
        const filteredData = data.filter(
          (item) =>
            dayjs(item.fcstDate).diff(NOW, "day") >= 0 &&
            dayjs(item.fcstDate).diff(NOW, "day") < 4 &&
            (item.category === "TMX" || item.category === "TMN" || item.category === "POP" || item.category === "SKY" || (item.category === "PTY" && item.fcstValue != "0"))
        );

        // 날짜별 최저/최고 기온 및 강수확률 저장
        const weatherByTime = filteredData.reduce((acc, item) => {
          const index = dayjs(item.fcstDate).diff(dayjs(NOW.format("YYYY-MM-DD")), "day");
          const hour = Number(item.fcstTime.slice(0, 2));
          const isAm = hour < 12;
          const period = isAm ? "am" : "pm";

          if (!acc[index]) {
            acc[index] = {
              min: "0",
              max: "0",
              amPop: "0",
              pmPop: "0",
              amWf: "",
              pmWf: "",
              skyList: {am: [], pm: []},
              ptyList: {am: [], pm: []},
            };
          }

          const target = acc[index];

          switch (item.category) {
            case "TMX":
              target.max = item.fcstValue;
              break;
            case "TMN":
              target.min = item.fcstValue;
              break;
            case "POP":
              if (isAm) {
                target.amPop = Math.max(Number(target.amPop), Number(item.fcstValue)).toString();
              } else {
                target.pmPop = Math.max(Number(target.pmPop), Number(item.fcstValue)).toString();
              }
              break;
            case "SKY":
              target.skyList![period].push(item.fcstValue);
              break;
            case "PTY":
              target.ptyList![period].push(item.fcstValue);
              break;
          }

          return acc;
        }, {} as Record<number, {
          min: string;
          max: string;
          amPop: string;
          pmPop: string;
          amWf: string;
          pmWf: string;
          skyList?: { am: string[]; pm: string[] };
          ptyList?: { am: string[]; pm: string[] };
        }>);

        // ✅ reduce 바깥에서 날씨 텍스트 계산
        const getWorst = (list: string[]) => list.map(Number).sort((a, b) => b - a)[0]?.toString() ?? null;

        const getWeatherText = (sky: string | null, pty: string | null) => {
          if (pty && pty !== "0") {
            switch (pty) {
              case "1":
              case "4":
                return "비";
              case "2":
                return "비/눈";
              case "3":
                return "눈";
            }
          }

          if (sky) {
            switch (sky) {
              case "1":
                return "맑음";
              case "3":
                return "구름많음";
              case "4":
                return "흐림";
            }
          }

          return "";
        };

// ✅ 이제 처리된 데이터에 날씨 텍스트 붙이기
        for (const key in weatherByTime) {
          const item = weatherByTime[key];
          const amSky = getWorst(item.skyList!.am);
          const pmSky = getWorst(item.skyList!.pm);
          const amPty = getWorst(item.ptyList!.am);
          const pmPty = getWorst(item.ptyList!.pm);

          item.amWf = getWeatherText(amSky, amPty);
          item.pmWf = getWeatherText(pmSky, pmPty);

          delete item.skyList;
          delete item.ptyList;
        }

        resolve(weatherByTime);
      })
      .catch((err) => {
        console.error(err);
        reject("Failed to process weather data");
      });
  });
};

// 중기 예보 기온 조회 (4~10일)
export const fetchWeekTA = (retryCount = 1, regId: string) => {
  const tmFcTime = NOW
    .subtract(NOW.hour() > 6 ? 0 : 1, "days")
    .format(`YYYYMMDD0600`);

  return new Promise((resolve, reject) => {
    fetchWithRetry(`https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`)
      .then((res:any) =>{
        const data = res[0];
        const filteredData = Object.keys(data)
          .filter(key => (key.startsWith("taMax") || key.startsWith("taMin")) && !key.includes("Low") && !key.includes("High"))
          .reduce((obj, key) => {
            const dayIndex = key.match(/\d+/)?.[0]; // '5', '6', ... 숫자를 추출

            if (dayIndex) {
              if (!obj[dayIndex]) {
                obj[dayIndex] = {min: null, max: null};
              }
              if (key.startsWith("taMin")) {
                obj[dayIndex].min = data[key as keyof TWeekTemp]; // taMin 값을 min으로 추가
              } else if (key.startsWith("taMax")) {
                obj[dayIndex].max = data[key as keyof TWeekTemp]; // taMax 값을 max로 추가
              }
            }
            return obj;
          }, {} as Record<string, {
            min: string | null;
            max: string | null,
          }>);

        resolve(filteredData);
      })
      .catch((err:any) => {
        console.error(err);
        reject("Failed to process weather data");
      })
  });
};

// 중기 예보 강수 확률 조회 (4~10일)
export const fetchWeekPOP = (retryCount = 1, regId: string) => {
  const tmFcTime = NOW
    .subtract(NOW.hour() > 6 ? 0 : 1, "days")
    .format(`YYYYMMDD0600`);

  return new Promise((resolve, reject) => {
    fetchWithRetry(`http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`)
      .then((res:any) =>{
        const data = res[0];

        // rnSt(강수 확률)과 wf(날씨 상태) 키 필터링
        const filteredKeys = Object.keys(data).filter(
          (key) => key.startsWith("rnSt") || key.startsWith("wf")
        );

        const reducedData = filteredKeys.reduce((obj, key) => {
          const dayIndex = key.match(/\d+/)?.[0]; // '5', '6', ... 숫자를 추출

          if (dayIndex) {
            if (!obj[dayIndex]) {
              obj[dayIndex] = {amPop: "0", pmPop: "0", amWf: "", pmWf: ""}; // 기본값 설정
            }

            const value = data[key]?.toString() ?? "0"; // null이면 "0" 처리

            if (key.startsWith("rnSt")) {
              if (key.includes("Am")) {
                obj[dayIndex].amPop = value;
              } else if (key.includes("Pm")) {
                obj[dayIndex].pmPop = value;
              }
            } else if (key.startsWith("wf")) {
              if (key.includes("Am")) {
                obj[dayIndex].amWf = value;
              } else if (key.includes("Pm")) {
                obj[dayIndex].pmWf = value;
              }
            }
          }

          return obj;
        }, {} as Record<string, { amPop: string; pmPop: string; amWf: string; pmWf: string }>);

        resolve(reducedData);
      })
      .catch((err:any) => {
        console.error(err);
        reject("Failed to process weather data");
      });
  });
};