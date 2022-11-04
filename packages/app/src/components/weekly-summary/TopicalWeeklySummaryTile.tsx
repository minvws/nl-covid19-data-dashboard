import css from '@styled-system/css';
import { colors } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import styled from 'styled-components';
// import DynamicIcon from '~/components/get-icon-by-name';
import theme from '~/style/theme';
import { Markdown } from '~/components/markdown';
import { space } from '~/style/theme';
import { BoldText } from '~/components/typography';
// import { ICONS_LIST } from '../severity-indicator-tile/constants';
import { SeverityIndicatorLabel } from '../severity-indicator-tile/components/severity-indicator-label';
import { SeverityLevels } from '../severity-indicator-tile/types';

interface TopicalWeeklySummaryProps {
  label: string | undefined;
  level: SeverityLevels;
  // name: IconName;

  // title: string;
  // dynamicSubtitle: string;
  // icon: TopicalIcon;
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
    <Box border={`1px solid ${colors.gray3}`} p={3} m={3}>
      <Box>
        <BoldText css={css({ fontSize: [3] })}>
          <Markdown content={HeadText} />
        </BoldText>

        <Box alignItems="flex-start" css={css({ gap: `0 ${space[2]}` })} display="flex" flexDirection="row">
          <Box>
            {WeeklySummaryDescription.map((iconWithText, index) => {
              iconWithText && (
                // <Box>{iconWithText?.icon}</Box>
                <TopicalThemeHeaderIcon key={index}>
                  {/* <DynamicIcon name={iconWithText.icon} /> */}
                  {/* <InlineText text={iconWithText.text} /> */}
                </TopicalThemeHeaderIcon>
              );
            })}
            {label && level && <SeverityIndicatorLabel label={label} level={level} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const TopicalThemeHeaderIcon = styled.span`
  // display: block;
  // height: 25px;
  // margin-right: 10px;
  // width: 25px;

  @media ${theme.mediaQueries.sm} {
    height: 30px;
    margin-right: 15px;
    width: 30px;
  }
`;

{
  /* <Box width={25}> */
}
{
  /* {ICONS_LIST.map(
              (icon, index) =>
                icon && (
                  <TopicalThemeHeaderIcon key={index}>
                    <DynamicIcon name={icon} />
                  </TopicalThemeHeaderIcon>
                )
            )} */
}
{
  /* </Box> */
}
{
  /* <Box width={'80%'}> */
}
{
  /* {SummaryText.map((text, index) => (
              <InlineText key={index}>{text}</InlineText>
            ))} */
}
{
  /* </Box> */
}
