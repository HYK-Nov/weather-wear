import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function Calendar() {
  const now = dayjs();

  console.log(now.format("YYMMDD"));
  return <div className={"h-full w-full"}></div>;
}
