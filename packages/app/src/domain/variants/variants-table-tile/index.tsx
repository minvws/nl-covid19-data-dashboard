import { NationalDifference, NlVariantsValue } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowVariantsTable, WideVariantsTable } from './components';
import { useVariantsTableData } from './logic/use-variants-table-data';

export function VariantsTableTile({
  data,
  differences,
}: {
  data: NlVariantsValue;
  differences: NationalDifference;
}) {
  const { siteText } = useIntl();

  const text = siteText.covid_varianten;

  const breakpoints = useBreakpoints();

  const variantsTableRows = useVariantsTableData(
    data,
    text.landen_van_herkomst,
    differences
  );

  const metadata: MetadataProps = {
    date: [data.date_start_unix, data.date_end_unix],
    source: text.bronnen.rivm,
    obtained: data.date_of_insertion_unix,
  };

  return (
    <Tile>
      <Heading level={3}>{text.varianten_tabel.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{text.varianten_tabel.omschrijving}</Text>
      </Box>

      {text.varianten_tabel.belangrijk_bericht && (
        <WarningTile
          message={replaceVariablesInText(
            text.varianten_tabel.belangrijk_bericht,
            { sample_size: data.sample_size }
          )}
          variant="emphasis"
        />
      )}

      <Box overflow="auto" mb={3} mt={4}>
        <ErrorBoundary>
          {breakpoints.sm ? (
            <WideVariantsTable rows={variantsTableRows} text={text} />
          ) : (
            <NarrowVariantsTable rows={variantsTableRows} text={text} />
          )}
        </ErrorBoundary>
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}
