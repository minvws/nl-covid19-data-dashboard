import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const SchoolAndDayCare = forwardRef(
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
        <path d="M27.1134 22.9805C26.4441 16.8801 25.7072 7.89671 20.6483 9.40932C17.2907 10.4133 15.6863 14.8108 15.4611 18.3582C15.2552 18.3719 15.1103 18.0925 15.1103 17.8061C15.1103 10.3519 19.8787 8.84216 19.8787 8.84216C19.8787 8.84216 19.1408 8.35886 17.8308 8.45105C17.322 7.74423 16.4834 6.78498 15.3261 7.08397C14.7449 7.2341 14.3381 7.71192 14.1529 8.33463C13.9486 9.02227 14.0488 9.85404 14.3836 10.5254C14.1926 10.7853 14.0133 11.0616 13.8519 11.3617C13.2334 11.1156 11.9791 10.7684 10.839 11.3977C9.67359 12.0411 9.01849 13.4736 8.89149 15.6552C8.62035 20.3221 11.4117 24.1223 12.5111 25.4275C12.5662 25.8919 12.6238 26.3046 12.6796 26.6484C12.7977 27.3752 13.328 27.9687 14.0422 28.1692C15.2798 28.5164 17.003 28.8133 17.76 28.936C18.0096 28.9764 18.263 28.9874 18.5126 28.9466C21.2376 28.5017 24.5546 26.2694 26.2069 25.0473C26.8582 24.5655 27.2013 23.7815 27.1134 22.9805ZM12.2767 22.6439C11.2475 20.9636 10.1579 18.4966 10.3183 15.7382C10.4128 14.1063 10.83 13.0391 11.5242 12.6517C12.1289 12.3141 12.879 12.517 13.2757 12.6694C12.2319 15.5733 12.1114 19.511 12.2767 22.6439ZM15.1954 8.64405C15.4464 7.79822 16.2183 8.11016 16.6656 8.73547C16.2325 8.91372 15.7696 9.18005 15.2816 9.56882C15.2547 9.5903 15.2308 9.61655 15.2043 9.63873C15.1194 9.29922 15.1082 8.93732 15.1954 8.64405Z" />
      </svg>
    );
  }
);

SchoolAndDayCare.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SchoolAndDayCare.displayName = 'SchoolAndDayCare';

export default SchoolAndDayCare;
