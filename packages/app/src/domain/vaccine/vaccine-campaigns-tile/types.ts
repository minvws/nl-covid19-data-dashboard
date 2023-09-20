export type VaccineCampaign = {
  vaccine_campaign_order: number;
  vaccine_campaign_name_nl: string;
  vaccine_campaign_name_en: string;
  vaccine_administered_total: number | null;
} & Partial<{
  vaccine_administered_last_week: number;
  vaccine_administered_last_timeframe: number;
}>;

interface VaccineCampaignOptionProps {
  hide_campaigns?: number[];
}

export type VaccineCampaignDescriptions = Record<string, string>;
export type VaccineCampaignHeaders = Record<string, string>;
export type VaccineCampaignOptions = VaccineCampaignOptionProps;
