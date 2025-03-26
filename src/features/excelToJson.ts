import excelFile from "@/assets/data/weather_data.xlsx";
import * as XLSX from "xlsx";
import { TDistrict } from "@/types/coord.ts";

// xlsx -> json
const excelToJson = async () => {
  const response = await fetch(excelFile);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
};

export const getNxNy = async (code: string) => {
  const data = (await excelToJson()) as TDistrict[];

  if (data) {
    return data.find((item) => code == item["행정구역코드"]);
  }
};
