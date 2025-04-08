"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWeekPOP = exports.fetchWeekTA = exports.fetchRecentlyTA = exports.fetchNowTempMinMax = exports.fetchRecentlyTimeline = exports.fetchNowWeather = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/ko.js");
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
const fetch_1 = require("./fetch");
dayjs_1.default.locale("ko");
dayjs_1.default.extend(localizedFormat_1.default);
const NOW = (0, dayjs_1.default)();
const RECENTLY_BASETIME = ["2300", "2000", "1700", "1400", "1100", "0800", "0500", "0200"];
// 초단기 예보 조회
const fetchNowWeather = (retryCount = 1, nx, ny) => {
    const basetime = NOW
        .subtract(NOW.minute() > 30 ? 0 : 1, "hours")
        .format("HH30");
    return new Promise((resolve, reject) => {
        (0, fetch_1.fetchWithRetry)(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?numOfRows=60&base_time=${basetime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.format("YYYYMMDD")}`)
            .then((res) => {
            const filteredData = res.reduce((acc, item) => {
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
exports.fetchNowWeather = fetchNowWeather;
// 단기 예보 조회 (1~3일)
const fetchRecentlyTimeline = (retryCount = 1, nx, ny) => {
    let baseDate = NOW.format("YYYYMMDD");
    let baseTime = RECENTLY_BASETIME.find((time) => Number(time) <= Number(NOW.format("HHmm")));
    // 2시 이전이라면 baseTime을 "2300"으로, baseDate를 전날로 변경
    if (!baseTime) {
        baseTime = "2300";
        baseDate = NOW.subtract(1, "day").format("YYYYMMDD");
    }
    return new Promise((resolve, reject) => {
        (0, fetch_1.fetchWithRetry)(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=490&base_time=${baseTime}&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${baseDate}`)
            .then((res) => {
            const data = res;
            const nowTime = NOW.format("HHmm");
            const todayDate = NOW.format("YYYYMMDD");
            // 날짜별 + 시간별 그룹화
            const groupedData = data.reduce((acc, item) => {
                const { fcstDate, fcstTime, category, fcstValue } = item;
                // 현재 날짜의 경우, 현재 시간보다 이전 데이터 제외
                if (fcstDate === todayDate && fcstTime < nowTime)
                    return acc;
                // 시간에서 "00" 제거 (ex: "2000" → "20", "0300" → "3")
                const timeKey = String(Number(fcstTime.slice(0, 2)));
                if (!acc[fcstDate])
                    acc[fcstDate] = {};
                if (!acc[fcstDate][timeKey])
                    acc[fcstDate][timeKey] = {};
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
exports.fetchRecentlyTimeline = fetchRecentlyTimeline;
// 단기 예보 조회 (최저, 최고 기온)
const fetchNowTempMinMax = (retryCount = 1, nx, ny) => {
    return new Promise((resolve, reject) => {
        (0, fetch_1.fetchWithRetry)(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=290&base_time=${NOW.hour() < 2 ? "23" : "02"}00&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.subtract(NOW.hour() < 2 ? 1 : 0, "days").format("YYYYMMDD")}`)
            .then((res) => {
            const data = res;
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
exports.fetchNowTempMinMax = fetchNowTempMinMax;
// 중기 예보 기온 조회 (1~3일)
const fetchRecentlyTA = (retryCount = 1, nx, ny) => {
    return new Promise((resolve, reject) => {
        (0, fetch_1.fetchWithRetry)(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=944&base_time=${NOW.hour() < 2 ? "23" : "02"}00&nx=${nx}&ny=${ny}&serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${NOW.subtract(NOW.hour() < 2 ? 1 : 0, "days").format("YYYYMMDD")}`)
            .then((res) => {
            const data = res;
            // TMX, TMN, POP 데이터 필터링
            const filteredData = data.filter((item) => (0, dayjs_1.default)(item.fcstDate).diff(NOW, "day") >= 0 &&
                (0, dayjs_1.default)(item.fcstDate).diff(NOW, "day") < 4 &&
                (item.category === "TMX" || item.category === "TMN" || item.category === "POP" || item.category === "SKY" || (item.category === "PTY" && item.fcstValue != "0")));
            // 날짜별 최저/최고 기온 및 강수확률 저장
            const weatherByTime = filteredData.reduce((acc, item) => {
                const index = (0, dayjs_1.default)(item.fcstDate).diff((0, dayjs_1.default)(NOW.format("YYYY-MM-DD")), "day");
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
                        skyList: { am: [], pm: [] },
                        ptyList: { am: [], pm: [] },
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
                        }
                        else {
                            target.pmPop = Math.max(Number(target.pmPop), Number(item.fcstValue)).toString();
                        }
                        break;
                    case "SKY":
                        target.skyList[period].push(item.fcstValue);
                        break;
                    case "PTY":
                        target.ptyList[period].push(item.fcstValue);
                        break;
                }
                return acc;
            }, {});
            // ✅ reduce 바깥에서 날씨 텍스트 계산
            const getWorst = (list) => { var _a, _b; return (_b = (_a = list.map(Number).sort((a, b) => b - a)[0]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null; };
            const getWeatherText = (sky, pty) => {
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
                const amSky = getWorst(item.skyList.am);
                const pmSky = getWorst(item.skyList.pm);
                const amPty = getWorst(item.ptyList.am);
                const pmPty = getWorst(item.ptyList.pm);
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
exports.fetchRecentlyTA = fetchRecentlyTA;
// 중기 예보 기온 조회 (4~10일)
const fetchWeekTA = (retryCount = 1, regId) => {
    const tmFcTime = NOW
        .subtract(NOW.hour() > 6 ? 0 : 1, "days")
        .format(`YYYYMMDD0600`);
    return new Promise((resolve, reject) => {
        (0, fetch_1.fetchWithRetry)(`https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`)
            .then((res) => {
            const data = res[0];
            const filteredData = Object.keys(data)
                .filter(key => (key.startsWith("taMax") || key.startsWith("taMin")) && !key.includes("Low") && !key.includes("High"))
                .reduce((obj, key) => {
                var _a;
                const dayIndex = (_a = key.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]; // '5', '6', ... 숫자를 추출
                if (dayIndex) {
                    if (!obj[dayIndex]) {
                        obj[dayIndex] = { min: null, max: null };
                    }
                    if (key.startsWith("taMin")) {
                        obj[dayIndex].min = data[key]; // taMin 값을 min으로 추가
                    }
                    else if (key.startsWith("taMax")) {
                        obj[dayIndex].max = data[key]; // taMax 값을 max로 추가
                    }
                }
                return obj;
            }, {});
            resolve(filteredData);
        })
            .catch((err) => {
            console.error(err);
            reject("Failed to process weather data");
        });
    });
};
exports.fetchWeekTA = fetchWeekTA;
// 중기 예보 강수 확률 조회 (4~10일)
const fetchWeekPOP = (retryCount = 1, regId) => {
    const tmFcTime = NOW
        .subtract(NOW.hour() > 6 ? 0 : 1, "days")
        .format(`YYYYMMDD0600`);
    return new Promise((resolve, reject) => {
        (0, fetch_1.fetchWithRetry)(`http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${process.env.WEATHER_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${regId}&tmFc=${tmFcTime}`)
            .then((res) => {
            const data = res[0];
            // rnSt(강수 확률)과 wf(날씨 상태) 키 필터링
            const filteredKeys = Object.keys(data).filter((key) => key.startsWith("rnSt") || key.startsWith("wf"));
            const reducedData = filteredKeys.reduce((obj, key) => {
                var _a, _b, _c;
                const dayIndex = (_a = key.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]; // '5', '6', ... 숫자를 추출
                if (dayIndex) {
                    if (!obj[dayIndex]) {
                        obj[dayIndex] = { amPop: "0", pmPop: "0", amWf: "", pmWf: "" }; // 기본값 설정
                    }
                    const value = (_c = (_b = data[key]) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "0"; // null이면 "0" 처리
                    if (key.startsWith("rnSt")) {
                        if (key.includes("Am")) {
                            obj[dayIndex].amPop = value;
                        }
                        else if (key.includes("Pm")) {
                            obj[dayIndex].pmPop = value;
                        }
                    }
                    else if (key.startsWith("wf")) {
                        if (key.includes("Am")) {
                            obj[dayIndex].amWf = value;
                        }
                        else if (key.includes("Pm")) {
                            obj[dayIndex].pmWf = value;
                        }
                    }
                }
                return obj;
            }, {});
            resolve(reducedData);
        })
            .catch((err) => {
            console.error(err);
            reject("Failed to process weather data");
        });
    });
};
exports.fetchWeekPOP = fetchWeekPOP;
