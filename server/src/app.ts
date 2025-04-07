import {TNowAir} from "./types/air";

require("dotenv").config();
import express = require("express");
import request = require("request");
import cors from "cors";
import {
  fetchNowTempMinMax,
  fetchNowWeather, fetchRecentlyTA, fetchRecentlyTimeline, fetchWeekPOP,
  fetchWeekTA,
} from "./features/weather";

const app = express();
app.use(cors());

// Express에서 들어오는 요청 체크
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.get("/weather/now", (req, res) => {
  const nx = req.query.nx?.toString();
  const ny = req.query.ny?.toString();

  Promise.all([fetchNowWeather(1, nx!, ny!), fetchNowTempMinMax(1, nx!, ny!)])
    .then(([nowData, tempData]) => {
      const mergedData = {now: nowData, temp: tempData};
      res.send(mergedData);
    })
    .catch(error => {
      console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    });
});

app.get("/weather/week", (req, res) => {
  const regId1 = req.query.regId1?.toString();
  const regId2 = req.query.regId2?.toString();
  const nx = req.query.nx?.toString();
  const ny = req.query.ny?.toString();

  Promise.all([fetchRecentlyTA(1, nx!, ny!), fetchWeekTA(1, regId1!), fetchWeekPOP(1, regId2!)]).then(([weather1, weather2, weather3]) => {
    const weather2Obj = weather2 as Record<string, any>;
    const weather3Obj = weather3 as Record<string, any>;

    const mergedWeather = Object.keys(weather2Obj).reduce((acc, key) => {
      const weather3 = weather3Obj[key];

      // weather3가 존재하고 amWf, pmWf 둘 다 유효한 경우에만 병합
      if (weather3?.amWf !== "" && weather3?.pmWf !== "") {
        acc[key] = {
          ...weather2Obj[key],
          ...weather3,
        };
      }

      return acc;
    }, {} as Record<string, any>);

    res.send(Object.assign({}, weather1, mergedWeather));
  }).catch((error) => {
    console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
  });
});

app.get("/weather/timeline", (req, res) => {
  const nx = req.query.nx?.toString();
  const ny = req.query.ny?.toString();

  try {
    Promise.all([fetchRecentlyTimeline(1, nx!, ny!)]).then(([result]) => {
      res.send(result);
    })
  }catch(error) {
    console.error(error);
  }
})

app.get("/air/now", (req, res) => {
  const sidoName = encodeURIComponent(req.query.sido?.toString() || "");
  const stationName = req.query.station?.toString().split(" ") || [];

  const fetchAirInfo = (retryCount = 1) => {
    request(`http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${process.env.WEATHER_SERVICE_KEY}&returnType=json&numOfRows=200&pageNo=1&sidoName=${sidoName}&ver=1.3`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);

        if (retryCount < 2) {
          return fetchAirInfo(retryCount + 1); // 재시도
        } else {
          return res.status(500).send({error: "Failed to fetch weather data"}); // 최종 실패 응답
        }
      }

      try {
        const data: TNowAir[] = JSON.parse(body).response.body.items;

        const filteredData = data.find((item) =>
          stationName.some((name) =>
            name.includes(item.stationName) || item.stationName.includes(name)
          )
        );

        res.send(filteredData);
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        res.status(500).send({error: "Failed to process weather data"});
      }
    });
  };

  if (sidoName) {
    fetchAirInfo();
  }
});

app.listen(3000, () => {
  console.log("서버 실행 중");
});