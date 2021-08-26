import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Phone = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 14 36"
      fill="#000"
      {...rest}
    >
      <path d="M11.8881 6.38357C8.45286 5.87214 4.99748 5.87214 1.56219 6.38357C0.678302 6.51872 0 7.36415 0 8.22231C0 14.4074 0 20.5925 0 26.7777C4.47222e-05 27.6359 0.712023 28.4812 1.59591 28.6164C5.03121 29.1279 8.45286 29.1279 11.8881 28.6164C12.7721 28.4812 13.4167 27.6358 13.4167 26.7777C13.4167 20.5925 13.4167 14.4074 13.4167 8.22231C13.4167 7.36415 12.7721 6.51872 11.8881 6.38357ZM6.70833 27.689C6.05378 27.689 5.52319 27.1433 5.52319 26.47C5.52319 25.7968 6.05378 25.251 6.70833 25.251C7.36289 25.251 7.89347 25.7968 7.89347 26.47C7.89347 27.1433 7.36289 27.689 6.70833 27.689ZM11.6278 23.94H1.78889V9.21996H11.6278V23.94Z" />
    </svg>
  );
});

Phone.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Phone.displayName = 'Phone';

export default Phone;
