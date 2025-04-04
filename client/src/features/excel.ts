import districtExcel from "@/assets/data/district_data.xlsx";
import midCodeExcel from "@/assets/data/mid_code_data.xlsx";
import * as XLSX from "xlsx";

// xlsx -> json
export const excel = async (data: "district" | "mid") => {
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
