import "../styles/App.css";
import TodayWeather from "@/components/home/TodayWeather.tsx";
import Timeline from "@/components/home/Timeline.tsx";
import RecommendWear from "@/components/home/RecommendWear.tsx";
import CurLocation from "@/components/home/CurLocation.tsx";
import WeeklyWeather from "@/components/home/WeeklyWeather.tsx";

function Home() {
  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="col-span-6 flex w-full flex-col gap-y-6">
        <CurLocation />
        <TodayWeather />
        <Timeline />
        <RecommendWear />
      </div>
      <WeeklyWeather />
    </div>
  );
}

export default Home;
