import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const BasisregelsTesten = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke={color}
        {...rest}
      >
        <path
          d="M21.7045 24.0422C21.8072 23.5749 22.4543 23.5954 22.3721 22.9484C22.331 22.6402 22.0742 22.5529 21.9253 22.5221C22.0948 22.4348 22.3053 22.2089 22.3567 21.9316C22.3926 21.7261 22.3567 21.5002 22.1872 21.3923C21.7148 21.0893 21.725 20.6015 21.725 20.6015L23.014 19.9185C23.3838 19.6822 23.4865 19.1841 23.2451 18.8195L20.7955 16.0618C20.7185 15.7126 20.8469 15.0655 20.7955 14.7728C20.5387 13.2835 19.8352 11.6351 19.8352 11.6351C20.6517 10.079 20.2512 8.69248 19.0238 7.90163C17.627 7.00293 12.5789 6.91049 8.86598 8.92871C4.94766 11.0599 5.3739 15.0296 6.03123 17.0221C6.79641 19.3433 9.05085 22.63 9.21005 25.1052C9.28194 26.1939 8.48082 29.6501 8.48082 29.6501H17.2521V27.2005C17.2521 27.2005 15.0336 26.1272 14.9309 26.0553C14.8282 25.9834 14.859 25.9012 14.8693 25.8755C14.8693 25.8755 18.0583 26.5431 19.2908 26.7332C20.2563 26.8821 21.0831 26.6253 21.4888 26.1785C22.3207 25.2644 21.6018 24.5147 21.7045 24.0422Z"
          fill="currentColor"
        />
        <path
          d="M30.2549 27.3288C30.0598 27.1336 27.1994 24.2526 27.1994 24.2526C27.1429 24.3348 27.1121 24.3605 27.0556 24.3759C27.0248 24.3862 26.9375 24.2989 26.9529 24.2732C26.9785 24.2218 27.0504 24.1448 27.0761 24.0421C27.0761 23.8778 27.1839 23.8932 26.7526 23.4258C26.5523 23.2102 24.8576 21.5103 24.6676 21.3203C24.457 21.1098 24.1695 20.8068 23.8254 21.1457C23.4813 21.4898 23.7381 21.7825 23.9897 22.0342C24.1951 22.2447 25.8744 23.9188 26.1004 24.1345C26.5882 24.5916 26.578 24.4889 26.7834 24.4118C26.7834 24.4118 29.7311 27.375 29.9725 27.6163C30.2138 27.8577 30.3011 27.7396 30.3525 27.6882C30.409 27.6317 30.4449 27.5188 30.2549 27.3288Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

BasisregelsTesten.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BasisregelsTesten.displayName = 'BasisregelsTesten';

export default BasisregelsTesten;
