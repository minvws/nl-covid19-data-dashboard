import { isEmpty } from 'lodash';
import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { WarningTile } from '~/components-styled/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { ReactNode } from 'react';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import Repro from '~/assets/reproductiegetal-small.svg';
import { Text } from '~/components-styled/typography';
import IconDown from '~/assets/pijl-omlaag.svg';
import css from '@styled-system/css';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { asResponsiveArray } from '~/style/utils';

import Arts from '~/assets/arts-small.svg';
import Ziekenhuis from '~/assets/ziekenhuis-small.svg';
export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

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
              title="Reproductiegetal"
              icon={Repro()}
              is_below_threshold={reproduction_is_below_threshold}
              threshold_day_span={reproduction_threshold_day_span}
            >
              <p>Hier komt de grafiek</p>
            </MiniTrend>

            <MiniTrend
              title="IC-opnames"
              icon={Arts()}
              is_below_threshold={intensive_care_nice_is_below_threshold}
              threshold_day_span={intensive_care_nice_threshold_day_span}
            >
              <p>Hier komt de grafiek</p>
            </MiniTrend>

            <MiniTrend
              title="Ziekenhuisopnames (incl. IC)"
              icon={Ziekenhuis()}
              is_below_threshold={hospital_nice_is_below_threshold}
              threshold_day_span={hospital_nice_threshold_day_span}
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
  is_below_threshold: boolean;
  threshold_day_span: number;
  children: ReactNode;
}

function MiniTrend({
  title,
  icon,
  is_below_threshold,
  threshold_day_span,
  children,
}: MiniTrendProps) {
  const descriptionTrue =
    'Waarde is minder dan {{days}} dagen onder de grenswaarde';
  const descriptionFalse = 'Grenswaarde is overschreden';

  return (
    <Box mb={{ _: 3, md: 0 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={25} display="flex" mt="-5px">
          {icon}
        </Box>
        <Text fontWeight="bold" mb={0}>
          {title}
        </Text>
      </Box>
      <Box display="flex" mb={3}>
        <Box
          height={18}
          width={18}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={is_below_threshold ? '#0390D6' : 'red'}
          css={css({
            svg: {
              padding: '2px',
            },
            path: {
              fill: 'white',
            },
          })}
          mr={1}
          mt="2px"
          borderRadius="50%"
        >
          {is_below_threshold ? (
            <IconDown />
          ) : (
            <Box width={8} height={2} bg="white" />
          )}
        </Box>
        <Text mb={0}>
          {is_below_threshold
            ? replaceVariablesInText(descriptionTrue, {
                days: threshold_day_span,
              })
            : descriptionFalse}
        </Text>
      </Box>
      {children}
    </Box>
  );
}

export default Afschaling;
