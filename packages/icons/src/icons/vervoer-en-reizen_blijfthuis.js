import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const VervoerEnReizenBlijfthuis = forwardRef(
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
          d="M29.2032 17.4575L18.2226 7.13095C18.0742 6.98129 17.7774 6.98129 17.629 7.13095L6.79677 17.4575C6.64839 17.6071 6.5 17.9065 6.5 18.2058V18.9541C6.5 19.2534 6.64839 19.4031 6.94516 19.4031H8.72581V28.9813H27.1258V19.2534H28.9065C29.2032 19.2534 29.3516 19.1037 29.3516 18.8044V18.2058C29.5 17.9065 29.3516 17.6071 29.2032 17.4575ZM17.9258 26.5867H11.6935C11.6935 26.5867 12.1387 23.8929 12.8806 23.1446C13.4742 22.5459 15.5516 21.7976 16.2935 21.648C16.2935 21.3486 16.4419 21.0493 16.4419 20.8997C15.8484 20.301 15.5516 19.7024 15.4032 18.9541C14.9581 18.9541 14.8097 18.0561 14.8097 17.7568C14.8097 17.4575 14.8097 17.3078 14.9581 17.1582C14.9581 17.1582 14.9581 17.1582 15.1065 17.1582C15.1065 16.7092 14.8097 14.9133 15.4032 14.3146C15.8484 13.8656 16.5903 13.5663 17.1839 13.4167C18.2226 13.1173 18.5194 13.267 19.1129 13.5663C19.8548 13.267 20.3 13.5663 20.7452 14.3146C21.1903 14.9133 20.8935 16.7092 20.8935 17.1582C20.8935 17.1582 20.8935 17.1582 21.0419 17.1582C21.1903 17.1582 21.1903 17.4575 21.1903 17.7568C21.0419 18.0561 21.0419 18.9541 20.5968 18.9541C20.4484 19.7024 20.1516 20.301 19.7065 20.8997C19.7065 21.0493 19.8548 21.3486 19.8548 21.648C20.5968 21.9473 22.6742 22.6956 23.2677 23.1446C24.0097 23.8929 24.4548 26.5867 24.4548 26.5867H17.9258V26.5867Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

VervoerEnReizenBlijfthuis.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

VervoerEnReizenBlijfthuis.displayName = 'VervoerEnReizenBlijfthuis';

export default VervoerEnReizenBlijfthuis;
