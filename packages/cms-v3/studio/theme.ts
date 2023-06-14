export const { theme } = (await import(
  // The below colours are used inside the COVID-19 dashboard, meaning that these are consistent between Sanity and the actual website.
  // However, these can not be dynamically appended to the URL.
  // The below TODO is imported as such from themer.sanity.build.

  // @ts-expect-error -- TODO setup themer.d.ts to get correct typings
  'https://themer.sanity.build/api/hues?primary=007bc7&positive=69c253&caution=ffc000&critical=f35065'
)) as { theme: import('sanity').StudioTheme };
