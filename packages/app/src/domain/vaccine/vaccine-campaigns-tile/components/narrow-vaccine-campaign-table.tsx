import css from '@styled-system/css';
import { useCollapsible } from '~/utils/use-collapsible';
import { useIntl } from '~/intl';
import { Cell, HeaderCell, Row, StyledTable } from '.';
import { Markdown } from '~/components';
import {
  VaccineCampaign,
  VaccineCampaignDescriptions,
  VaccineCampaignHeaders,
} from '../types';

interface NarrowVaccineCampaignTableProps {
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  headers: VaccineCampaignHeaders;
}

export const NarrowVaccineCampaignTable = ({
  campaigns,
  campaignDescriptions,
  headers,
}: NarrowVaccineCampaignTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          {Object.entries(headers)
            .filter(([key, _]) => key === 'vaccine')
            .map(([key, value]) => (
              <HeaderCell key={key} mobile>
                {value}
              </HeaderCell>
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
              key={campaign.vaccine_campaign_order}
              index={index}
              campaign={campaign}
              campaigns={campaigns}
              campaignDescriptions={campaignDescriptions}
              headers={headers}
            />
          ))}
      </tbody>
    </StyledTable>
  );
};

interface VaccineCampaignRowProps {
  headers: VaccineCampaignHeaders;
  campaign: VaccineCampaign;
  campaigns: VaccineCampaign[];
  campaignDescriptions: VaccineCampaignDescriptions;
  index: number;
}

const VaccineCampaignRow = ({
  headers,
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
      <Cell css={css({ p: 0 })}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell css={css({ pt: 3 })} mobile>
                <strong>{campaign.vaccine_campaign_name_nl}</strong>
              </Cell>

              <Cell css={css({ pt: 3 })} alignRight mobile>
                {collapsible.button()}
              </Cell>
            </tr>

            {Object.keys(headers)
              .filter((key) => key !== 'vaccine')
              .map((header, index) => (
                <tr key={index}>
                  <Cell css={css({ py: 0 })} mobile>
                    {headers[header]}:{' '}
                    {isOpen ? (
                      <strong>
                        {formatNumber(
                          campaign[
                            `vaccine_administered_${header}` as keyof VaccineCampaign
                          ]
                        )}
                      </strong>
                    ) : (
                      <>
                        {formatNumber(
                          campaign[
                            `vaccine_administered_${header}` as keyof VaccineCampaign
                          ]
                        )}
                      </>
                    )}
                  </Cell>
                </tr>
              ))}

            <tr>
              <Cell
                css={css({ pb: collapsible.isOpen ? 3 : 2 })}
                colSpan={2}
                mobile
              >
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
