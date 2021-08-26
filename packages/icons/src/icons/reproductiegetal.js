import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Reproductiegetal = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 16 36"
      fill="#000"
      {...rest}
    >
      <path d="M3.93277 12.1402V18.4512H6.0835C7.12814 18.4512 7.96795 18.1463 8.60293 17.5366C9.23791 16.9268 9.5554 16.1037 9.5554 15.0671C9.5554 14.0915 9.25839 13.3598 8.66438 12.872C8.07037 12.3841 7.09742 12.1402 5.74553 12.1402H3.93277ZM3.99422 21.5305V29H0V9H6.02205C8.60293 9 10.5283 9.52846 11.7983 10.5854C13.0887 11.6423 13.734 12.9837 13.734 14.6098C13.734 15.9512 13.4062 17.1301 12.7508 18.1463C12.0953 19.1423 11.2145 19.8943 10.1084 20.4024L15.4545 29H10.7537L6.36002 21.5305H3.99422Z" />
    </svg>
  );
});

Reproductiegetal.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Reproductiegetal.displayName = 'Reproductiegetal';

export default Reproductiegetal;
