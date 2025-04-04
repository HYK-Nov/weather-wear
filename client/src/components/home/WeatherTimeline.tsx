import { useEffect } from "react";
import { getNxNy } from "@/features/apiCode.ts";
import { useLocationStore } from "@/stores/weatherStore.ts";

export default function WeatherTimeline() {
  const { code } = useLocationStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await getNxNy(code);
        if (!res) return;

        const data = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/weather/timeline?nx=${res["격자 X"]}&ny=${res["격자 Y"]}`,
        ).then((res) => res.json());

        if (data) {
          console.log(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [code]);

  return (
    <div className={"rounded-lg border p-5"}>
      <p className={"text-2xl font-bold"}>시간별 날씨</p>
      <div className={"flex gap-3"}>
        <p>20시데스네</p>
        <p>21시데스네</p>
        <p>22시데스네</p>
        <p>23시데스네</p>
        <p>0시데스네</p>
        <p>1시데스네</p>
        <p>2시데스네</p>
        <p>3시데스네</p>
      </div>
    </div>
  );
}
