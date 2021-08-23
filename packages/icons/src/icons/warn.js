import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Warn = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 15 15"
      fill="none"
      {...rest}
    >
      <circle cx="7.5" cy="7.5" r="7" stroke="#595959" />
      <path
        d="M7.88 9.734a.729.729 0 00-.27-.045.68.68 0 00-.282.056.589.589 0 00-.216.137h0l-.002.002a.673.673 0 00-.125.216h0l-.002.004a1.05 1.05 0 00-.033.276c0 .103.015.196.045.28.03.082.072.154.125.215h0l.005.005c.06.053.128.094.203.124h.002c.083.031.177.046.28.046a.729.729 0 00.27-.045m0-1.27a.5.5 0 01.206.136c.063.056.108.13.138.22a.85.85 0 01.045.289.783.783 0 01-.045.27.588.588 0 01-.136.216.5.5 0 01-.208.139m0-1.27l-.001-.001-.017.047.018-.047s0 0 0 0zm0 1.27s0 0 0 0l-.018-.047.017.047s0 0 0 0zM7.147 3.95h-.05V4l.063 5.098v.052l.053-.002.81-.043.046-.002v-.047l.074-5.055V3.95h-.996z"
        fill="#595959"
        stroke="#595959"
        strokeWidth=".1"
      />
    </svg>
  );
});

Warn.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Warn.displayName = 'Warn';

export default Warn;
