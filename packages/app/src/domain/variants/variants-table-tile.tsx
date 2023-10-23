import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Markdown } from '~/components/markdown';
import { MetadataProps } from '~/components/metadata';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { fontSizes, space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { VariantsTable } from './variants-table-tile/components/variants-table';
import { TableText } from './variants-table-tile/types';
import { Tile } from '~/components';
import { VariantRow } from '~/domain/variants/data-selection/types';

interface VariantsTableTileProps {
  text: TableText;
  noDataMessage?: ReactNode;
  data?: VariantRow[] | null;
  sampleThresholdPassed: boolean;
  source: {
    download: string;
    href: string;
    text: string;
  };
  dates: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_report_unix: number;
  };
  children?: ReactNode;
}

export function VariantsTableTile({ text, noDataMessage = '', sampleThresholdPassed, source, data, dates, children = null }: VariantsTableTileProps) {
  if (!isPresent(data) || !isPresent(dates)) {
    return (
      <FullscreenChartTile>
        <Heading level={3}>{text.titel}</Heading>
        <Box maxWidth="maxWidthText">
          <Markdown content={text.omschrijving_zonder_placeholders} />
        </Box>

        {children}

        <Box overflow="auto" marginBottom={space[3]} marginTop={space[4]}>
          <NoDataBox>{noDataMessage}</NoDataBox>
        </Box>
      </FullscreenChartTile>
    );
  }

  return (
    <VariantsTableTileWithData text={text} sampleThresholdPassed={sampleThresholdPassed} source={source} data={data} dates={dates}>
      {children}
    </VariantsTableTileWithData>
  );
}

interface VariantsTableTileWithDataProps {
  text: TableText;
  data: VariantRow[];
  sampleThresholdPassed: boolean;
  source: {
    download: string;
    href: string;
    text: string;
  };
  dates: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_report_unix: number;
  };
  children?: ReactNode;
}

function VariantsTableTileWithData({ text, sampleThresholdPassed, source, data, dates, children = null }: VariantsTableTileWithDataProps) {
  const { formatDateSpan } = useIntl();

  const metadata: MetadataProps = {
    date: { start: dates.date_start_unix, end: dates.date_end_unix },
    source,
    obtainedAt: dates.date_of_report_unix,
  };

  const [date_start, date_end] = formatDateSpan({ seconds: dates.date_start_unix }, { seconds: dates.date_end_unix });

  const descriptionText = replaceVariablesInText(text.omschrijving, {
    date_start,
    date_end,
  });

  return (
    <>
      {sampleThresholdPassed ? (
        <ChartTile metadata={metadata} title={text.titel} description={descriptionText}>
          {children}
          <Box overflow="auto" marginBottom={space[3]} marginTop={space[4]}>
            <VariantsTable rows={data} text={text} />
          </Box>
        </ChartTile>
      ) : (
        <Tile>
          <Box spacing={3}>
            <Heading level={3}>{text.titel}</Heading>
            <Box maxWidth="400px" fontSize={fontSizes[2]} lineHeight={2}>
              <Markdown content={text.description} />
            </Box>
          </Box>
        </Tile>
      )}
    </>
  );
}

const NoDataBox = styled.div(
  css({
    width: '100%',
    display: 'flex',
    height: '8em',
    color: 'gray5',
    justifyContent: 'center',
    alignItems: 'center',
  })
);
