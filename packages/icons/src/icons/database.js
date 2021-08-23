import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Database = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      {...rest}
    >
      <path
        d="M7 4.66797C9.8995 4.66797 12.25 3.88447 12.25 2.91797C12.25 1.95147 9.8995 1.16797 7 1.16797C4.1005 1.16797 1.75 1.95147 1.75 2.91797C1.75 3.88447 4.1005 4.66797 7 4.66797Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 7C12.25 7.96833 9.91667 8.75 7 8.75C4.08333 8.75 1.75 7.96833 1.75 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.75 2.91797V11.0846C1.75 12.053 4.08333 12.8346 7 12.8346C9.91667 12.8346 12.25 12.053 12.25 11.0846V2.91797"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

Database.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Database.displayName = 'Database';

export default Database;
