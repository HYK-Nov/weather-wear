"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithRetry = void 0;
const request = require("request");
const fetchWithRetry = (url, retries = 3, delay = 1000) => {
    return new Promise((resolve, reject) => {
        const attempt = (count) => {
            request.get(url, (err, res, body) => {
                var _a, _b, _c, _d;
                const isJson = (_a = res === null || res === void 0 ? void 0 : res.headers["content-type"]) === null || _a === void 0 ? void 0 : _a.includes("application/json");
                const isOk = (res === null || res === void 0 ? void 0 : res.statusCode) >= 200 && (res === null || res === void 0 ? void 0 : res.statusCode) < 300;
                if (!err && isOk && isJson) {
                    try {
                        const data = (_d = (_c = (_b = JSON.parse(body).response) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.item;
                        // 이 안에서 구조까지 검증해줘
                        if (!data) {
                            throw new Error("API 응답 구조가 예상과 다릅니다");
                        }
                        return resolve(data);
                    }
                    catch (e) {
                        console.error("❌ JSON 파싱 실패", e.message);
                    }
                }
                // 실패 시 재시도
                if (count < retries) {
                    console.warn(`⏳ 재시도 ${count + 1}/${retries}...`);
                    setTimeout(() => attempt(count + 1), delay);
                }
                else {
                    reject(err || new Error("최대 재시도 횟수 초과"));
                }
            });
        };
        attempt(0);
    });
};
exports.fetchWithRetry = fetchWithRetry;
