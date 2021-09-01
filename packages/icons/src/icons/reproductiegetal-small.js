import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ReproductiegetalSmall = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      width={12}
      height={16}
      focusable="false"
      viewBox="0 0 12 16"
      fill="none"
      {...rest}
    >
      <path
        d="M3.00942 2.51219V7.56098H4.6552C5.45458 7.56098 6.09721 7.31707 6.58311 6.82927C7.06901 6.34146 7.31195 5.68293 7.31195 4.85366C7.31195 4.07317 7.08468 3.48781 6.63013 3.09756C6.17559 2.70732 5.43107 2.51219 4.39658 2.51219H3.00942ZM3.05644 10.0244V16H0V0H4.60818C6.58311 0 8.05647 0.422764 9.02827 1.26829C10.0157 2.11382 10.5095 3.18699 10.5095 4.4878C10.5095 5.56098 10.2587 6.50407 9.75711 7.31707C9.25554 8.11382 8.58156 8.71545 7.73516 9.12195L11.8261 16H8.22889L4.8668 10.0244H3.05644Z"
        fill="currentColor"
      />
    </svg>
  );
});

ReproductiegetalSmall.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

ReproductiegetalSmall.displayName = 'ReproductiegetalSmall';

export default ReproductiegetalSmall;
