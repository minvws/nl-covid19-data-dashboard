import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Search = forwardRef(({ ...rest }, ref) => {
  return (
    <svg ref={ref} width={24} height={24} viewBox="0 0 24 24" {...rest}>
      <g id="_x32_4px_Boxes">
        <rect fill="none" width="24" height="24" />
      </g>
      <g id="Production">
        <path
          fill="#595959"
          d="M20.5916,17.7693l-4.5362-4.5352c0.5188-0.9643,0.8146-2.0656,0.8146-3.2351c0-3.7766-3.0731-6.849-6.8505-6.849   C6.2427,3.15,3.17,6.2224,3.17,9.999c0,3.7776,3.0727,6.851,6.8495,6.851c1.1544,0,2.2413-0.2898,3.1965-0.7962l4.5455,4.5454   c0.711,0.711,1.8692,0.711,2.5801,0l0.25-0.25C21.3045,19.6364,21.3025,18.4821,20.5916,17.7693z M5.87,9.999   c0-2.2908,1.8587-4.149,4.1495-4.149c2.2918,0,4.1505,1.8582,4.1505,4.149c0,2.2928-1.8587,4.151-4.1505,4.151   C7.7287,14.15,5.87,12.2918,5.87,9.999z"
        />
      </g>
    </svg>
  );
});

Search.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Search.displayName = 'Search';

export default Search;
