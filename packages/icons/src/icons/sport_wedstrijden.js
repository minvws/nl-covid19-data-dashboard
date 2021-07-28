import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const SportWedstrijden = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke={color}
        {...rest}
      >
        <svg
          focusable="false"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6 7.34416L7.34416 6L30 28.6558L28.6558 30L24.4224 25.7666V27.1203H13.7133V23.8554C13.6919 23.4904 14.5358 23.1652 15.5816 22.7621C15.9496 22.6203 16.3426 22.4689 16.7316 22.3027C18.2263 21.6642 17.8054 19.6762 17.8054 19.6762C16.9857 19.588 16.2293 19.1942 15.6868 18.5734C14.8545 18.6132 14.0231 18.476 13.2477 18.1708C12.4723 17.8657 11.7704 17.3995 11.1884 16.803C9.71058 15.0126 8.95805 12.735 9.07573 10.4199L6 7.34416ZM10.3625 11.7067C10.5399 13.2524 11.1459 14.722 12.1171 15.9469C12.7936 16.6463 13.6804 17.105 14.6421 17.2529C14.2725 16.5998 14.0003 15.8999 13.8311 15.1753L10.3625 11.7067ZM12.81 9.67815L14.9758 11.8439V8.85103H13.7133V9.67815H12.81ZM22.0603 18.9284L15.8755 12.7436V8.85103H24.4224V9.70718H28.442C28.8193 9.70718 29.0805 9.72169 29.0805 10.3021C29.2146 12.6655 28.4412 14.9908 26.9183 16.803C26.3398 17.404 25.6385 17.8733 24.8622 18.1788C24.0859 18.4843 23.2529 18.6189 22.4199 18.5734C22.3088 18.7016 22.1885 18.8202 22.0603 18.9284ZM24.4369 13.3204V10.752H27.3391C27.6439 10.752 27.8035 10.752 27.7454 11.1583C27.6739 12.9035 27.0488 14.5806 25.9606 15.9469C25.269 16.6576 24.36 17.1172 23.3776 17.2529C24.0712 16.0583 24.4366 14.7017 24.4369 13.3204ZM14.8597 24.6535H23.1745V25.9304H14.8597V24.6535Z"
            fill="currentColor"
          />
        </svg>
      </svg>
    );
  }
);

SportWedstrijden.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SportWedstrijden.displayName = 'SportWedstrijden';

export default SportWedstrijden;
