import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Work = forwardRef(
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
        <path d="M26.9071 14.5458C26.9071 13.7487 26.11 12.9516 25.1801 12.9516C23.7187 12.9516 22.3902 12.9516 20.9288 12.9516V11.4902C21.0617 10.5603 20.3974 9.896 19.4674 9.896H16.4119C15.6148 9.896 14.9505 10.5603 14.9505 11.4902V13.0844C13.4891 13.0844 12.1606 13.0844 10.6993 13.0844C9.90216 13.0844 9.10505 13.7487 8.9722 14.6786C8.83935 17.8671 8.83935 21.1884 8.9722 24.5096C8.9722 25.3067 9.7693 26.1038 10.6993 26.1038C15.6148 26.1038 20.3974 26.1038 25.3129 26.1038C26.11 26.1038 26.9071 25.4396 27.04 24.5096C27.1728 21.1884 27.1728 17.8671 26.9071 14.5458ZM19.4674 12.9516C18.4046 12.9516 17.4747 12.9516 16.4119 12.9516V11.4902H19.4674V12.9516Z" />
      </svg>
    );
  }
);

Work.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Work.displayName = 'Work';

export default Work;
