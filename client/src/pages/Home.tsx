import "../styles/App.css";
import Today from "@/components/home/Today.tsx";
import Timeline from "@/components/home/Timeline.tsx";
import RecommendWear from "@/components/home/RecommendWear.tsx";
import CurLocation from "@/components/home/CurLocation.tsx";
import Weekly from "@/components/home/Weekly.tsx";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = "웨더웨어";
  }, []);

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-8">
      <div className="col-span-6 flex w-full flex-col gap-y-5">
        <CurLocation />
        <Today />
        <Timeline />
        <RecommendWear />
      </div>
      <div className={"col-span-6 w-full lg:col-span-2"}>
        <div className={"sticky top-10"}>
          <Weekly />
        </div>
      </div>
    </div>
  );
}
