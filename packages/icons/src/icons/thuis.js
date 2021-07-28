import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Thuis = forwardRef(
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
            d="M18.297 6.84084L29.5862 17.5358C29.7347 17.6844 29.8833 17.8329 29.8833 18.13V18.8727C29.8833 19.1698 29.7347 19.3183 29.4377 19.3183H27.5066V29.2706H8.4933V19.3183H6.56226C6.26518 19.3183 6.11664 19.1698 6.11664 18.8727V18.13C6.11664 17.8329 6.26518 17.6844 6.41372 17.5358L17.7029 6.84084C17.8514 6.6923 18.1485 6.6923 18.297 6.84084ZM17.5544 16.3475C16.8117 16.3475 15.9205 16.3475 15.0292 16.6446V18.2785C15.4748 18.2043 15.8462 18.13 16.2176 18.0557C16.5889 17.9814 16.9603 17.9072 17.4059 17.8329C18.4457 17.8329 19.0398 18.13 19.0398 18.7241C19.0398 19.3183 18.7428 19.6154 17.8515 20.061L16.6632 20.6552C15.4748 21.2494 14.7321 22.1406 14.5836 23.0319L14.8807 24.5173H21.4165V22.7348H16.5146C16.6632 22.6357 16.7952 22.5367 16.9272 22.4377C17.1913 22.2396 17.4554 22.0416 17.8515 21.8435L18.8913 21.3979C20.2282 20.9523 20.9709 20.061 20.8223 18.8727C20.8223 17.3873 19.7825 16.3475 17.5544 16.3475Z"
            fill="currentColor"
          />
        </svg>
      </svg>
    );
  }
);

Thuis.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Thuis.displayName = 'Thuis';

export default Thuis;
