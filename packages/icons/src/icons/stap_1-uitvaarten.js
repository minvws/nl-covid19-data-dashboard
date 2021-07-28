import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1Uitvaarten = forwardRef(
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
          <path d="M26.1905 9.33605H24.5071C22.9767 7.34657 20.5281 5.96924 17.7735 5.96924C15.0188 5.96924 12.5702 7.34657 11.0399 9.33605H9.35645C9.05038 9.33605 8.89734 9.48908 8.89734 9.79516V29.2308H17.7735V24.3336C19.1508 24.1806 19.7629 22.4972 19.916 22.4972C19.916 22.3442 19.916 22.3442 19.916 22.3442C19.4569 22.8033 18.5386 23.7215 17.7735 23.5685C17.3144 23.4154 17.3144 22.1911 17.6204 21.579C17.6204 21.2729 17.7735 21.1199 18.0795 21.1199C18.9978 20.9668 20.8342 20.6608 22.0585 20.6608C22.3646 20.6608 22.5176 20.8138 22.5176 21.1199V29.2308H26.8026V9.79516C26.6496 9.48908 26.4966 9.33605 26.1905 9.33605ZM20.3751 19.8956C20.5281 19.7425 20.6812 19.4365 20.6812 19.1304C20.6812 18.3652 20.069 17.9061 20.069 17.9061C20.069 17.9061 19.4569 18.3652 19.4569 18.9774C19.4569 19.2834 19.6099 19.7425 19.7629 19.8956C18.9978 19.8956 18.3856 19.2834 18.2326 18.3652C17.9265 16.6818 19.4569 14.5393 20.069 13.9271C20.2221 16.0697 21.4463 15.7636 21.9055 17.447C22.2115 18.8243 21.4463 19.5895 20.3751 19.8956Z" />
        </svg>
      </svg>
    );
  }
);

Stap1Uitvaarten.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stap1Uitvaarten.displayName = 'Stap1Uitvaarten';

export default Stap1Uitvaarten;
