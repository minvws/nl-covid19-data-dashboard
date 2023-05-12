export type VaccineCampaign = {
  vaccine_campaign_order: number;
  vaccine_campaign_name_nl: string;
  vaccine_campaign_name_en: string;
  vaccine_administered_total: number;
} & Partial<{
  vaccine_administered_last_week: number;
  vaccine_administered_last_timeframe: number;
}>;

export type VaccineCampaignDescriptions = Record<string, string>;
export type VaccineCampaignHeaders = Record<string, string>;
