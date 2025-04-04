import request = require("request");
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import {TNowWeather, TWeekTemp} from "../types/weather";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

const NOW = dayjs();
const RECENTLY_BASETIME  = ["2300", "2000", "1700", "1400", "1100", "0800", "0500", "0200"];

// 초단기 예보 조회
export const fetchNowWeather = (retryCount = 1, nx: string, ny: string): Promise<any[]> => {
  const basetime = NOW
    .subtract(NOW.minute() > 30 ? 0 : 1, "hours")
    .format("HH30");

  return new Promise((resolve, reject) => {
    request(
      `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?numOfRows=60&base_time=${basetime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.format("YYYYMMDD")}`,
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
          if (retryCount < 2) return resolve(fetchNowWeather(retryCount + 1, nx, ny)); // 재시도
          return reject("Failed to fetch weather data");
        }

        try {
          const data = JSON.parse(body).response.body.items.item;
          const filteredData = data.reduce((acc: any[], item: { category: any }) => {
            if (!acc.some(el => el.category === item.category)) {
              acc.push(item);
            }
            return acc;
          }, []);
          resolve(filteredData);
        } catch (e) {
          console.error("JSON 파싱 오류:", e);
          reject("Failed to process weather data");
        }
      }
    );
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

  return new Promise((resolve, reject) => {
    request(
      `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=336&base_time=${baseTime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&dataType=JSON&base_date=${baseDate}`,
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
          if (retryCount < 2) return resolve(fetchNowWeather(retryCount + 1, nx, ny)); // 재시도
          return reject("Failed to fetch weather data");
        }

        try {
          const data = JSON.parse(body).response.body.items.item;
          const nowTime = NOW.format("HHmm");
          const todayDate = NOW.format("YYYYMMDD");

          // 날짜별 + 시간별 그룹화
          const groupedData = data.reduce((acc: any, item: any) => {
            const { fcstDate, fcstTime, category, fcstValue } = item;

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
        } catch (e) {
          console.error("JSON 파싱 오류:", e);
          reject("Failed to process weather data");
        }
      }
    )
  });
};

// 단기 예보 조회 (최저, 최고 기온)
export const fetchNowTempMinMax = (retryCount = 1, nx: string, ny: string): Promise<{
  TMX: string | null;
  TMN: string | null
}> => {
  return new Promise((resolve, reject) => {
    request(
      `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=290&base_time=${NOW.hour() < 2 ? "23" : "02"}00&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.subtract(NOW.hour() < 2 ? 1 : 0, "days").format("YYYYMMDD")}`,
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
          if (retryCount < 2) return resolve(fetchNowTempMinMax(retryCount + 1, nx, ny)); // 재시도
          return reject("Failed to fetch weather data");
        }

        try {
          const data: TNowWeather[] = JSON.parse(body).response.body.items.item;
          const firstTMX = data.find(item => item.fcstDate === NOW.format("YYYYMMDD") && item.category === "TMX");
          const firstTMN = data.find(item => item.fcstDate === NOW.format("YYYYMMDD") && item.category === "TMN");

          resolve({
            TMX: firstTMX ? firstTMX.fcstValue : null,
            TMN: firstTMN ? firstTMN.fcstValue : null
          });
        } catch (e) {
          console.error("JSON 파싱 오류:", e);
          reject("Failed to process weather data");
        }
      }
    );
  });
};

// 중기 예보 기온 조회 (1~3일)
export const fetchRecentlyTA = (retryCount = 1, nx: string, ny: string) => {
  return new Promise((resolve, reject) => {
    request(
      `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=944&base_time=${NOW.hour() < 2 ? "23" : "02"}00&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.subtract(NOW.hour() < 2 ? 1 : 0, "days").format("YYYYMMDD")}`,
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
          if (retryCount < 2) return resolve(fetchNowTempMinMax(retryCount + 1, nx, ny)); // 재시도
          return reject("Failed to fetch weather data");
        }

        try {
          const data: TNowWeather[] = JSON.parse(body).response.body.items.item;

          // TMX, TMN, POP 데이터 필터링
          const filteredData = data.filter(
            (item) =>
              dayjs(item.fcstDate).diff(NOW, "day") >= 0 &&
              dayjs(item.fcstDate).diff(NOW, "day") < 4 &&
              (item.category === "TMX" || item.category === "TMN" || item.category === "POP")
          );

          // 날짜별 최저/최고 기온 및 강수확률 저장
          const reducedData = filteredData.reduce((acc, item) => {
            const index = dayjs(item.fcstDate).diff(dayjs(NOW.format("YYYY-MM-DD")), "day");

            if (!acc[index]) {
              acc[index] = {min: "0", max: "0", amPop: "0", pmPop: "0"};
            }

            if (item.category === "TMX") {
              acc[index].max = item.fcstValue;
            } else if (item.category === "TMN") {
              acc[index].min = item.fcstValue;
            } else if (item.category === "POP") {
              const hour = Number(item.fcstTime.slice(0, 2));
              if (hour < 12) {
                acc[index].amPop = Math.max(Number(acc[index].amPop), Number(item.fcstValue)).toString();
              } else {
                acc[index].pmPop = Math.max(Number(acc[index].pmPop), Number(item.fcstValue)).toString();
              }
            }

            return acc;
          }, {} as Record<number, { min: string; max: string; amPop: string; pmPop: string }>);

          resolve(reducedData);
        } catch (e) {
          console.error("JSON 파싱 오류:", e);
          reject("Failed to process weather data");
        }
      }
    );
  });
};

// 중기 예보 기온 조회 (4~10일)
export const fetchWeekTA = (retryCount = 1, regId: string) => {
  const tmFcTime = NOW
    .subtract(NOW.hour() > 6 ? 0 : 1, "days")
    .format(`YYYYMMDD0600`);

  return new Promise((resolve, reject) => {
    request(`https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
        if (retryCount < 2) return resolve(fetchWeekTA(retryCount + 1, regId)); // 재시도
        return reject("Failed to fetch weather data");
      }

      try {
        const data = JSON.parse(body).response.body.items.item[0];
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
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        reject("Failed to process weather data");
      }
    });
  });
};

// 중기 예보 강수 확률 조회 (4~10일)
export const fetchWeekPOP = (retryCount = 1, regId: string) => {
  const tmFcTime = NOW
    .subtract(NOW.hour() > 6 ? 0 : 1, "days")
    .format(`YYYYMMDD0600`);

  return new Promise((resolve, reject) => {
    request(`http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
        if (retryCount < 2) return resolve(fetchWeekTA(retryCount + 1, regId)); // 재시도
        return reject("Failed to fetch weather data");
      }

      try {
        const data = JSON.parse(body).response.body.items.item[0];

        // rnSt(강수 확률)과 wf(날씨 상태) 키 필터링
        const filteredKeys = Object.keys(data).filter(
          (key) => key.startsWith("rnSt") || key.startsWith("wf")
        );

        const reducedData = filteredKeys.reduce((obj, key) => {
          const dayIndex = key.match(/\d+/)?.[0]; // '5', '6', ... 숫자를 추출

          if (dayIndex) {
            if (!obj[dayIndex]) {
              obj[dayIndex] = { amPop: "0", pmPop: "0", amWf: "", pmWf: "" }; // 기본값 설정
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
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        reject("Failed to process weather data");
      }
    });
  });
};