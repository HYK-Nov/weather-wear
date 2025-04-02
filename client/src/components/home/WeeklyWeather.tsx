import { useLocationStore } from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import { TWeekTemp } from "@/types/weather.ts";
import WeeklyItem from "@/components/home/WeeklyItem.tsx";
import { getMidCode } from "@/features/apiCode.ts";

export default function WeeklyWeather() {
  const { region } = useLocationStore();
  const [midCode, setMidCode] = useState("");
  const [weekRain, setWeekRain] = useState();
  const [weekTemp, setWeekTemp] = useState<TWeekTemp>();

  useEffect(() => {
    if (region) {
      (async () => {
        const code = await getMidCode(region);
        if (code) {
          setMidCode(code);
        }
      })();
    }
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

    if (midCode) {
      tempData().then((data) => setWeekTemp(data));
      rainData().then((data) => setWeekRain(data));
    }
  }, [midCode]);

  return (
    <div className={"col-span-2 rounded-lg border p-5"}>
      <p className={"mb-2 text-2xl font-bold"}>주간예보</p>
      <div className={"flex flex-col px-2"}>
        {weekTemp &&
          Object.entries(weekTemp).map(([key, value]) => (
            <WeeklyItem
              key={key}
              later={key}
              tempMin={value.min}
              tempMax={value.max}
            />
          ))}
      </div>
    </div>
  );
}
