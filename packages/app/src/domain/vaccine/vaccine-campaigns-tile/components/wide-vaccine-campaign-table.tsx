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
  showTotals: boolean;
}

export const WideVaccineCampaignTable = ({ campaigns, campaignDescriptions, headers, showTotals }: WideVaccineCampaignTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledHeaderCell>{headers.vaccine}</StyledHeaderCell>
          <StyledHeaderCell>{headers.last_week}</StyledHeaderCell>
          {showTotals ? <StyledHeaderCell>{headers.total}</StyledHeaderCell> : <></>}
        </tr>
      </thead>

      <tbody>
        {campaigns.map((campaign, index) => (
          <VaccineCampaignRow key={index} campaign={campaign} campaignDescriptions={campaignDescriptions} isFirst={index === 0} hideTotals={showTotals} />
        ))}
      </tbody>
    </StyledTable>
  );
};

interface VaccineCampaignRowProps {
  campaign: VaccineCampaign;
  campaignDescriptions: VaccineCampaignDescriptions;
  isFirst: boolean;
  hideTotals: boolean;
}

const VaccineCampaignRow = ({ campaign, campaignDescriptions, isFirst, hideTotals }: VaccineCampaignRowProps) => {
  const { formatNumber } = useIntl();
  const collapsible = useCollapsible({ isOpen: isFirst });
  const { locale = 'nl' } = useRouter();

  const isOpen = collapsible.isOpen;

  const campaignDescription = campaignDescriptions[`${campaign.vaccine_campaign_name_en.toLowerCase().replace(/ /g, '_')}_description`];

  return (
    <StyledRow isFirst={isFirst} onClick={() => collapsible.toggle()}>
      <StyledCell colSpan={4} padding="0">
        <StyledTable>
          <tbody>
            <tr>
              <StyledCell>
                <BoldText>{locale === 'nl' ? campaign.vaccine_campaign_name_nl : campaign.vaccine_campaign_name_en}</BoldText>
              </StyledCell>

              {hideTotals ? (
                <>
                  <StyledCell>
                    {isOpen ? (
                      <BoldText>{formatNumber(campaign.vaccine_administered_last_week || campaign.vaccine_administered_last_timeframe)}</BoldText>
                    ) : (
                      formatNumber(campaign.vaccine_administered_last_week || campaign.vaccine_administered_last_timeframe)
                    )}
                  </StyledCell>

                  <StyledCell>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      {isOpen ? <BoldText>{formatNumber(campaign.vaccine_administered_total)}</BoldText> : formatNumber(campaign.vaccine_administered_total)}

                      {collapsible.button()}
                    </Box>
                  </StyledCell>
                </>
              ) : (
                <>
                  <StyledCell>
                    {isOpen ? (
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <BoldText>{formatNumber(campaign.vaccine_administered_last_week || campaign.vaccine_administered_last_timeframe)}</BoldText>

                        {collapsible.button()}
                      </Box>
                    ) : (
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {formatNumber(campaign.vaccine_administered_last_week || campaign.vaccine_administered_last_timeframe)}
                        {collapsible.button()}
                      </Box>
                    )}
                  </StyledCell>
                </>
              )}
            </tr>

            <tr>
              <StyledCell colSpan={4} paddingBottom={isOpen ? space[4] : '0'} paddingTop="0">
                {collapsible.content(<Markdown content={campaignDescription} />)}
              </StyledCell>
            </tr>
          </tbody>
        </StyledTable>
      </StyledCell>
    </StyledRow>
  );
};
