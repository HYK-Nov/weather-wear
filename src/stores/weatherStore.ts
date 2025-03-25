import { create } from "zustand";
import { TWeather } from "@/types/weather.ts";

type Store = {
  weather: TWeather[] | null;
  setWeather: (data: TWeather[]) => void;
};

export const useWeatherStore = create<Store>((set) => ({
  weather: null,
  setWeather: (data: TWeather[]) => set(() => ({ weather: data })),
}));
