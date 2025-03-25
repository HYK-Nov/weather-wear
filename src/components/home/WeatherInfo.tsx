import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useWeatherStore } from "@/stores/weatherStore.ts";
import { TbSunFilled } from "react-icons/tb";
import { SkyCode } from "@/types/weather.ts";
import { cn } from "@/lib/utils.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function WeatherInfo() {
  const [now, setNow] = useState(dayjs());
  const { setWeather, weather } = useWeatherStore();

  const baseTimes = [
    "0200",
    "0500",
    "0800",
    "1100",
    "1400",
    "1700",
    "2000",
    "2300",
  ];
  const currentHour = now.format("HH00");
  const closestBaseTime =
    [...baseTimes] // 원본 배열 복사
      .reverse() // 내림차순 정렬 (큰 시간부터 비교)
      .find((time) => time <= currentHour) || "0200"; // 조건 만족하는 가장 큰 값 찾기, 없으면 0200 사용

  const [tmpValue, setTmpValue] = useState("");
  const [skyValue, setSkyValue] = useState("");
  const [popValue, setPopValue] = useState("");

  useEffect(() => {
    setNow(dayjs());
    if (now) {
      fetch(
        `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?numOfRows=12&base_time=${closestBaseTime}&nx=58&ny=125&serviceKey=${import.meta.env.VITE_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${now.format("YYYYMMDD")}`,
        {
          method: "GET",
        },
      )
        .then((res) => res.json())
        .then((res) => res.response.body.items.item)
        .then((data) => {
          if (data) {
            setWeather(data);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (weather) {
      setTmpValue(weather[0].fcstValue);
      setSkyValue(
        SkyCode[weather.find((item) => item.category === "SKY")!.fcstValue],
      );
      setPopValue(weather[7].fcstValue);
    }
  }, [weather]);

  return (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-b p-5",
        "border",
        // "from-sky-300 to-rose-200",
      )}
    >
      <p className={"text-xl font-bold"}>현재 날씨</p>
      <div className={"flex items-center gap-4"}>
        <TbSunFilled className={"size-20 text-amber-400"} />
        <div className={"flex flex-col"}>
          {weather && (
            <>
              <p className={"text-4xl font-bold"}>{tmpValue}°</p>
              <p className={"text-lg"}>{skyValue}</p>
              <p className={"text-sm"}>
                강수확률:{" "}
                <span
                  className={`${Number(popValue) > 10 && "font-bold text-blue-500"}`}
                >
                  {popValue}%
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
