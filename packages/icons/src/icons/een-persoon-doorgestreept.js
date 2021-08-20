import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const EenPersoonDoorgestreept = forwardRef(
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
        <path d="M17.4743 9.34802C18.8026 9.34802 19.5616 8.37589 19.5616 7.01491C19.5616 5.4595 18.8026 4.68179 17.4743 4.68179C16.1461 4.68179 15.3871 5.65392 15.3871 7.01491C15.3871 8.57032 16.1461 9.34802 17.4743 9.34802Z" />
        <path d="M20.3206 13.431C20.7001 14.5976 20.8899 15.9585 20.8899 17.7084V19.4582L22.0284 20.6248C22.4079 20.4303 22.5976 20.0415 22.5976 19.6526C22.7874 16.5418 22.9771 11.2923 20.3206 10.5146C18.8026 10.1257 16.5256 10.1257 14.8178 10.5146C14.0588 10.709 13.6793 11.0979 13.2998 11.6812L20.3206 18.8749V13.431Z" />
        <path d="M8.7458 8.57031L26.5824 26.8464L25.0644 28.2074L20.1309 23.1523V31.3182C18.9924 31.3182 18.0436 30.5405 17.8539 29.1795L17.4744 20.8192C17.4744 20.8192 17.4744 20.6247 17.2846 20.6247C17.0949 20.6247 17.0949 20.8192 17.0949 20.8192C17.0949 21.0136 16.7154 29.1795 16.7154 29.1795C16.7154 30.5405 15.7666 31.3182 14.4383 31.3182V16.9306L13.8691 16.3474V21.208C13.2998 21.208 12.3511 20.8192 12.3511 19.4582C12.3511 19.0243 12.3318 18.5509 12.3117 18.0568C12.2687 17.0012 12.2218 15.8515 12.3511 14.792L7.41754 9.73687L8.7458 8.57031Z" />
      </svg>
    );
  }
);

EenPersoonDoorgestreept.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

EenPersoonDoorgestreept.displayName = 'EenPersoonDoorgestreept';

export default EenPersoonDoorgestreept;
