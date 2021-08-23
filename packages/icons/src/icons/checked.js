import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Checked = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      focusable="false"
      {...rest}
    >
      <rect width="14" height="14" fill="#01689B" />
      <path
        d="M11.0194 2.84844C10.7532 2.6508 10.3822 2.68895 10.1621 2.93636L6.41889 7.14692L4.16863 5.18719C3.93061 4.98031 3.57935 4.97751 3.3395 5.18075C3.0987 5.3837 3.04071 5.7322 3.20184 6.00297L5.92767 10.5766C6.04274 10.7696 6.24993 10.8881 6.47367 10.8888C6.47461 10.8888 6.47503 10.8888 6.47598 10.8888C6.69877 10.8888 6.90596 10.772 7.02197 10.5801L11.1846 3.6982C11.3563 3.41449 11.2845 3.04603 11.0194 2.84844Z"
        fill="white"
      />
    </svg>
  );
});

Checked.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Checked.displayName = 'Checked';

export default Checked;
