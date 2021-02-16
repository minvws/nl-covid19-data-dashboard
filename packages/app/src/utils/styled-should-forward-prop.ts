import shouldForwardProp from '@styled-system/should-forward-prop';

/**
 * Not sure why we need to cast to any here. Apparently styled-components is not
 * compatible with this function signature.
 *
 * Maybe look into this later https://github.com/styled-components/styled-components/pull/3006
 */
export const styledShouldForwardProp = shouldForwardProp as any;
