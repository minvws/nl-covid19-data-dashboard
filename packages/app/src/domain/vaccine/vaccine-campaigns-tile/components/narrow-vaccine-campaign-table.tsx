import { useRouter } from 'next/router';
import { useIntl } from '~/intl';
import { Markdown } from '~/components';
import { BoldText } from '~/components/typography';
import { space } from '~/style/theme';
import { useCollapsible } from '~/utils/use-collapsible';
import { StyledCell, StyledHeaderCell, StyledRow, StyledTable } from '.';
import { VaccineCampaign, VaccineCampaignDescriptions, VaccineCampaignHeaders } from '../types';

interface NarrowVaccineCampaignTableProps {
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  headers: VaccineCampaignHeaders;
  hideTotals: boolean;
}

export const NarrowVaccineCampaignTable = ({ campaigns, campaignDescriptions, headers, hideTotals }: NarrowVaccineCampaignTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledHeaderCell isMobile>{headers.vaccine}</StyledHeaderCell>
        </tr>
      </thead>

      <tbody>
        {campaigns.map((campaign, index) => (
          <VaccineCampaignRow
            key={campaign.vaccine_campaign_order}
            campaign={campaign}
            campaignDescriptions={campaignDescriptions}
            headers={headers}
            isFirst={index === 0}
            hideTotals={hideTotals}
          />
        ))}
      </tbody>
    </StyledTable>
  );
};

interface VaccineCampaignRowProps {
  campaign: VaccineCampaign;
  campaignDescriptions: VaccineCampaignDescriptions;
  headers: VaccineCampaignHeaders;
  isFirst: boolean;
  hideTotals: boolean;
}

const VaccineCampaignRow = ({ campaign, campaignDescriptions, headers, isFirst, hideTotals }: VaccineCampaignRowProps) => {
  const { formatNumber } = useIntl();
  const collapsible = useCollapsible({ isOpen: isFirst });
  const { locale = 'nl' } = useRouter();

  const isOpen = collapsible.isOpen;

  const campaignDescription = campaignDescriptions[`${campaign.vaccine_campaign_name_en.toLowerCase().replace(/ /g, '_')}_description`];

  return (
    <StyledRow isFirst={isFirst} onClick={() => collapsible.toggle()}>
      <StyledCell padding="0">
        <StyledTable>
          <tbody>
            <tr>
              <StyledCell paddingTop={space[3]} isMobile>
                <BoldText>{locale === 'nl' ? campaign.vaccine_campaign_name_nl : campaign.vaccine_campaign_name_en}</BoldText>
              </StyledCell>

              <StyledCell paddingTop={space[3]} alignRight isMobile>
                {collapsible.button()}
              </StyledCell>
            </tr>

            <tr>
              <StyledCell paddingY="0" isMobile>
                {headers.last_week} :{' '}
                {isOpen ? (
                  <BoldText>{formatNumber(campaign.vaccine_administered_last_week || campaign.vaccine_administered_last_timeframe)}</BoldText>
                ) : (
                  formatNumber(campaign.vaccine_administered_last_week || campaign.vaccine_administered_last_timeframe)
                )}
              </StyledCell>
            </tr>

            {!hideTotals ?? (
              <tr>
                <StyledCell paddingY="0" isMobile>
                  {headers.total} : {isOpen ? <BoldText>{formatNumber(campaign.vaccine_administered_total)}</BoldText> : formatNumber(campaign.vaccine_administered_total)}
                </StyledCell>
              </tr>
            )}

            <tr>
              <StyledCell paddingBottom={collapsible.isOpen ? space[3] : space[2]} colSpan={2} isMobile>
                {collapsible.content(<Markdown content={campaignDescription} />)}
              </StyledCell>
            </tr>
          </tbody>
        </StyledTable>
      </StyledCell>
    </StyledRow>
  );
};
