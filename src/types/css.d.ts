import { CssFunctionReturnType } from '@styled-system/css';
import {} from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CssFunctionReturnType;
  }

  interface SVGAttributes<T> extends DOMAttributes<T> {
    css?: CssFunctionReturnType;
  }
}
