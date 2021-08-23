import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Hospitality = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="currentColor"
      {...rest}
    >
      <path d="M27.7176 18.084C27.7176 17.4138 27.0474 16.7436 26.3772 16.7436H23.6964C24.0315 16.7436 24.3666 16.4085 24.5342 16.0734L25.2044 8.86881C25.2044 8.70126 25.2044 8.70126 25.0368 8.53371C24.8693 8.36617 24.8693 8.36617 24.7017 8.36617H23.3613L23.6964 5.6854C23.6964 5.51785 23.5289 5.18275 23.3613 5.18275C23.1938 5.18275 23.0262 5.3503 23.0262 5.6854L22.5236 8.36617H19.6753C19.5077 8.36617 19.3402 8.53371 19.3402 8.53371C19.3402 8.53371 19.1726 8.70126 19.1726 8.86881L19.8428 16.0734C19.8428 16.4085 20.1779 16.7436 20.6806 16.7436H16.9945C16.9945 16.2409 16.6594 15.9058 16.1568 15.9058H14.8164V12.89C15.4866 12.7224 16.1568 12.3873 16.6594 11.8847C17.3296 11.2145 17.4972 10.2092 17.4972 9.37146L17.1621 5.18275C17.1621 5.0152 16.827 4.84766 16.6594 4.84766H11.9681C11.633 4.84766 11.4654 5.0152 11.4654 5.18275L10.9628 9.20391C10.9628 10.2092 11.2979 11.0469 11.8005 11.7171C12.3032 12.2198 12.9734 12.5549 13.6435 12.7224V15.9058H12.4707C11.9681 15.9058 11.633 16.2409 11.633 16.7436H9.62239C8.9522 16.7436 8.28201 17.2462 8.28201 18.084L7.61182 23.2779L9.11975 23.9481C9.95749 24.4508 11.1303 24.4508 11.9681 23.9481C12.8058 23.4455 13.8111 23.4455 14.6488 23.9481L16.4919 24.7859V31.1527H19.1726V25.4561C18.67 25.6236 17.9998 25.4561 17.6647 25.2885C17.4972 25.2885 17.4972 25.121 17.4972 25.121C18.1673 25.2885 18.67 25.121 19.3402 24.9534L21.1832 24.1157C22.021 23.7806 23.0262 23.7806 24.0315 24.1157C24.8693 24.6183 26.0421 24.6183 26.8798 24.1157L28.3878 23.4455L27.7176 18.084ZM24.1991 9.37146L23.864 12.89H20.3455L20.0104 9.37146H24.1991ZM16.3243 5.6854L16.6594 8.86881H11.9681L12.3032 5.6854H16.3243Z" />
    </svg>
  );
});

Hospitality.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Hospitality.displayName = 'Hospitality';

export default Hospitality;
