import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Sterfte = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M37.206 17.065a2.018 2.018 0 012.64 1.097 2.013 2.013 0 01-1.109 2.638 2.002 2.002 0 01-2.004-.275l-.005.005a.075.075 0 00-.01-.008 2.091 2.091 0 01-.656-.896c-.041.006-.179.046-.133.266l.28.862-3.77 1.587a8.18 8.18 0 01-.112 4.4l1.964.975c.013.007.022.014.031.02l.005.005.01.006a2.01 2.01 0 011.999-.327 2.033 2.033 0 011.165 2.623 2.023 2.023 0 01-2.615 1.169 2.02 2.02 0 01-1.267-1.587h-.005c-.005-.01-.005-.02-.005-.026-.077-.54.091-.963.133-1.068a.283.283 0 00.01-.024c-.036-.025-.163-.086-.28.102l-.392.817-1.582-.828a8.181 8.181 0 01-3.007 2.934l1.791 4.384a.092.092 0 01.005.025.15.15 0 00.005.026 2.018 2.018 0 011.613 1.23 2.029 2.029 0 01-1.094 2.648 2.018 2.018 0 01-2.365-3.108l-.005-.005a.07.07 0 00.007-.01l.004-.006.004-.005a2.086 2.086 0 01.885-.648c-.005-.04-.046-.178-.265-.132l-.86.28-1.592-3.908a8.165 8.165 0 01-2.182.306 8.04 8.04 0 01-2.055-.276l-.97 2.013a.16.16 0 01-.02.032.236.236 0 00-.01.014 2.03 2.03 0 01.275 2.01 2.017 2.017 0 01-2.64 1.097 2.027 2.027 0 01-1.094-2.648c.29-.7.916-1.138 1.613-1.23v-.005h.025c.535-.068.95.112 1.058.158.014.006.023.01.026.01.02-.03.091-.158-.097-.28l-.804-.413.755-1.493a8.16 8.16 0 01-3.128-3.016l-4.304 1.781a.16.16 0 01-.026.006.138.138 0 00-.025.005 2.022 2.022 0 01-1.226 1.617 2.018 2.018 0 01-2.64-1.097 2.03 2.03 0 011.093-2.648 2.002 2.002 0 012.005.275l.005-.005a.064.064 0 00.01.008l.01.007c.417.33.587.745.633.859a.262.262 0 00.013.03c.041-.006.178-.047.133-.266l-.28-.863 3.77-1.556a8.212 8.212 0 01-.117-4.348l-2.16-.855c-.013-.007-.022-.014-.031-.02a.287.287 0 00-.014-.01 2.01 2.01 0 01-2 .326 2.033 2.033 0 01-1.165-2.623 2.023 2.023 0 012.615-1.169 2.02 2.02 0 011.267 1.587h.005c.005.01.005.02.005.026.077.54-.092.963-.133 1.068a.283.283 0 00-.01.024c.036.026.163.087.28-.102l.392-.816 1.656.66a8.256 8.256 0 013.22-3.342l-1.694-4.056a.16.16 0 01-.005-.026l-.005-.026a2.018 2.018 0 01-1.613-1.23 2.029 2.029 0 011.094-2.648 2.018 2.018 0 012.365 3.108l.005.005a.07.07 0 00-.007.01c-.003.004-.005.008-.008.01a2.085 2.085 0 01-.856.636.163.163 0 00-.03.013c.006.04.047.178.265.132l.865-.28 1.49 3.566a8.24 8.24 0 014.534.031l1.03-1.8a.189.189 0 01.02-.031.291.291 0 00.01-.014 2.03 2.03 0 01-.274-2.011 2.017 2.017 0 012.64-1.097 2.033 2.033 0 011.094 2.653c-.29.7-.916 1.138-1.613 1.23v.005h-.026a2.032 2.032 0 01-1.083-.168c-.02.03-.092.158.097.28l.803.414-.841 1.35a8.184 8.184 0 013.123 3.256l4.192-1.76a.06.06 0 01.006-.002l.007-.001a.263.263 0 01.013-.002l.025-.005c.092-.7.534-1.332 1.226-1.618zm-16.54 5.13c.76 0 1.374-.623 1.374-1.39 0-.768-.615-1.39-1.373-1.39-.76 0-1.374.622-1.374 1.39 0 .767.615 1.39 1.373 1.39zm8.922 5.221c0 .576-.462 1.043-1.03 1.043-.57 0-1.03-.467-1.03-1.043 0-.575.46-1.042 1.03-1.042.568 0 1.03.467 1.03 1.042zm-.687-3.131c.758 0 1.373-.622 1.373-1.39 0-.768-.615-1.39-1.373-1.39-.759 0-1.374.622-1.374 1.39 0 .768.615 1.39 1.374 1.39zm-8.214 2.437c0 .576-.461 1.042-1.03 1.042s-1.03-.466-1.03-1.042c0-.576.461-1.043 1.03-1.043s1.03.467 1.03 1.043zm5.146-6.612c.569 0 1.03-.467 1.03-1.043 0-.576-.461-1.042-1.03-1.042-.57 0-1.03.466-1.03 1.042 0 .576.46 1.043 1.03 1.043zm.366 3.48c0 1.152-.923 2.085-2.06 2.085-1.139 0-2.06-.933-2.06-2.085s.921-2.085 2.06-2.085c1.137 0 2.06.933 2.06 2.085zm-1.738 6.96c.948 0 1.717-.778 1.717-1.737 0-.96-.769-1.738-1.717-1.738-.948 0-1.717.778-1.717 1.738s.769 1.737 1.717 1.737z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

Sterfte.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Sterfte.displayName = 'Sterfte';

export default Sterfte;
