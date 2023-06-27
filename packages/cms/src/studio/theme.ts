export const { theme } = (await import('https://themer.sanity.build/api/hues?primary=007bc7&positive=69c253&caution=ffc000&critical=f35065')) as {
  theme: import('sanity').StudioTheme;
};
