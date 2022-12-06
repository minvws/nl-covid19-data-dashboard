import { useRouter } from 'next/router';
import { useIntl } from '~/intl';
import { Markdown } from '~/components';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { space } from '~/style/theme';
import { useCollapsible } from '~/utils/use-collapsible';
import { StyledCell, StyledHeaderCell, StyledRow, StyledTable } from '.';
import { VaccineCampaign, VaccineCampaignDescriptions, VaccineCampaignHeaders } from '../types';

interface WideVaccineCampaignTableProps {
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  headers: VaccineCampaignHeaders;
}

export const WideVaccineCampaignTable = ({ campaigns, campaignDescriptions, headers }: WideVaccineCampaignTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledHeaderCell>{headers.vaccine}</StyledHeaderCell>
          <StyledHeaderCell>{headers.last_week}</StyledHeaderCell>
          <StyledHeaderCell>{headers.total}</StyledHeaderCell>
        </tr>
      </thead>

      <tbody>
        {campaigns.map((campaign, index) => (
          <VaccineCampaignRow key={index} campaign={campaign} campaignDescriptions={campaignDescriptions} isFirst={index === 0} />
        ))}
      </tbody>
    </StyledTable>
  );
};

interface VaccineCampaignRowProps {
  campaign: VaccineCampaign;
  campaignDescriptions: VaccineCampaignDescriptions;
  isFirst: boolean;
}

const VaccineCampaignRow = ({ campaign, campaignDescriptions, isFirst }: VaccineCampaignRowProps) => {
  const { formatNumber } = useIntl();
  const collapsible = useCollapsible({ isOpen: isFirst });
  const { locale = 'nl' } = useRouter();

  const isOpen = collapsible.isOpen;

  const campaignDescription = campaignDescriptions[`${campaign.vaccine_campaign_name_en.toLowerCase().replace(/ /g, '_')}_description`];

  return (
    <StyledRow isFirst={isFirst} onClick={() => collapsible.toggle()}>
      <StyledCell colSpan={4} padding={space[0]}>
        <StyledTable>
          <tbody>
            <tr>
              <StyledCell>
                <BoldText>{locale === 'nl' ? campaign.vaccine_campaign_name_nl : campaign.vaccine_campaign_name_en}</BoldText>
              </StyledCell>

              <StyledCell>
                {isOpen ? <BoldText>{formatNumber(campaign.vaccine_administered_last_week)}</BoldText> : formatNumber(campaign.vaccine_administered_last_week)}
              </StyledCell>

              <StyledCell>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {isOpen ? <BoldText>{formatNumber(campaign.vaccine_administered_total)}</BoldText> : formatNumber(campaign.vaccine_administered_total)}

                  {collapsible.button()}
                </Box>
              </StyledCell>
            </tr>

            <tr>
              <StyledCell colSpan={4} paddingBottom={isOpen ? space[4] : space[0]} paddingTop={space[0]}>
                {collapsible.content(<Markdown content={campaignDescription} />)}
              </StyledCell>
            </tr>
          </tbody>
        </StyledTable>
      </StyledCell>
    </StyledRow>
  );
};
