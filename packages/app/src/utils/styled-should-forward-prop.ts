import shouldForwardProp from '@styled-system/should-forward-prop';

type StyledShouldForwardProp = (prop: string | number) => boolean;

export const styledShouldForwardProp = shouldForwardProp as StyledShouldForwardProp;
