import React, { forwardRef } from 'react';

const SearchIcon = forwardRef(({ ...rest }, ref) => {
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.953 6.015C10.912 6.015 6 10.886 6 16.913c0 6.028 4.912 10.899 10.953 10.899 2.458 0 4.73-.807 6.56-2.17l3.93 3.907a1.5 1.5 0 102.115-2.127l-3.907-3.885a10.814 10.814 0 002.254-6.624c0-6.027-4.912-10.898-10.953-10.898zM9 16.913c0-4.354 3.552-7.898 7.953-7.898 4.4 0 7.952 3.544 7.952 7.898 0 4.355-3.552 7.899-7.953 7.899-4.4 0-7.952-3.544-7.952-7.899z"
      />
    </svg>
  );
});

SearchIcon.displayName = 'SearchIcon';

export default SearchIcon;
