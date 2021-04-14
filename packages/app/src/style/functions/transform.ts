import css from "@styled-system/css";
import { styleFn, ResponsiveValue } from 'styled-system';
import { isDefined } from "ts-is-present";
import { asResponsiveArray } from '../utils';

export interface TransformProps {
  transform?: ResponsiveValue<string>;
  transformOrigin?: ResponsiveValue<string>;
}

export const transform: styleFn = (x: TransformProps) => {
  if (isDefined(x.transform) || isDefined(x.transformOrigin)) {
    const transformValue = asResponsiveArray(x.transform);
    const transformOriginValue = asResponsiveArray(x.transformOrigin);

    return css({
      transform: transformValue,
      transformOrigin:transformOriginValue
    })
  }
}