import { useEffect, useState } from "react";
import { useLocationStore, useWeatherStore } from "@/stores/weatherStore.ts";
import { TbSunFilled } from "react-icons/tb";
import { SkyCode } from "@/types/weather.ts";
import { cn } from "@/lib/utils.ts";
import { getWeatherData } from "@/features/weatherInfo.ts";
import { getNxNy } from "@/features/excelToJson.ts";

export default function WeatherInfo() {
  const { weather, setWeather } = useWeatherStore();
  const { code } = useLocationStore();

  const [t1hValue, setT1hValue] = useState(""); // 기온
  const [skyValue, setSkyValue] = useState(""); // 하늘 상태
  const [ptyValue, setPtyValue] = useState(""); // 강수 형태

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await getNxNy(code);
      if (!res) return;

      const data = await getWeatherData(
        Number(res["격자 X"]),
        Number(res["격자 Y"]),
      );
      if (data) {
        setWeather(data);
      }
    };

    fetchWeather();
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
