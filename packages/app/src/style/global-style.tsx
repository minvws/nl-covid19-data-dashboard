import css from '@styled-system/css';
import { createGlobalStyle } from 'styled-components';
import { preset } from './preset';

const tags =
  'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video';

export const GlobalStyle = createGlobalStyle`
${tags} {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
}


html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

#__next {
  position: relative;
  overflow: hidden;
}

/*
  The default below can go once we're using components everywhere in layouts.
*/
 body {
  font-family: ${(x) => x.theme.fonts.body};
  color: ${(x) => x.theme.colors.body};
  ${css(preset.typography.body2)}

  margin: 0;
  background: #f3f3f3;
  overflow-anchor: none;
}

button {
  font-size: inherit;
  font-family: ${(x) => x.theme.fonts.body};
}

img,
svg {
  max-width: 100%;
}


/* Remove outline from programatically focussed elements. */
[tabindex='-1']:focus {
  outline: none;
}

a {
  color: ${(x) => x.theme.colors.link};
  text-decoration: none;
}

*:focus {
  outline: 2px dotted currentColor;
  outline-offset: 0;
}

button::-moz-focus-inner {
  border: 0;
}

@media (prefers-reduced-motion) {
  html {
    scroll-behavior: auto;
  }

  * {
    transition-duration: 0 !important;
    transition: none !important;
  }
}

/**
 * overrule tippy's default font size
 */
.tippy-box.tippy-box {
  font-size: inherit;
}
`;
