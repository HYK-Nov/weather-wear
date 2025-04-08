import request = require("request");

export const fetchWithRetry = (url:string, retries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attempt = (count:number) => {
      request.get(url, (err, res, body) => {
        const isJson = res?.headers["content-type"]?.includes("application/json");
        const isOk = res?.statusCode >= 200 && res?.statusCode < 300;

        console.log(JSON.parse(body));
        console.log(url);

        if (!err && isOk && isJson) {
          try {
            const data = JSON.parse(body).response?.body?.items?.item;
            // 이 안에서 구조까지 검증해줘
            if (!data) {
              throw new Error("API 응답 구조가 예상과 다릅니다");
            }
            return resolve(data);
          } catch (e:any) {
            console.error("❌ JSON 파싱 실패", e.message);
          }
        }

        // 실패 시 재시도
        if (count < retries) {
          console.warn(`⏳ 재시도 ${count + 1}/${retries}...`);
          setTimeout(() => attempt(count + 1), delay);
        } else {
          reject(err || new Error("최대 재시도 횟수 초과"));
        }
      });
    };

    attempt(0);
  });
}