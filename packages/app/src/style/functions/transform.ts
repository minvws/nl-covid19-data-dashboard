import css from "@styled-system/css";
import { styleFn, ResponsiveValue } from 'styled-system';
import { isDefined } from "ts-is-present";
import { asResponsiveArray } from '../utils';

export interface TransformProps {
  transform?: ResponsiveValue<string>;
  transformOrigin?: ResponsiveValue<string>;
  transformBox?: ResponsiveValue<'content-box' | 'border-box' | 'fill-box' | 'stroke-box' | 'view-box'>;
  transformStyle?: ResponsiveValue<'preserve-3d' | 'flat'>;
}

export const transform: styleFn = (x: TransformProps) => {
  if (isDefined(x.transform) || isDefined(x.transformOrigin) || isDefined(x.transformBox) || isDefined(x.transformStyle)) {
    const transformValue = asResponsiveArray(x.transform);
    const transformOriginValue = asResponsiveArray(x.transformOrigin);
    const transformBox = asResponsiveArray(x.transformBox);
    const transformStyle = asResponsiveArray(x.transformStyle);

    return css({
      transform: transformValue,
      transformOrigin:transformOriginValue,
      transformBox: transformBox,
      transformStyle: transformStyle
    })
  }
}