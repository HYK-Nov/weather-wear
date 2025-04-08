"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const request = require("request");
const cors_1 = __importDefault(require("cors"));
const weather_1 = require("./features/weather");
const app = express();
app.use((0, cors_1.default)());
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
// Express에서 들어오는 요청 체크
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});
app.get("/api/weather/now", (req, res) => {
    var _a, _b;
    const nx = (_a = req.query.nx) === null || _a === void 0 ? void 0 : _a.toString();
    const ny = (_b = req.query.ny) === null || _b === void 0 ? void 0 : _b.toString();
    /*if (!nx || !ny) {
      return res.status(400).send("nx, ny는 필수입니다.");
    }*/
    Promise.all([(0, weather_1.fetchNowWeather)(1, nx, ny), (0, weather_1.fetchNowTempMinMax)(1, nx, ny)])
        .then(([nowData, tempData]) => {
        const mergedData = { now: nowData, temp: tempData };
        res.send(mergedData);
    })
        .catch(error => {
        console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    });
});
app.get("/api/weather/week", (req, res) => {
    var _a, _b, _c, _d;
    const regId1 = (_a = req.query.regId1) === null || _a === void 0 ? void 0 : _a.toString();
    const regId2 = (_b = req.query.regId2) === null || _b === void 0 ? void 0 : _b.toString();
    const nx = (_c = req.query.nx) === null || _c === void 0 ? void 0 : _c.toString();
    const ny = (_d = req.query.ny) === null || _d === void 0 ? void 0 : _d.toString();
    /*if (!nx || !ny) {
      return res.status(400).send("nx, ny는 필수입니다.");
    }
  */
    Promise.all([(0, weather_1.fetchRecentlyTA)(1, nx, ny), (0, weather_1.fetchWeekTA)(1, regId1), (0, weather_1.fetchWeekPOP)(1, regId2)]).then(([weather1, weather2, weather3]) => {
        const weather2Obj = weather2;
        const weather3Obj = weather3;
        const mergedWeather = Object.keys(weather2Obj).reduce((acc, key) => {
            const weather3 = weather3Obj[key];
            // weather3가 존재하고 amWf, pmWf 둘 다 유효한 경우에만 병합
            if ((weather3 === null || weather3 === void 0 ? void 0 : weather3.amWf) !== "" && (weather3 === null || weather3 === void 0 ? void 0 : weather3.pmWf) !== "") {
                acc[key] = Object.assign(Object.assign({}, weather2Obj[key]), weather3);
            }
            return acc;
        }, {});
        res.send(Object.assign({}, weather1, mergedWeather));
    }).catch((error) => {
        console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    });
});
app.get("/api/weather/timeline", (req, res) => {
    var _a, _b;
    const nx = (_a = req.query.nx) === null || _a === void 0 ? void 0 : _a.toString();
    const ny = (_b = req.query.ny) === null || _b === void 0 ? void 0 : _b.toString();
    try {
        Promise.all([(0, weather_1.fetchRecentlyTimeline)(1, nx, ny)]).then(([result]) => {
            res.send(result);
        });
    }
    catch (error) {
        console.error(error);
    }
});
app.get("/api/air/now", (req, res) => {
    var _a, _b;
    const sidoName = encodeURIComponent(((_a = req.query.sido) === null || _a === void 0 ? void 0 : _a.toString()) || "");
    const stationName = ((_b = req.query.station) === null || _b === void 0 ? void 0 : _b.toString().split(" ")) || [];
    const fetchAirInfo = (retryCount = 1) => {
        request(`http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${process.env.WEATHER_SERVICE_KEY}&returnType=json&numOfRows=200&pageNo=1&sidoName=${sidoName}&ver=1.3`, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.error(`API 요청 실패 (${retryCount}/2)`, error || response.statusCode);
                if (retryCount < 2) {
                    return fetchAirInfo(retryCount + 1); // 재시도
                }
                else {
                    return res.status(500).send({ error: "Failed to fetch weather data" }); // 최종 실패 응답
                }
            }
            try {
                const data = JSON.parse(body).response.body.items;
                const filteredData = data.find((item) => stationName.some((name) => name.includes(item.stationName) || item.stationName.includes(name)));
                res.send(filteredData);
            }
            catch (e) {
                console.error("JSON 파싱 오류:", e);
                res.status(500).send({ error: "Failed to process weather data" });
            }
        });
    };
    if (sidoName) {
        fetchAirInfo();
    }
});
/*app.listen(3000, () => {
  console.log("서버 실행 중");
});*/
exports.default = app;
