import { CssFunctionReturnType } from '@styled-system/css';

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CssFunctionReturnType;
  }

  interface SVGAttributes<T> extends DOMAttributes<T> {
    css?: CssFunctionReturnType;
  }
}

declare module '@corona-dashboard/icons' {
  import { IconProps as BaseIconProps } from '@corona-dashboard/icons';

  export interface IconProps extends BaseIconProps {
    css?: CssFunctionReturnType;
  }
}
