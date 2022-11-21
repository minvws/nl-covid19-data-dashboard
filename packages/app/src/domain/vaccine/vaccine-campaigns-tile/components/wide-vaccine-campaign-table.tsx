import { useRouter } from 'next/router';
import { useIntl } from '~/intl';
import { Markdown } from '~/components';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { space } from '~/style/theme';
import { useCollapsible } from '~/utils/use-collapsible';
import { StyledCell as Cell, StyledHeaderCell as HeaderCell, StyledRow as Row, StyledTable } from '.';
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
          <HeaderCell>{headers.vaccine}</HeaderCell>
          <HeaderCell>{headers.last_week}</HeaderCell>
          <HeaderCell>{headers.total}</HeaderCell>
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
    <Row isFirst={isFirst} onClick={() => collapsible.toggle()}>
      <Cell colSpan={4} padding={space[0]}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell>
                <BoldText>{locale === 'nl' ? campaign.vaccine_campaign_name_nl : campaign.vaccine_campaign_name_en}</BoldText>
              </Cell>

              <Cell>{isOpen ? <BoldText>{formatNumber(campaign.vaccine_administered_last_week)}</BoldText> : formatNumber(campaign.vaccine_administered_last_week)}</Cell>

              <Cell>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {isOpen ? <BoldText>{formatNumber(campaign.vaccine_administered_total)}</BoldText> : formatNumber(campaign.vaccine_administered_total)}

                  {collapsible.button()}
                </Box>
              </Cell>
            </tr>

            <tr>
              <Cell colSpan={4} paddingBottom={isOpen ? space[4] : space[0]} paddingTop={space[0]}>
                {collapsible.content(<Markdown content={campaignDescription} />)}
              </Cell>
            </tr>
          </tbody>
        </StyledTable>
      </Cell>
    </Row>
  );
};
