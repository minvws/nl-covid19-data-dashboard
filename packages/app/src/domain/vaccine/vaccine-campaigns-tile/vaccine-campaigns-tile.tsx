import { useBreakpoints } from '~/utils/use-breakpoints';
import { ChartTile, MetadataProps } from '~/components';
import { NarrowVaccineCampaignTable } from './components/narrow-vaccine-campaign-table';
import { WideVaccineCampaignTable } from './components/wide-vaccine-campaign-table';
import { VaccineCampaign, VaccineCampaignDescriptions, VaccineCampaignHeaders, VaccineCampaignOptions } from './types';
interface VaccineCampaignsTileProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  headers: VaccineCampaignHeaders;
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  campaignOptions?: VaccineCampaignOptions;
}

export const VaccineCampaignsTile = ({ title, headers, campaigns, campaignDescriptions, description, metadata, campaignOptions }: VaccineCampaignsTileProps) => {
  const breakpoints = useBreakpoints();

  // Display only the campaigns that are not hidden in the campaignOptions prop
  const filteredCampaigns = campaignOptions ? campaigns.filter((vaccineCampaign) => !campaignOptions.hide_campaigns.includes(vaccineCampaign.vaccine_campaign_order)) : campaigns;

  const sortedAndFilteredCampaigns = filteredCampaigns.sort((campaignA, campaignB) => campaignA.vaccine_campaign_order - campaignB.vaccine_campaign_order);

  const totalsAvailable = sortedAndFilteredCampaigns.some((camp) => camp.vaccine_administered_total);

  return (
    <>
      <ChartTile title={title} description={description} metadata={metadata}>
        {breakpoints.sm ? (
          <WideVaccineCampaignTable campaigns={sortedAndFilteredCampaigns} campaignDescriptions={campaignDescriptions} headers={headers} showTotals={totalsAvailable} />
        ) : (
          <NarrowVaccineCampaignTable campaigns={sortedAndFilteredCampaigns} campaignDescriptions={campaignDescriptions} headers={headers} showTotals={totalsAvailable} />
        )}
      </ChartTile>
    </>
  );
};
