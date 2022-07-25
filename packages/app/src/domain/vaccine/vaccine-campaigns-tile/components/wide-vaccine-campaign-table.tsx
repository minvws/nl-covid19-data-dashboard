import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { useCollapsible } from '~/utils/use-collapsible';
import { useIntl } from '~/intl';
import { Cell, HeaderCell, Row, StyledTable } from '.';
import { Box } from '~/components/base';
import { Markdown } from '~/components';
import {
  VaccineCampaign,
  VaccineCampaignDescriptions,
  VaccineCampaignHeaders,
} from '../types';

interface WideVaccineCampaignTableProps {
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  headers: VaccineCampaignHeaders;
}

export const WideVaccineCampaignTable = ({
  campaigns,
  campaignDescriptions,
  headers,
}: WideVaccineCampaignTableProps) => {
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
          <VaccineCampaignRow
            key={index}
            campaign={campaign}
            campaignDescriptions={campaignDescriptions}
            isFirst={index === 0}
            isLast={index + 1 === campaigns.length}
          />
        ))}
      </tbody>
    </StyledTable>
  );
};

interface VaccineCampaignRowProps {
  campaign: VaccineCampaign;
  campaignDescriptions: VaccineCampaignDescriptions;
  isFirst: boolean;
  isLast: boolean;
}

const VaccineCampaignRow = ({
  campaign,
  campaignDescriptions,
  isFirst,
  isLast,
}: VaccineCampaignRowProps) => {
  const { formatNumber } = useIntl();
  const collapsible = useCollapsible({ isOpen: isFirst });
  const isOpen = collapsible.isOpen;
  const { locale = 'nl' } = useRouter();

  return (
    <Row isLast={isLast} isOpen={isOpen} onClick={() => collapsible.toggle()}>
      <Cell colSpan={4} css={css({ p: 0 })}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell>
                <strong>
                  {locale === 'nl'
                    ? campaign.vaccine_campaign_name_nl
                    : campaign.vaccine_campaign_name_en}
                </strong>
              </Cell>

              <Cell>
                {isOpen ? (
                  <strong>
                    {formatNumber(campaign.vaccine_administered_last_week)}
                  </strong>
                ) : (
                  <>{formatNumber(campaign.vaccine_administered_last_week)}</>
                )}
              </Cell>

              <Cell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isOpen ? (
                    <strong>
                      {formatNumber(campaign.vaccine_administered_total)}
                    </strong>
                  ) : (
                    <>{formatNumber(campaign.vaccine_administered_total)}</>
                  )}

                  {collapsible.button()}
                </Box>
              </Cell>
            </tr>

            <tr>
              <Cell colSpan={4} css={css({ pb: isOpen ? 4 : 0, pt: 0 })}>
                {collapsible.content(
                  <Markdown
                    content={
                      campaignDescriptions[
                        `${campaign.vaccine_campaign_name_en
                          .toLowerCase()
                          .replaceAll(' ', '_')}_description`
                      ]
                    }
                  />
                )}
              </Cell>
            </tr>
          </tbody>
        </StyledTable>
      </Cell>
    </Row>
  );
};
