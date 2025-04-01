import { useLocationStore } from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import { getMidCode } from "@/features/excelToJson.ts";
import { TWeekTemp } from "@/types/weather.ts";
import WeekItem from "@/components/home/WeekItem.tsx";

export default function WeeklyWeather() {
  const { region } = useLocationStore();
  const [midCode, setMidCode] = useState("");
  const [weekRain, setWeekRain] = useState();
  const [weekTemp, setWeekTemp] = useState<TWeekTemp>();

  useEffect(() => {
    (async () => {
      const code = await getMidCode(region);
      if (code) {
        setMidCode(code);
      }
    })();
  }, [region]);

  useEffect(() => {
    const tempData = async () => {
      try {
        return await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/weather/week/temp?regId=${midCode}`,
        ).then((res) => res.json());
      } catch (error) {
        console.error(error);
      }
    };

    const rainData = async () => {
      try {
        return await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/weather/week/rain?regId=${midCode}`,
        ).then((res) => res.json());
      } catch (error) {
        console.error(error);
      }
    };

    tempData().then((data) => setWeekTemp(data));
    rainData().then((data) => setWeekRain(data));
  }, [midCode]);

  return (
    <div className={"col-span-2 rounded-lg border p-5"}>
      <p className={"text-2xl font-bold"}>주간 날씨</p>
      <div className={"flex flex-col"}>
        {weekTemp &&
          Object.entries(weekTemp).map(([key, value]) => (
            <WeekItem
              key={key}
              day={key}
              tempMin={value.min}
              tempMax={value.max}
            />
          ))}
      </div>
    </div>
  );
}
