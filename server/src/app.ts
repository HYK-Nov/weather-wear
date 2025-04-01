require("dotenv").config();
import express = require("express");
import request = require("request");
import cors from "cors";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import {TWeekTemp} from "./types/weather";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

const app = express();
app.use(cors());

const NOW = dayjs();

app.get("/api/weather/now", (req, res) => {
  const nx = req.query.nx;
  const ny = req.query.ny;
  const basetime = NOW
    .subtract(NOW.minute() > 30 ? 0 : 1, "hours")
    .format("HH30");

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?numOfRows=60&base_time=${basetime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.format("YYYYMMDD")}`;

  const fetchWeather = (retryCount = 1) => {
    request(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);

        if (retryCount < 2) {
          return fetchWeather(retryCount + 1); // 재시도
        } else {
          return res.status(500).send({ error: "Failed to fetch weather data" }); // 최종 실패 응답
        }
      }

      try {
        const data = JSON.parse(body).response.body.items.item;
        const filteredData = data.reduce((acc: any[], item: { category: any }) => {
          if (!acc.some(el => el.category === item.category)) {
            acc.push(item);
          }
          return acc;
        }, []);

        res.send(filteredData);
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        res.status(500).send({ error: "Failed to process weather data" });
      }
    });
  };

  fetchWeather();
});

app.get("/api/weather/week/temp", (req, res) => {
  const regId = req.query.regId;

  const tmFcTime = NOW
    .subtract(NOW.hour() > 6 ? 0 : 1, "days")
    .format(`YYYYMMDD0600`);

  const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`;

  const fetchWeather = (retryCount = 1) => {
    request(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);

        if (retryCount < 2) {
          return fetchWeather(retryCount + 1); // 재시도
        } else {
          return res.status(500).send({error: "Failed to fetch weather data"}); // 최종 실패 응답
        }
      }

      try {
        const data =  JSON.parse(body).response.body.items.item[0];
        const filteredData = Object.keys(data)
          .filter(key => (key.startsWith("taMax") || key.startsWith("taMin")) && !key.includes("Low") && !key.includes("High"))
          .reduce((obj, key) => {
            const dayIndex = key.match(/\d+/)?.[0]; // '5', '6', ... 숫자를 추출

            if (dayIndex) {
              if (!obj[dayIndex]) {
                obj[dayIndex] = {min:0, max: 0};
              }
              if (key.startsWith('taMin')) {
                obj[dayIndex].min = data[key as keyof TWeekTemp]; // taMin 값을 min으로 추가
              } else if (key.startsWith('taMax')) {
                obj[dayIndex].max = data[key as keyof TWeekTemp]; // taMax 값을 max로 추가
              }
            }
            return obj;
          }, {} as Record<string, { min: number; max: number }>);

        res.send(filteredData);
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        res.status(500).send({error: "Failed to process weather data"});
      }
    });
  }

  if(regId){
    fetchWeather();
  }
});

app.listen(3000);