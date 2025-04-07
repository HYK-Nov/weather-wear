import {
  useLocationStore,
  useWeeklyWeatherStore,
} from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import { TWeekTemp } from "@/types/weather.ts";
import WeeklyItem from "@/components/home/weekly/WeeklyItem.tsx";
import { getMidCode, getNxNy, getRainCode } from "@/features/apiCode.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function Weekly() {
  const { region, code } = useLocationStore();
  const { setWeeklyWeather } = useWeeklyWeatherStore();
  const [weekTemp, setWeekTemp] = useState<TWeekTemp>();

  useEffect(() => {
    (async () => {
      const midCode = await getMidCode(region);
      const nxny = await getNxNy(code);
      const rainCode = await getRainCode(region);

      if (!midCode || !nxny || !rainCode) return;

      const weekData = async () => {
        try {
          return await fetch(
            `${import.meta.env.VITE_SERVER_API}/weather/week?regId1=${midCode}&regId2=${rainCode}&nx=${nxny["격자 X"]}&ny=${nxny["격자 Y"]}`,
          ).then((res) => res.json());
        } catch (error) {
          console.error(error);
        }
      };

      if (midCode) {
        weekData().then((data) => {
          setWeekTemp(data);
          setWeeklyWeather(data);
        });
      }
    })();
  }, [region]);

  return (
    <>
      {weekTemp ? (
        <div className={"col-span-2 rounded-lg border p-6"}>
          <p className={"mb-2 text-2xl font-bold"}>주간예보</p>
          <div className={"flex h-full flex-col"}>
            {Object.entries(weekTemp).map(([key, value]) => (
              <WeeklyItem key={key} later={key} data={value} />
            ))}
          </div>
        </div>
      ) : (
        <Skeleton className="col-span-2 rounded-lg p-5" />
      )}
    </>
  );
}
