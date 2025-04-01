import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

const DayOfWeek = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
} as const;

export default function WeekItem({
  tempMax,
  tempMin,
  day,
}: {
  day: number | string;
  tempMin: number;
  tempMax: number;
}) {
  const NOW = dayjs();

  return (
    <div className={"flex gap-3"}>
      <p>{DayOfWeek[NOW.add(Number(day), "days").day()]}요일</p>
      <p>{tempMax}°</p>
      <p>{tempMin}°</p>
    </div>
  );
}
