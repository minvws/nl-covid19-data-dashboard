import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Reizen = forwardRef(
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
          <path d="M29.0977 13.8076C29.0977 12.821 28.1111 11.8345 26.9601 11.8345C25.1515 11.8345 23.5072 11.8345 21.6986 11.8345V10.0258C21.863 8.87485 21.0409 8.05273 19.8899 8.05273H16.1082C15.1216 8.05273 14.2995 8.87485 14.2995 10.0258V11.9989C12.4908 11.9989 10.8466 11.9989 9.03793 11.9989C8.05139 11.9989 7.06484 12.821 6.90042 13.972C6.73599 17.9182 6.73599 22.0288 6.90042 26.1394C6.90042 27.1259 7.88696 28.1125 9.03793 28.1125C15.1216 28.1125 21.0409 28.1125 27.1246 28.1125C28.1111 28.1125 29.0977 27.2903 29.2621 26.1394C29.4265 22.0288 29.4265 17.9182 29.0977 13.8076ZM13.313 19.2336L10.5177 17.7537L12.3264 14.1364L14.2995 13.8076L15.1216 15.6162L13.313 19.2336ZM19.8899 11.8345C18.5745 11.8345 17.4235 11.8345 16.1082 11.8345V10.0258H19.8899V11.8345Z" />
        </svg>
      </svg>
    );
  }
);

Reizen.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Reizen.displayName = 'Reizen';

export default Reizen;
