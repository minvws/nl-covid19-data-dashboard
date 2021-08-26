import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const GedeeltelijkOpenRugzak = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      focusable="false"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="currentColor"
      {...rest}
    >
      <path d="M27.9942 23.3612C27.2239 16.3397 26.3758 6.00006 20.553 7.74104C16.6885 8.89655 14.8419 13.958 14.5827 18.041C14.3458 18.0568 14.179 17.7352 14.179 17.4056C14.179 8.82595 19.6673 7.08826 19.6673 7.08826C19.6673 7.08826 18.818 6.53198 17.3102 6.6381C16.7246 5.82456 15.7593 4.72048 14.4273 5.06461C13.7584 5.23741 13.2901 5.78737 13.0769 6.5041C12.8418 7.29556 12.9572 8.25291 13.3425 9.02558C13.1227 9.32476 12.9163 9.64277 12.7305 9.9882C12.0187 9.70495 10.575 9.3053 9.26283 10.0296C7.92141 10.7701 7.1674 12.4189 7.02122 14.9299C6.70915 20.3014 9.92193 24.6753 11.1873 26.1777C11.2507 26.7121 11.3171 27.1872 11.3813 27.5828C11.5172 28.4193 12.1275 29.1025 12.9496 29.3332C14.374 29.7329 16.3575 30.0746 17.2287 30.2158C17.516 30.2624 17.8077 30.2749 18.0949 30.2281C21.2313 29.716 25.0492 27.1466 26.9509 25.74C27.7005 25.1855 28.0954 24.2831 27.9942 23.3612ZM10.9176 22.9738C9.73291 21.0398 8.47886 18.2003 8.66342 15.0254C8.77223 13.1472 9.25242 11.9188 10.0514 11.473C10.7475 11.0844 11.6107 11.3179 12.0674 11.4934C10.866 14.8356 10.7272 19.3678 10.9176 22.9738ZM14.2769 6.86023C14.5658 5.8867 15.4543 6.24574 15.969 6.96546C15.4706 7.17061 14.9378 7.47716 14.3762 7.92462C14.3451 7.94935 14.3177 7.97956 14.2871 8.00508C14.1894 7.61432 14.1765 7.19778 14.2769 6.86023Z" />
    </svg>
  );
});

GedeeltelijkOpenRugzak.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

GedeeltelijkOpenRugzak.displayName = 'GedeeltelijkOpenRugzak';

export default GedeeltelijkOpenRugzak;
