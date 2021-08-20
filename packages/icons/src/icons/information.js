import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Information = forwardRef(
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
        <path d="M28.1629 9.68473C28.0034 8.72616 27.2741 7.99687 26.3153 7.83706C23.5435 7.375 18.9238 7.375 18 7.375C17.0762 7.375 12.4565 7.375 9.68473 7.83706C8.72593 7.99687 7.99664 8.72616 7.83706 9.68473C7.375 12.4565 7.375 17.0762 7.375 18C7.375 18.9238 7.375 23.5435 7.83706 26.3153C7.99664 27.2738 8.72593 28.0031 9.68473 28.1629C12.4565 28.625 17.0762 28.625 18 28.625C18.9238 28.625 23.5435 28.625 26.3153 28.1629C27.2741 28.0031 28.0034 27.2738 28.1629 26.3153C28.625 23.5435 28.625 18.9238 28.625 18C28.625 15.2269 28.625 12.4565 28.1629 9.68473ZM19.395 25.4398H16.3426L16.605 18.93V15.2101H19.395V25.4398ZM18.0106 13.3501C16.9683 13.3501 16.3725 12.7673 16.3725 11.7027C16.3725 10.7984 16.9256 10.0952 17.9894 10.0952C19.0317 10.0952 19.6275 10.6576 19.6275 11.7027C19.6275 12.6267 19.0744 13.3501 18.0106 13.3501Z" />
      </svg>
    );
  }
);

Information.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Information.displayName = 'Information';

export default Information;
