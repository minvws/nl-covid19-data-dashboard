import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Cross = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
      <path d="M11.6077 14.4069L17.245 20.0448L19.4853 17.8047L13.8479 12.1668L19.4865 6.5287L17.2464 4.28842L11.6079 9.92652L5.96941 4.2876L3.72913 6.52769L9.36756 12.1666L3.72937 17.8043L5.96947 20.0446L11.6077 14.4069Z" />
    </svg>
  );
});

Cross.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Cross.displayName = 'Cross';

export default Cross;
