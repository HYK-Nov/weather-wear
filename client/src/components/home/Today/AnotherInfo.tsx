import { FaTemperatureHalf, FaWind } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import PmInfo from "@/components/home/Today/PmInfo.tsx";

export default function AnotherInfo({
  aprTemp,
  ws,
  wd,
  hm,
}: {
  aprTemp: number;
  hm: string;
  wd: string;
  ws: number;
}) {
  return (
    <div className={"mt-3 grid grid-cols-4 justify-items-center gap-2"}>
      {/* 미세먼지 */}
      <PmInfo />
      {/* 체감온도 */}
      <div
        className={
          "bg-background flex w-full items-center gap-2 rounded-lg border p-2 font-bold"
        }
      >
        <FaTemperatureHalf className="size-6 text-neutral-700" />
        <div>
          <p className={"text-sm text-neutral-700"}>체감</p>
          <p className={"text-xl"}>{aprTemp}°</p>
        </div>
      </div>
      {/* 습도 */}
      <div
        className={
          "bg-background flex w-full items-center gap-2 rounded-lg border p-2 font-bold"
        }
      >
        <MdOutlineWaterDrop className="size-7 text-neutral-700" />
        <div>
          <p className={"text-sm text-neutral-700"}>습도</p>
          <p className={"text-xl"}>{hm}%</p>
        </div>
      </div>
      {/* 풍속, 풍향 */}
      <div
        className={
          "bg-background flex w-full items-center gap-2 rounded-lg border p-2 font-bold"
        }
      >
        <FaWind className="size-6 text-neutral-700" />
        <div>
          <p className={"text-sm text-neutral-700"}>{wd}풍</p>
          <p className={"text-xl"}>{ws?.toFixed(1)}m/s</p>
        </div>
      </div>
    </div>
  );
}
