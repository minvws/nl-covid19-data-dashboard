import css from '@styled-system/css';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';

interface narrowInfectedTableProps {
  data: {
    country_code: string;
    infected: number;
    infected_per_100k_average: number;
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  }[];
}

export function NarrowInfectedTable({ data }: narrowInfectedTableProps) {
  return (
    <Box borderTop="1px solid silver">
      {Array(10)
        .fill(0)
        .map((item, index) => (
          <Box borderBottom="1px solid silver" py={3} key={index}>
            <InlineText fontWeight="bold">Duitsland</InlineText>
            <Box display="flex" pr={3}>
              <Text
                mb={0}
                css={css({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                })}
              >
                Per 100.000 inwoners:
                <InlineText fontWeight="bold" pl={3}>
                  27,9
                </InlineText>
              </Text>

              <Box
                width="100%"
                maxWidth="120px"
                ml={2}
                height="12px"
                backgroundColor="red"
                mt="6px"
              />
            </Box>

            <Box display="flex" pr={3}>
              <Text
                mb={0}
                css={css({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  pr: 'calc(120px + 0.5rem)',
                })}
              >
                Totaal afgelopen 7 dagen:
                <InlineText fontWeight="bold" pl={3}>
                  8
                </InlineText>
              </Text>
            </Box>
          </Box>
        ))}
    </Box>
  );
}
