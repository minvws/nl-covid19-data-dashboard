import shouldForwardProp from '@styled-system/should-forward-prop';

type StyledShouldForwardPropType = (prop: string | number) => boolean;

export const StyledShouldForwardProp = shouldForwardProp as StyledShouldForwardPropType;
