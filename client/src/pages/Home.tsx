import "../styles/App.css";
import TodayWeather from "@/components/home/TodayWeather.tsx";
import WeatherTimeline from "@/components/home/WeatherTimeline.tsx";
import RecommendWear from "@/components/home/RecommendWear.tsx";
import CurLocation from "@/components/home/CurLocation.tsx";
import WeeklyWeather from "@/components/home/WeeklyWeather.tsx";

function Home() {
  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="col-span-6 flex flex-col gap-y-6">
        <CurLocation />
        <TodayWeather />
        <WeatherTimeline />
        <RecommendWear />
      </div>
      <WeeklyWeather />
    </div>
  );
}

export default Home;
