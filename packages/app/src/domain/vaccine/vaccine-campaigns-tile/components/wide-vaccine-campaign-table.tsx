import React from 'react';
import css from '@styled-system/css';
import { useCollapsible } from '~/utils/use-collapsible';
import { Cell, HeaderCell, Row, StyledTable } from '.';
import { Box } from '~/components/base';
import {
  VaccineCampaign,
  VaccineCampaignDescriptions,
  VaccineCampaignHeaders,
} from '../types';
import { Markdown } from '~/components';
import { useIntl } from '~/intl';

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
          {Object.entries(headers).map(([key, value]) => (
            <HeaderCell key={key}>{value}</HeaderCell>
          ))}
        </tr>
      </thead>

      <tbody>
        {campaigns
          .sort(
            (campaignA, campaignB) =>
              campaignA.vaccine_campaign_order -
              campaignB.vaccine_campaign_order
          )
          .map((campaign, index) => (
            <VaccineCampaignRow
              key={index}
              campaign={campaign}
              campaigns={campaigns}
              campaignDescriptions={campaignDescriptions}
              index={index}
            />
          ))}
      </tbody>
    </StyledTable>
  );
};

interface VaccineCampaignRowProps {
  campaign: VaccineCampaign;
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  index: number;
}

const VaccineCampaignRow = ({
  campaign,
  campaigns,
  campaignDescriptions,
  index,
}: VaccineCampaignRowProps) => {
  const { formatNumber } = useIntl();
  const collapsible = useCollapsible({ isOpen: index === 0 });
  const isOpen = collapsible.isOpen;

  return (
    <Row
      isLast={index + 1 === campaigns.length}
      isOpen={isOpen}
      onClick={() => collapsible.toggle()}
    >
      <Cell colSpan={4} css={css({ p: 0 })}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell css={css({ fontWeight: 'bold' })}>
                {campaign.vaccine_campaign_name_nl}
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
