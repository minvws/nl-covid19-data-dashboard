import { useBreakpoints } from '~/utils/use-breakpoints';
import { ChartTile, Markdown, MetadataProps } from '~/components';
import { Text } from '~/components/typography';
import { NarrowVaccineCampaignTable } from './components/narrow-vaccine-campaign-table';
import { WideVaccineCampaignTable } from './components/wide-vaccine-campaign-table';
import { VaccineCampaign, VaccineCampaignDescriptions, VaccineCampaignHeaders, VaccineCampaignOptions } from './types';
import { Box } from '~/components/base';
import { space } from '~/style/theme';

interface VaccineCampaignsTileProps {
  title: string;
  description: string;
  descriptionFooter: string;
  metadata: MetadataProps;
  headers: VaccineCampaignHeaders;
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  campaignOptions?: VaccineCampaignOptions;
}

export const VaccineCampaignsTile = ({ title, headers, campaigns, campaignDescriptions, description, descriptionFooter, metadata, campaignOptions }: VaccineCampaignsTileProps) => {
  const breakpoints = useBreakpoints();

  // Display only the campaigns that are not hidden in the campaignOptions prop
  const sortedCampaigns = campaigns
    .filter((vaccineCampaign) => campaignOptions && !campaignOptions.hide_campaigns.includes(vaccineCampaign.vaccine_campaign_order))
    .sort((campaignA, campaignB) => campaignA.vaccine_campaign_order - campaignB.vaccine_campaign_order);

  const totalsAvailable = sortedCampaigns.some((camp) => camp.vaccine_administered_total);

  return (
    <>
      <ChartTile title={title} description={description} metadata={metadata}>
        {breakpoints.sm ? (
          <WideVaccineCampaignTable campaigns={sortedCampaigns} campaignDescriptions={campaignDescriptions} headers={headers} showTotals={totalsAvailable} />
        ) : (
          <NarrowVaccineCampaignTable campaigns={sortedCampaigns} campaignDescriptions={campaignDescriptions} headers={headers} showTotals={totalsAvailable} />
        )}
        <Box marginTop={space[3]}>
          <Text variant="label1" color="gray7">
            <Markdown content={descriptionFooter} />
          </Text>
        </Box>
      </ChartTile>
    </>
  );
};
