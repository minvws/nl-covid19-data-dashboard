import css from "@styled-system/css"
import { isDefined } from "ts-is-present"
import { styleFn } from 'styled-system';

export interface TextTransformProps {
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit';
}

export const textTransform: styleFn = (x: TextTransformProps) => {
  if (isDefined(x.textTransform)) {
    return css({
      textTransform: x.textTransform
    })
  }
} 