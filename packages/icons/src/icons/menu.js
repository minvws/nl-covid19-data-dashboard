import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Menu = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path d="M0 0h36v36H0z" />
        <path
          d="M28.852 7.826H7.148v4.07h19.67l2.034-4.07zM7.148 20.035h19.67l2.034-4.07H7.148v4.07zM26.817 28.174H7.147v-4.07h21.705l-2.035 4.07z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

Menu.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Menu.displayName = 'Menu';

export default Menu;
