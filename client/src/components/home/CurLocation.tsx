import { TbCurrentLocation } from "react-icons/tb";
import { useEffect, useState } from "react";
import { district } from "@/features/district.ts";
import { useLocationStore } from "@/stores/weatherStore.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function CurLocation() {
  const [curDistrict, setCurDistrict] = useState("");
  const { setCode, setRegion } = useLocationStore();

  const getCurrentDistrict = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      district(position.coords).then((res) => {
        setCurDistrict(`${res.region_2depth_name} ${res.region_3depth_name}`);
        setRegion([
          res.region_1depth_name,
          res.region_2depth_name,
          res.region_3depth_name,
        ]);
        setCode(res.code);
      });
    });
  };

  useEffect(() => {
    getCurrentDistrict();
  }, []);

  return (
    <div className="flex items-center gap-x-2">
      <p className={"text-2xl font-bold"}>
        {navigator.geolocation ? curDistrict : "위치 정보를 지원하지 않음"}
      </p>
      <button onClick={getCurrentDistrict}>
        <TbCurrentLocation className={"size-6 text-neutral-600"} />
      </button>
      <p
        className={
          "inline rounded-full border bg-white/5 px-2 py-1 text-sm font-bold text-neutral-500 dark:border-neutral-700"
        }
      >{`${dayjs().format("MM.DD")} 기준`}</p>
    </div>
  );
}
