import css from '@styled-system/css';
import { useRouter } from 'next/router';
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
          <HeaderCell mobile>{headers.vaccine}</HeaderCell>
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
  headers: VaccineCampaignHeaders;
  isFirst: boolean;
  isLast: boolean;
}

const VaccineCampaignRow = ({
  campaign,
  campaignDescriptions,
  headers,
  isFirst,
  isLast,
}: VaccineCampaignRowProps) => {
  const { formatNumber } = useIntl();
  const collapsible = useCollapsible({ isOpen: isFirst });
  const isOpen = collapsible.isOpen;
  const { locale = 'nl' } = useRouter();

  return (
    <Row isLast={isLast} isOpen={isOpen} onClick={() => collapsible.toggle()}>
      <Cell css={css({ p: 0 })}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell css={css({ pt: 3 })} mobile>
                <strong>
                  {locale === 'nl'
                    ? campaign.vaccine_campaign_name_nl
                    : campaign.vaccine_campaign_name_en}
                </strong>
              </Cell>

              <Cell css={css({ pt: 3 })} alignRight mobile>
                {collapsible.button()}
              </Cell>
            </tr>

            <tr>
              <Cell css={css({ py: 0 })} mobile>
                {headers.last_week}:{' '}
                {isOpen ? (
                  <strong>
                    {formatNumber(campaign.vaccine_administered_last_week)}
                  </strong>
                ) : (
                  <>{formatNumber(campaign.vaccine_administered_last_week)}</>
                )}
              </Cell>
            </tr>

            <tr>
              <Cell css={css({ py: 0 })} mobile>
                {headers.total}:{' '}
                {isOpen ? (
                  <strong>
                    {formatNumber(campaign.vaccine_administered_total)}
                  </strong>
                ) : (
                  <>{formatNumber(campaign.vaccine_administered_total)}</>
                )}
              </Cell>
            </tr>

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
                          .replace(/ /g, '_')}_description`
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
