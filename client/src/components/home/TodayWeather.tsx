import { useEffect, useState } from "react";
import { useLocationStore, useWeatherStore } from "@/stores/weatherStore.ts";
import { TbSunFilled } from "react-icons/tb";
import { SkyCode } from "@/types/weather.ts";
import { cn } from "@/lib/utils.ts";
import { getNxNy } from "@/features/excelToJson.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function TodayWeather() {
  const { weather, setWeather } = useWeatherStore();
  const { code } = useLocationStore();

  const [t1hValue, setT1hValue] = useState(""); // 기온
  const [skyValue, setSkyValue] = useState(""); // 하늘 상태
  const [ptyValue, setPtyValue] = useState(""); // 강수 형태

  useEffect(() => {
    const abortController = new AbortController();
    const fetchWeather = async () => {
      try {
        const res = await getNxNy(code);
        if (!res) return;

        const timeout = setTimeout(() => {
          abortController.abort(); // 5초 후 요청 취소
        }, 5000);

        const data = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/weather/now?nx=${res["격자 X"]}&ny=${res["격자 Y"]}`,
          { signal: abortController.signal },
        ).then((res) => res.json());

        clearTimeout(timeout); // 성공 시 타이머 해제

        if (data) {
          setWeather(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();

    return () => {
      abortController.abort(); // 컴포넌트 언마운트 시 요청 취소
    };
  }, [code]);

  useEffect(() => {
    if (weather) {
      setT1hValue(weather.find((item) => item.category == "T1H")!.fcstValue);
      setSkyValue(
        SkyCode[weather.find((item) => item.category === "SKY")!.fcstValue],
      );
      setPtyValue(weather.find((item) => item.category == "PTY")!.fcstValue);
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
      <p
        className={
          "inline rounded-full border px-2 py-1 text-sm text-neutral-500"
        }
      >{`${dayjs().format("MM.DD")} 기준`}</p>
      <div className={"flex items-center gap-4"}>
        <TbSunFilled className={"size-20 text-amber-400"} />
        <div className={"flex flex-col"}>
          {weather && (
            <>
              <p className={"text-4xl font-bold"}>{t1hValue}°</p>
              <p className={"text-lg"}>{skyValue}</p>
              <p className={"text-sm"}>
                강수확률:&nbsp;
                <span
                  className={`${Number(ptyValue) > 10 && "font-bold text-blue-500"}`}
                >
                  {ptyValue}%
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
