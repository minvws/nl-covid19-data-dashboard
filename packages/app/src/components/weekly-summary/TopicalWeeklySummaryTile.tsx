import css from '@styled-system/css';
import { colors } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import DynamicIcon from '~/components/get-icon-by-name';
import { Markdown } from '~/components/markdown';
import { space } from '~/style/theme';
import { BoldText, InlineText } from '~/components/typography';
import { SeverityIndicatorLabel } from '../severity-indicator-tile/components/severity-indicator-label';
import { IconName } from '@corona-dashboard/icons/src/icon-name2filename';
import { SeverityLevels } from '../severity-indicator-tile/types';
import theme from '~/style/theme';
import styled from 'styled-components';
interface TopicalWeeklySummaryProps {
  label: string | undefined;
  level: SeverityLevels;
  text: string;
  icon: IconName;
  iconWithText: any;
  name: IconName;
}

export const TopicalWeeklySummaryTile = ({ label, level }: TopicalWeeklySummaryProps) => {
  const HeadText = 'Weeksamenvatting 10 t/m 16 oktober';
  const WeeklySummaryDescription = [
    {
      icon: 'Eye',
      text: 'De verspreiding van het virus zet zich verder door. We zitten in de najaarsgolf.',
    },
    {
      icon: 'MedischeScreening',
      text: 'Het aantal COVID-patiënten dat in het ziekenhuis wordt opgenomen blijft stijgen. Het aantal bezette bedden op de verpleegafdeling is op dit moment zo goed als gelijk aan het niveau van de piek van de zomergolf.',
    },
    {
      icon: 'Coronathermometer',
      text: 'Op basis van bovenstaande ontwikkelingen staat de Coronathermometer op stand',
    },
  ];
  // console.log('RRR', WeeklySummaryDescription);
  // const ICONS_LIST = ['Eye', 'MedischeScreening', 'Coronathermometer'];
  // const SummaryText = ['De verspreiding van het virus zet zich verder door. We zitten in de najaarsgolf.', 'gj;sjg;skgl;skgl;sd', 'efljalfjldf'];
  // const TopicalWeeklySummaryText = SummaryText.map((text, index) => <InlineText key={index}>{text}</InlineText>);
  // console.log(TopicalWeeklySummaryText, 'DDD');
  // const DynamicIcon = icons[name];
  // const element = WeeklySummaryDescription.map((iconWithText, index) => {

  return (
    <Box px={3} maxWidth={930}>
      <Box border={`1px solid ${colors.gray3}`} p={4} m={3}>
        <Box>
          <BoldText css={css({ fontSize: [3] })}>
            <Markdown content={HeadText} />
          </BoldText>

          <Box pt={2} display="flex" flexWrap="wrap" css={css({ gap: `0 ${space[2]}` })}>
            {WeeklySummaryDescription.map((iconWithText, index) => {
              return (
                <>
                  <Box display="flex" css={css({ gap: `0 ${space[3]}` })} alignItems="center">
                    {/* <Box key={index} width={25} height={25} maxWidth="none"> */}
                    <TopicalThemeHeaderIcon key={index}>
                      <DynamicIcon width={25} name={iconWithText.icon} />
                    </TopicalThemeHeaderIcon>
                    {/* </Box> */}
                    <Box>
                      <InlineText>{iconWithText.text}</InlineText>
                    </Box>
                  </Box>
                </>
              );
            })}
            <Box>
              <SeverityIndicatorLabel label={label} level={level} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const TopicalThemeHeaderIcon = styled.span`
  display: block;
  height: 25px;
  // margin-right: 10px;
  width: 25px;

  @media ${theme.mediaQueries.sm} {
    height: 30px;
    margin-right: 15px;
    width: 30px;
  }
`;
