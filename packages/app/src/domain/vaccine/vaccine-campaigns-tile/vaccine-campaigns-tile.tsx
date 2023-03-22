import { useBreakpoints } from '~/utils/use-breakpoints';
import { ChartTile, Markdown, MetadataProps } from '~/components';
import { Text } from '~/components/typography';
import { NarrowVaccineCampaignTable } from './components/narrow-vaccine-campaign-table';
import { WideVaccineCampaignTable } from './components/wide-vaccine-campaign-table';
import { VaccineCampaign, VaccineCampaignDescriptions, VaccineCampaignHeaders } from './types';
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
}

export const VaccineCampaignsTile = ({ title, headers, campaigns, campaignDescriptions, description, descriptionFooter, metadata }: VaccineCampaignsTileProps) => {
  const breakpoints = useBreakpoints();

  const sortedCampaigns = campaigns.sort((campaignA, campaignB) => campaignA.vaccine_campaign_order - campaignB.vaccine_campaign_order);

  return (
    <>
      <ChartTile title={title} description={description} metadata={metadata}>
        {breakpoints.sm ? (
          <WideVaccineCampaignTable campaigns={sortedCampaigns} campaignDescriptions={campaignDescriptions} headers={headers} />
        ) : (
          <NarrowVaccineCampaignTable campaigns={sortedCampaigns} campaignDescriptions={campaignDescriptions} headers={headers} />
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
