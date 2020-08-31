export interface MunicipalityMetrics {
  Total_reported: number;
  Hospital_admission: number;
  Deceased: number;
}

export interface MunicipalityData extends MunicipalityMetrics {
  Date_of_report: string;
  Municipality_code: string;
  Municipality_name: string;
  Province: string;
  value?: number;
}
