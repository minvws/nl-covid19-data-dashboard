import css from '@styled-system/css';
import { isEmpty } from 'lodash';
import Head from 'next/head';
import { ReactNode } from 'react';
import Arts from '~/assets/arts-small.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import Repro from '~/assets/reproductiegetal-small.svg';
import Ziekenhuis from '~/assets/ziekenhuis-small.svg';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { Text } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

/*
  @TODO Connect with data
*/
const reproduction_is_below_threshold = false;
const reproduction_threshold_day_span = 14;

const intensive_care_nice_is_below_threshold = true;
const intensive_care_nice_threshold_day_span = 14;

const hospital_nice_is_below_threshold = false;
const hospital_nice_threshold_day_span = 14;

const Afschaling = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated } = props;

  return (
    <Layout {...siteText.over_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <div>
        <MaxWidth>
          {!isEmpty(
            siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
          ) && (
            <Box mb={3}>
              <WarningTile
                message={
                  siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
                }
                variant="emphasis"
              />
            </Box>
          )}

          <Box
            display="grid"
            gridTemplateColumns={{ _: undefined, md: 'repeat(3, 1fr)' }}
            css={css({ columnGap: 5 })}
            mb={5}
          >
            <MiniTrend
              title={siteText.afschaling.trend_grafieken.reproductiegetal}
              icon={Repro()}
              isBelowThreshold={reproduction_is_below_threshold}
              thresholdDaySpan={reproduction_threshold_day_span}
            >
              <p>Hier komt de grafiek</p>
            </MiniTrend>

            <MiniTrend
              title={siteText.afschaling.trend_grafieken.ic_opnames}
              icon={Arts()}
              isBelowThreshold={intensive_care_nice_is_below_threshold}
              thresholdDaySpan={intensive_care_nice_threshold_day_span}
            >
              <p>Hier komt de grafiek</p>
            </MiniTrend>

            <MiniTrend
              title={siteText.afschaling.trend_grafieken.ziekenhuisopnames}
              icon={Ziekenhuis()}
              isBelowThreshold={hospital_nice_is_below_threshold}
              thresholdDaySpan={hospital_nice_threshold_day_span}
            >
              <p>Hier komt de grafiek</p>
            </MiniTrend>
          </Box>
        </MaxWidth>
      </div>
    </Layout>
  );
};

interface MiniTrendProps {
  title: string;
  icon: ReactNode;
  isBelowThreshold: boolean;
  thresholdDaySpan: number;
  children: ReactNode;
}

function MiniTrend({
  title,
  icon,
  isBelowThreshold,
  thresholdDaySpan,
  children,
}: MiniTrendProps) {
  const { siteText } = useIntl();

  return (
    <Box mb={{ _: 3, md: 0 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={25}>{icon}</Box>
        <Text fontWeight="bold" mb={0}>
          {title}
        </Text>
      </Box>
      <Box display="flex" mb={3}>
        <Box
          height={18}
          minWidth={18}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={isBelowThreshold ? 'cerulean' : 'red'}
          mr={2}
          mt="2px"
          borderRadius="50%"
          css={css({
            svg: {
              padding: '2px',
            },
            path: {
              fill: 'white',
            },
          })}
        >
          {isBelowThreshold ? (
            <IconDown />
          ) : (
            <Box width={8} height={2} bg="white" />
          )}
        </Box>
        <Text mb={0}>
          {isBelowThreshold
            ? replaceVariablesInText(
                siteText.afschaling.trend_grafieken.grenswaarde_minder,
                {
                  days: thresholdDaySpan,
                }
              )
            : siteText.afschaling.trend_grafieken.grenswaarde_meer}
        </Text>
      </Box>
      {children}
    </Box>
  );
}

export default Afschaling;
