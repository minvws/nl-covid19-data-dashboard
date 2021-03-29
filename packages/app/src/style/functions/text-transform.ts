import css from "@styled-system/css";
import { styleFn, ResponsiveValue } from 'styled-system';
import { isDefined } from "ts-is-present";
import { asResponsiveArray } from '../utils';
export interface TextTransformProps {
  textTransform?: ResponsiveValue<'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit'>;
}

export const textTransform: styleFn = (x: TextTransformProps) => {
  if (isDefined(x.textTransform)) {
    const value = asResponsiveArray(x.textTransform);

    return css({
      textTransform: value
    })
  }
}