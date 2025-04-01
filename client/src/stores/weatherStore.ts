import { create } from "zustand";
import { TNowWeather } from "@/types/weather.ts";

type WeatherStore = {
  weather: TNowWeather[] | null;
  setWeather: (data: TNowWeather[]) => void;
};

type LocationStore = {
  code: string;
  region: string[];
  setCode: (code: string) => void;
  setRegion: (region: string[]) => void;
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: null,
  setWeather: (data: TNowWeather[]) => set(() => ({ weather: data })),
}));

export const useLocationStore = create<LocationStore>((set) => ({
  code: "",
  region: [],
  setCode: (code: string) => set(() => ({ code })),
  setRegion: (region: string[]) => set(() => ({ region: region })),
}));
