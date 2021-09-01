import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Chart = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={29}
      height={22}
      viewBox="0 0 29 22"
      fill="currentColor"
      {...rest}
    >
      <path d="M2 5.38889C2 4.62183 2.49747 4 3.11111 4H4.88889C5.50254 4 6 4.62183 6 5.38889V21H2V5.38889Z" />
      <path d="M9 1.38889C9 0.621828 9.49746 0 10.1111 0H11.8889C12.5026 0 13 0.621826 13 1.38889V21H9V1.38889Z" />
      <path d="M16 10.3889C16 9.62182 16.4974 9 17.1111 9H18.8889C19.5026 9 20 9.62182 20 10.3889V21H16V10.3889Z" />
      <path d="M23 5.38889C23 4.62183 23.4974 4 24.1111 4H25.8889C26.5026 4 27 4.62183 27 5.38889V21H23V5.38889Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29 21.8325C29 21.925 28.925 22 28.8325 22H0.167518C0.0750003 22 0 21.925 0 21.8325V20.1675C0 20.075 0.0750016 20 0.167519 20H28.8325C28.925 20 29 20.075 29 20.1675V21.8325Z"
      />
    </svg>
  );
});

Chart.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Chart.displayName = 'Chart';

export default Chart;
