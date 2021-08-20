import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ExternalLink = forwardRef(
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
        <path d="M12.75 13.5C12.3358 13.5 12 13.1642 12 12.75C12 12.3358 12.3358 12 12.75 12H24.3995L24.3995 23.75C24.3995 24.1642 24.0637 24.5 23.6495 24.5C23.2352 24.5 22.8995 24.1642 22.8995 23.75L22.8995 14.5L13.3792 24.5C13.0863 24.7929 12.6114 24.7929 12.3185 24.5C12.0256 24.2071 12.0256 23.7322 12.3185 23.4393L21.8792 13.5L12.75 13.5Z" />
      </svg>
    );
  }
);

ExternalLink.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ExternalLink.displayName = 'ExternalLink';

export default ExternalLink;
