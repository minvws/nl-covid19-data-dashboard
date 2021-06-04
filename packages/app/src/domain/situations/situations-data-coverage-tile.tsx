import css from '@styled-system/css';
import styled from 'styled-components';
import CheckIcon from '~/assets/check.svg';
import CloseIcon from '~/assets/close.svg';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { mockDataCoverage } from '~/domain/situations/logic/mock-data';

interface SituationsDataCoverageTileProps {
  title: string;
  descriptionEnoughCoverage: string;
  descriptionNotEnoughCoverage: string;
  dateText: string;
}

export function SituationsDataCoverageTile({
  title,
  descriptionEnoughCoverage,
  descriptionNotEnoughCoverage,
  dateText,
}: SituationsDataCoverageTileProps) {
  const { siteText, formatDateFromSeconds } = useIntl();
  const text = siteText.vr_brononderzoek.tile_coverage;

  const data = mockDataCoverage();

  return (
    <Tile>
      <Heading level={3} mb={1}>
        {title}
      </Heading>
      <CoverageIndicator hasSufficientData={data.has_sufficient_data}>
        <IndicatorCircle hasSufficientData={data.has_sufficient_data}>
          {data.has_sufficient_data ? <CheckIcon /> : <CloseIcon />}
        </IndicatorCircle>
        {data.has_sufficient_data
          ? text.title_enough_coverage
          : text.title_not_enough_coverage}
      </CoverageIndicator>
      <Text>
        {replaceComponentsInText(
          data.has_sufficient_data
            ? descriptionEnoughCoverage
            : descriptionNotEnoughCoverage,
          {
            date_text: (
              <InlineText fontWeight="bold">
                {replaceComponentsInText(dateText, {
                  date_start_unix: (
                    <InlineText>
                      {formatDateFromSeconds(data.date_start_unix)}
                    </InlineText>
                  ),
                  date_end_unix: (
                    <InlineText>
                      {formatDateFromSeconds(data.date_end_unix)}
                    </InlineText>
                  ),
                })}
              </InlineText>
            ),
          }
        )}
      </Text>
    </Tile>
  );
}

const CoverageIndicator = styled.div<{ hasSufficientData: boolean }>((x) =>
  css({
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 3,
    fontSize: 3,
    fontWeight: 600,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: x.hasSufficientData ? 'data.primary' : 'gray',
  })
);

const IndicatorCircle = styled.div<{ hasSufficientData: boolean }>((x) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    mr: 2,
    mb: 1,
    borderRadius: '50%',
    backgroundColor: x.hasSufficientData ? 'data.primary' : 'gray',
    color: 'white',

    svg: {
      p: x.hasSufficientData ? undefined : '2px',
      mt: x.hasSufficientData ? '1px' : undefined,
    },
  })
);
