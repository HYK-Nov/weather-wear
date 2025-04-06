import { create } from "zustand/index";

type WeatherCarouselStore = {
  curIndex: number;
  curDateKey: string;
  setCurIndex: (index: number) => void;
  setCurDateKey: (dateKey: string) => void;
};

export const useWeatherCarouselStore = create<WeatherCarouselStore>((set) => ({
  curIndex: 0,
  curDateKey: "",
  setCurIndex: (index) => set({ curIndex: index }),
  setCurDateKey: (dateKey) => set({ curDateKey: dateKey }),
}));
