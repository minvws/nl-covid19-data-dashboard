import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowVariantsTable, WideVariantsTable } from './components';
import { VariantRow } from './logic/use-variants-table-data';

export function VariantsTableTile({
  data,
  dates,
}: {
  data: VariantRow[];
  dates: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  };
}) {
  const { siteText } = useIntl();

  const text = siteText.covid_varianten;

  const breakpoints = useBreakpoints();

  const metadata: MetadataProps = {
    date: [dates.date_start_unix, dates.date_end_unix],
    source: text.bronnen.rivm,
    obtained: dates.date_of_insertion_unix,
  };

  return (
    <Tile>
      <Heading level={3}>{text.varianten_tabel.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{text.varianten_tabel.omschrijving}</Text>
      </Box>

      {text.varianten_tabel.belangrijk_bericht && (
        <WarningTile
          message={text.varianten_tabel.belangrijk_bericht}
          variant="emphasis"
        />
      )}

      <Box overflow="auto" mb={3} mt={4}>
        <ErrorBoundary>
          {breakpoints.sm ? (
            <WideVariantsTable rows={data} text={text} />
          ) : (
            <NarrowVariantsTable rows={data} text={text} />
          )}
        </ErrorBoundary>
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}
