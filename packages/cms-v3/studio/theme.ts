import { colors } from '@corona-dashboard/common';

const removeHash = (input: string) => input.replace(/#/g, '');

const themeColors = {
  primary: removeHash(colors.primary),
  positive: removeHash(colors.green1),
  caution: removeHash(colors.yellow3),
  critical: removeHash(colors.red2),
};

export const { theme } = (await import(
  // The below colours are used inside the COVID-19 dashboard, meaning that these are consistent between Sanity and the actual website.
  `https://themer.sanity.build/api/hues?primary=${themeColors.primary}&positive=${themeColors.positive};400&caution=${themeColors.caution};300&critical=${themeColors.critical}`
)) as { theme: import('sanity').StudioTheme };
