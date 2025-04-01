import districtExcel from "@/assets/data/district_data.xlsx";
import midCodeExcel from "@/assets/data/mid_code_data.xlsx";
import * as XLSX from "xlsx";
import { TDistrict } from "@/types/coord.ts";

// xlsx -> json
const excelToJson = async (data: "district" | "mid") => {
  const response = await fetch(
    data === "district" ? districtExcel : midCodeExcel,
  );
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet, {
    header: data === "mid" ? 1 : undefined,
  });
};

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
  const data = (await excelToJson("district")) as TDistrict[];

  if (data) {
    return data.find((item) => code == item["행정구역코드"]);
  }
};

export const getMidCode = async (region: string[]) => {
  const data = (await excelToJson("mid")) as [[string, string]];
  const result = data.find((item) => {
    return includesArray(region, item);
  });

  if (result) {
    return result[1];
  }
};
