import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const BasisregelsElleboog = forwardRef(
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
          d="M16.7943 16.5105C16.7943 16.0674 16.7943 15.5136 17.0159 15.0705C16.462 14.6274 16.2405 13.9628 16.5728 13.2982C16.7943 12.8552 17.2374 12.4121 17.7912 12.9659C17.7912 13.1875 17.6805 13.409 17.6805 13.5198C17.6805 13.8521 18.1236 13.9628 18.1236 13.9628L19.0097 11.7475C19.7851 11.969 22.9973 12.6336 24.9911 12.4121L25.2126 14.2951C24.9911 14.6274 24.8803 15.0705 24.6588 15.4028C24.3265 15.4028 23.8834 15.5136 23.6619 15.5136C23.5511 15.5136 23.3296 15.6243 23.3296 15.8459C23.3296 15.9566 23.3296 16.1782 23.5511 16.289L23.9942 16.6213C22.665 16.8428 20.782 17.3966 19.5635 17.8397C18.7882 17.5074 17.902 16.9536 16.7943 16.5105ZM11.256 16.9536C10.8129 16.9536 10.1483 16.8428 9.48371 16.3997C9.04065 16.1782 8.48681 15.6243 9.15141 13.9628C9.26218 13.6305 9.59448 13.409 9.81602 13.2982C10.1483 13.1875 10.4806 13.409 10.7022 13.6305L10.9237 13.7413L11.1452 13.6305C11.1452 13.6305 11.4775 13.5198 11.6991 13.7413C12.0314 14.0736 12.1421 14.4059 12.2529 14.7382V14.849L11.256 16.9536ZM27.5388 18.0612C27.2065 17.0643 26.4311 16.6213 25.4342 16.5105C26.4311 14.7382 28.7572 9.86446 25.7665 9.31062C24.7696 8.20295 24.105 7.31681 21.6681 7.42758C19.342 7.53835 16.6836 7.53835 15.6867 11.4152C15.1328 13.1875 15.4651 14.0736 15.7974 16.0674C14.6898 15.5136 13.6929 15.0705 13.139 14.849C13.139 14.7382 13.0283 14.6274 13.0283 14.5167C12.8067 14.0736 12.696 13.6305 12.2529 13.2982C11.9206 12.9659 11.4775 12.9659 11.1452 12.9659C10.7022 12.6336 10.2591 12.5229 9.70525 12.6336C9.15141 12.7444 8.70834 13.0767 8.48681 13.6305C7.60067 15.6243 8.26528 16.6213 9.04065 17.0643C9.81602 17.5074 10.5914 17.6182 11.1452 17.7289C12.1421 18.6151 16.7943 22.6027 18.2343 23.0457C19.2312 23.378 21.5573 22.935 23.5511 22.4919C23.5511 22.6027 23.5511 22.6027 23.4404 22.7134C21.6681 23.4888 19.1205 24.1534 18.0128 23.8211C17.2374 23.5996 15.2436 22.0488 13.4713 20.7196C12.4744 20.9412 11.6991 21.3842 11.256 21.8273C10.1483 23.0457 9.48371 28.4733 9.48371 28.4733H25.5449C25.5449 28.4733 25.8772 23.7103 27.2065 20.7196C27.6495 19.9443 27.8711 19.1689 27.5388 18.0612Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

BasisregelsElleboog.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BasisregelsElleboog.displayName = 'BasisregelsElleboog';

export default BasisregelsElleboog;
