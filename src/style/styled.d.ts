import { CSSProp } from "styled-components";

declare module "react" {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
  }

  interface SVGAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
  }
}
