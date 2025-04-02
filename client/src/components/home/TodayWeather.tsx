import { useEffect, useState } from "react";
import { useLocationStore, useWeatherStore } from "@/stores/weatherStore.ts";
import {
  TbSunFilled,
  TbCloudFilled,
  TbCloudRain,
  TbCloudSnow,
  TbQuestionMark,
} from "react-icons/tb";
import { PtyCode, SkyCode, TNowWeather } from "@/types/weather.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { getNxNy } from "@/features/apiCode.ts";
import { getAprTemp } from "@/features/weather.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

const WeatherIcon: Record<string, { icon: React.ElementType; style: string }> =
  {
    맑음: { icon: TbSunFilled, style: "text-amber-400" },
    "구름 많음": { icon: TbCloudFilled, style: "text-slate-200" },
    흐림: { icon: TbCloudFilled, style: "text-slate-400" },
    비: { icon: TbCloudRain, style: "text-slate-200" },
    "비/눈": { icon: TbCloudRain, style: "text-slate-200" },
    눈: { icon: TbCloudSnow, style: "text-slate-200" },
    빗방울: { icon: TbCloudRain, style: "text-slate-200" },
    빗방울눈날림: { icon: TbCloudRain, style: "text-slate-200" },
    눈날림: { icon: TbCloudSnow, style: "text-slate-200" },
  };

const directions = [
  "북",
  "북북동",
  "북동",
  "동북동",
  "동",
  "동남동",
  "남동",
  "남남동",
  "남",
  "남남서",
  "남서",
  "서남서",
  "서",
  "서북서",
  "북서",
  "북북서",
];

export default function TodayWeather() {
  const { setAprTemp } = useWeatherStore();
  const { code } = useLocationStore();

  const [taValue, setTaValue] = useState(""); // 기온
  const [skyValue, setSkyValue] = useState(""); // 하늘 상태
  const [ptyValue, setPtyValue] = useState(""); // 강수 형태
  const [wsValue, setWsValue] = useState(""); // 풍속
  const [hmValue, setHmValue] = useState(""); // 습도
  const [aprTempValue, setAprTempValue] = useState<number>(); // 체감온도
  const [tmn, setTmn] = useState<number>(); // 최저 기온
  const [tmx, setTmx] = useState<number>(); // 최고 기온

  useEffect(() => {
    (async () => {
      try {
        const res = await getNxNy(code);
        if (!res) return;

        const data = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/weather/now?nx=${res["격자 X"]}&ny=${res["격자 Y"]}`,
        ).then((res) => res.json());

        if (data) {
          console.log(data);
          setTaValue(
            data.now.find((item: TNowWeather) => item.category == "T1H")!
              .fcstValue,
          );
          setSkyValue(
            SkyCode[
              data.now.find((item: TNowWeather) => item.category === "SKY")!
                .fcstValue
            ],
          );
          setPtyValue(
            PtyCode[
              data.now.find((item: TNowWeather) => item.category === "PTY")!
                .fcstValue
            ],
          );
          setWsValue(
            data.now.find((item: TNowWeather) => item.category == "WSD")!
              .fcstValue,
          );
          setHmValue(
            data.now.find((item: TNowWeather) => item.category == "REH")!
              .fcstValue,
          );
          setTmn(data.temp.TMN);
          setTmx(data.temp.TMX);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [code]);

  useEffect(() => {
    if (taValue && wsValue && hmValue) {
      const temp = getAprTemp(
        Number(taValue),
        Number(wsValue),
        Number(hmValue),
      );
      setAprTemp(temp);
      setAprTempValue(temp);
    }
  }, [taValue, wsValue, hmValue]);

  const weatherKey = ptyValue && WeatherIcon[ptyValue] ? ptyValue : skyValue;
  const IconComponent =
    WeatherIcon[weatherKey as keyof typeof WeatherIcon]?.icon || TbQuestionMark;
  const iconStyle =
    WeatherIcon[weatherKey as keyof typeof WeatherIcon]?.style || "";

  return (
    <div className={"flex flex-col items-center gap-2"}>
      <p
        className={
          "inline rounded-full border px-2 py-1 text-sm font-bold text-neutral-500"
        }
      >{`${dayjs().format("MM.DD")} 기준`}</p>
      {taValue && (
        <>
          <div className={"flex items-center gap-2"}>
            <IconComponent className={`size-20 ${iconStyle}`} />
            {/* 현재 기온 */}
            <p className={"text-6xl font-bold"}>{taValue}°</p>
          </div>
          <div className={"flex flex-col items-center"}>
            <p className={"text-lg font-bold"}>{skyValue}</p>
            <div className={"flex gap-2"}>
              <p>
                최저&nbsp;
                <span className={"text-lg font-bold text-blue-500"}>
                  {Math.floor(tmn as number)}°
                </span>
              </p>
              <p>
                최고&nbsp;
                <span className={"text-lg font-bold text-rose-500"}>
                  {Math.floor(tmx as number)}°
                </span>
              </p>
            </div>
          </div>
          <div className={"mt-3 grid grid-cols-3 gap-x-3"}>
            <div className={"flex flex-col rounded border p-3 font-bold"}>
              <p className={"text-sm text-neutral-700"}>체감</p>
              <p className={"text-xl"}>{aprTempValue}°</p>
            </div>
            <div className={"flex flex-col rounded border p-3 font-bold"}>
              <p className={"text-sm text-neutral-700"}>습도</p>
              <p className={"text-xl"}>{hmValue}%</p>
            </div>
            <div className={"flex flex-col rounded border p-3 font-bold"}>
              <p className={"text-sm text-neutral-700"}>체감</p>
              <p className={"text-xl"}>{aprTempValue}°</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
