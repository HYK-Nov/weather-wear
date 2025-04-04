import { TDistrict } from "@/types/coord.ts";
import { excel } from "@/features/excel.ts";

const includesArray = (mainArr: string[], subArr: string[]) => {
  return (
    mainArr.find((item) => {
      if (item.includes(subArr[0])) {
        return subArr;
      }
    }) || null
  );
};

export const getNxNy = async (code: string) => {
  const data = (await excel("district")) as TDistrict[];

  if (data) {
    return data.find((item) => code == item["행정구역코드"]);
  }
};

export const getMidCode = async (region: string[]) => {
  const data = (await excel("mid")) as [[string, string]];
  const result = data.find((item) => {
    return includesArray(region, item);
  });

  if (result) {
    return result[1];
  }
};

const rainRegions = [
  { name: ["서울", "인천", "경기도"], code: "11B00000" },
  { name: ["강원도영서"], code: "11D10000" },
  { name: ["강원도영동"], code: "11D20000" },
  { name: ["대전", "세종", "충청남도"], code: "11C20000" },
  { name: ["충청북도"], code: "11C10000" },
  { name: ["광주", "전라남도"], code: "11F20000" },
  { name: ["전북자치도"], code: "11F10000" },
  { name: ["대구", "경상북도"], code: "11H10000" },
  { name: ["부산", "울산", "경상남도"], code: "11H20000" },
  { name: ["제주도"], code: "11G00000" },
];

export const getRainCode = async (region: string[]) => {
  if (region.length == 0) return;

  const gangwonYeongdong = [
    "강릉시",
    "속초시",
    "동해시",
    "삼척시",
    "고성군",
    "양양군",
  ];

  const trimRegion = region[0].replace(/특별|광역|시|자치/g, "").trim();

  if (trimRegion.includes("강원")) {
    if (gangwonYeongdong.includes(region[1])) {
      return rainRegions[2].code;
    } else {
      return rainRegions[1].code;
    }
  }

  return rainRegions.find((item) => {
    return item.name.includes(trimRegion);
  })?.code;
};
