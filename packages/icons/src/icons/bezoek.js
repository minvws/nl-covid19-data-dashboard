import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Bezoek = forwardRef(
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M29.6219 16.8474L18.2922 6.12551C18.2048 6.04481 18.0903 6 17.9714 6C17.8524 6 17.7379 6.04481 17.6506 6.12551L6.32081 16.8474C6.22043 16.94 6.14016 17.0522 6.08497 17.1771C6.02978 17.302 6.00086 17.4369 6 17.5734V18.2826C6 18.4125 6.05159 18.537 6.14342 18.6288C6.23525 18.7207 6.35979 18.7723 6.48966 18.7723H8.39765V28.7343H27.5451V18.7723H29.4531C29.5829 18.7723 29.7075 18.7207 29.7993 18.6288C29.8911 18.537 29.9427 18.4125 29.9427 18.2826V17.5734C29.9419 17.4369 29.9129 17.302 29.8578 17.1771C29.8026 17.0522 29.7223 16.94 29.6219 16.8474ZM14.7936 16.8242V15.3315C15.2964 15.1954 15.8306 15.0801 16.3962 14.9859C16.9723 14.8916 17.4856 14.8445 17.936 14.8445H19.0673V25.1517H17.009V16.6042C16.6948 16.6042 16.3334 16.6252 15.9249 16.6671C15.5268 16.6985 15.1497 16.7509 14.7936 16.8242Z"
        />
      </svg>
    );
  }
);

Bezoek.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Bezoek.displayName = 'Bezoek';

export default Bezoek;
