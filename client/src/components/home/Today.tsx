import { useEffect, useState } from "react";
import { useLocationStore, useWeatherStore } from "@/stores/weatherStore.ts";
import { PtyCode, SkyCode, TNowWeather } from "@/types/weather.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { getNxNy } from "@/features/apiCode.ts";
import { getAprTemp } from "@/features/weather.ts";
import AnotherInfo from "@/components/home/Today/AnotherInfo.tsx";
import { cn } from "@/lib/utils.ts";
import WeatherIcon from "@/components/common/WeatherIcon.tsx";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function Today() {
  const { setAprTemp } = useWeatherStore();
  const { code } = useLocationStore();
  const [weatherInfo, setWeatherInfo] = useState({
    ta: "", // 기온
    sky: "", // 하늘 상태
    pty: "", // 강수 형태
    ws: 0, // 풍속
    wd: "", // 풍향
    hm: "", // 습도
    aprTemp: 0, // 체감온도
    tmn: 0, // 최저 기온
    tmx: 0, // 최고 기온
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getNxNy(code);
        if (!res) return;

        const data = await fetch(
          `/weather/now?nx=${res["격자 X"]}&ny=${res["격자 Y"]}`,
          { method: "GET" },
        )
          .then((res) => res.json())
          .catch((err) => console.error(err));

        if (data) {
          setWeatherInfo((prev) => ({
            ...prev,
            // 기온
            ta: data.now.find((item: TNowWeather) => item.category == "T1H")!
              .fcstValue,
            // 하늘 상태
            sky: SkyCode[
              data.now.find((item: TNowWeather) => item.category === "SKY")!
                .fcstValue
            ],
            // 강수 형태
            pty: PtyCode[
              data.now.find((item: TNowWeather) => item.category === "PTY")!
                .fcstValue
            ],
            // 습도
            hm: data.now.find((item: TNowWeather) => item.category == "REH")!
              .fcstValue,
            // 최저 기온
            tmn: data.temp.TMN,
            // 최고 기온
            tmx: data.temp.TMX,
          }));

          // 풍속
          const uuu = data.now.find(
            (item: TNowWeather) => item.category == "UUU",
          )!.fcstValue;
          const vvv = data.now.find(
            (item: TNowWeather) => item.category === "VVV",
          )!.fcstValue;
          setWeatherInfo((prev) => ({
            ...prev,
            ws: Math.sqrt(uuu ** 2 + vvv ** 2),
          }));

          // 풍향
          const directions = [
            "북",
            "북동",
            "동",
            "남동",
            "남",
            "남서",
            "서",
            "북서",
          ];
          const vec = data.now.find(
            (item: TNowWeather) => item.category == "WSD",
          )!.fcstValue;
          setWeatherInfo((prev) => ({
            ...prev,
            wd: directions[Math.round(vec / 45) % 8],
          }));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [code]);

  // 체감 온도
  useEffect(() => {
    if (weatherInfo.ta && weatherInfo.ws && weatherInfo.hm) {
      const temp = getAprTemp(
        Number(weatherInfo.ta),
        Number(weatherInfo.ws),
        Number(weatherInfo.hm),
      );
      setWeatherInfo((prev) => ({
        ...prev,
        aprTemp: temp,
      }));
      setAprTemp(temp);
    }
  }, [weatherInfo.ta, weatherInfo.ws, weatherInfo.hm]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 justify-between gap-5 p-7 lg:grid-cols-3",
      )}
    >
      {weatherInfo.ta && (
        <>
          <div className={"flex gap-3 lg:col-span-1"}>
            {/* 현재 기온 */}
            <div className={"flex items-center gap-2"}>
              <WeatherIcon
                state={
                  weatherInfo.pty !== "없음" ? weatherInfo.pty : weatherInfo.sky
                }
                size={"lg"}
              />
              <p className={"text-6xl font-bold"}>{weatherInfo.ta}°</p>
            </div>
            {/* 최저, 최고 기온 */}
            <div className={"flex items-center gap-3"}>
              <p className={"text-lg font-bold"}>
                {weatherInfo.pty !== "없음" ? weatherInfo.pty : weatherInfo.sky}
              </p>
              <div className={"flex flex-col"}>
                <p>
                  최고&nbsp;
                  <span className={"text-xl font-bold text-rose-500"}>
                    {Math.floor(weatherInfo.tmx as number)}°
                  </span>
                </p>
                <p>
                  최저&nbsp;
                  <span className={"text-xl font-bold text-blue-500"}>
                    {Math.floor(weatherInfo.tmn as number)}°
                  </span>
                </p>
              </div>
            </div>
          </div>
          <AnotherInfo
            hm={weatherInfo.hm}
            aprTemp={weatherInfo.aprTemp}
            wd={weatherInfo.wd}
            ws={weatherInfo.ws}
          />
        </>
      )}
    </div>
  );
}
