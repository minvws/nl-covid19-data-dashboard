import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const GgdTesten = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 12 36"
      fill="#000"
      {...rest}
    >
      <path d="M11.0083 6H0.47924C-0.0965674 6 -0.219955 6.95172 0.47924 7.15C0.849402 7.26897 1.34295 7.34828 1.67198 7.42759V7.58621V25.0345C1.67198 27.2155 3.52279 29 5.78489 29C8.04699 29 9.8978 27.2155 9.8978 25.0345V7.58621V7.46724C10.2268 7.38793 10.6793 7.26897 11.0905 7.18966C11.7075 6.95172 11.5841 6 11.0083 6ZM3.27602 7.58621H8.21151V13.931H4.0986H3.27602V7.58621ZM6.68973 24.5586C6.23731 25.8672 5.16796 26.7 4.34538 26.4621C3.52279 26.1845 3.23489 24.9155 3.72844 23.5672C4.05747 22.6552 4.67441 21.981 5.29134 21.7431L7.18328 16.4293L8.25264 17.8172L6.68973 22.219C6.97764 22.7741 7.01877 23.6466 6.68973 24.5586Z" />
    </svg>
  );
});

GgdTesten.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

GgdTesten.displayName = 'GgdTesten';

export default GgdTesten;
