import css from '@styled-system/css';
import { maxBy } from 'lodash';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { colors } from '~/style/theme';

type singleItem = {
  country_code: string;
  infected: number;
  infected_per_100k_average: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
};
interface narrowInfectedTableProps {
  data: singleItem[];
  isExpanded: boolean;
  matchedItems: any[];
}

const MAX_COUNTRIES = 5;

export function NarrowInfectedTable({
  data,
  isExpanded,
  matchedItems,
}: narrowInfectedTableProps) {
  const highestAverage = maxBy(data, (x) => x.infected_per_100k_average);

  return (
    <Box borderTop="1px solid silver">
      {data.map((item, index) => (
        <>
          {matchedItems.length > data.length ? (
            <>
              {isExpanded || index < MAX_COUNTRIES ? (
                <ItemRow
                  item={item}
                  highestAverage={highestAverage?.infected_per_100k_average}
                />
              ) : null}
            </>
          ) : (
            <>
              {matchedItems.includes(item.country_code) && (
                <ItemRow
                  item={item}
                  highestAverage={highestAverage?.infected_per_100k_average}
                />
              )}
            </>
          )}
        </>
      ))}
    </Box>
  );
}

interface itemRowProps {
  item: singleItem;
  highestAverage: number | undefined;
}

function ItemRow({ item, highestAverage }: itemRowProps) {
  return (
    <Box
      borderBottom="1px solid silver"
      py={3}
      px={2}
      backgroundColor={
        item.country_code === 'NLD' ? colors.tileGray : undefined
      }
    >
      <InlineText fontWeight="bold">Land: {item.country_code}</InlineText>
      <Box display="flex">
        <Text
          mb={0}
          css={css({
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          })}
        >
          Per 100.000 inwoners:
          <InlineText fontWeight="bold" px={{ _: 2, xs: 3 }} textAlign="right">
            {item.infected_per_100k_average}
          </InlineText>
        </Text>

        {highestAverage && (
          <Box maxWidth={{ _: '5rem', xs: '6rem' }} width="100%">
            <Box
              width={`${
                (item.infected_per_100k_average / highestAverage) * 100
              }%`}
              height="12px"
              backgroundColor="red"
              mt="6px"
            />
          </Box>
        )}
      </Box>

      <Box display="flex">
        <Text
          mb={0}
          pr={{ _: '5rem', xs: '6rem' }}
          css={css({
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          })}
        >
          Totaal afgelopen 7 dagen:
          <InlineText fontWeight="bold" px={{ _: 2, xs: 3 }} textAlign="right">
            {item.infected}
          </InlineText>
        </Text>
      </Box>
    </Box>
  );
}
