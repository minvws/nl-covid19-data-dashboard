import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ReproductieGraf = forwardRef(
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
        <path
          d="M5.261 4.234v8.508H8.14c1.397 0 2.52-.41 3.37-1.233.85-.822 1.274-1.932 1.274-3.33 0-1.315-.397-2.301-1.192-2.959-.794-.658-2.096-.986-3.905-.986H5.261zm.082 12.66v10.07H0V0h8.056c3.453 0 6.029.712 7.728 2.137 1.726 1.425 2.59 3.234 2.59 5.426 0 1.809-.44 3.398-1.316 4.768a8.296 8.296 0 01-3.535 3.042l7.152 11.59h-6.289l-5.878-10.07H5.343zM38.547 21.253c0 2.675-.822 4.801-2.466 6.38C34.437 29.21 32.518 30 30.326 30c-2.258 0-4.121-.68-5.59-2.039-1.447-1.38-2.17-3.409-2.17-6.083 0-2.675.822-4.801 2.466-6.38 1.644-1.6 3.562-2.4 5.755-2.4 2.258 0 4.11.69 5.557 2.072 1.468 1.38 2.203 3.409 2.203 6.083zm-4.11.099c0-1.579-.362-2.752-1.086-3.519-.723-.789-1.655-1.183-2.795-1.183-1.074 0-1.995.438-2.762 1.315-.745.855-1.118 2.115-1.118 3.781 0 1.579.351 2.763 1.053 3.552.723.767 1.666 1.15 2.827 1.15 1.075 0 1.984-.438 2.73-1.315.767-.877 1.15-2.137 1.15-3.781z"
          fill="#01689B"
        />
      </svg>
    );
  }
);

ReproductieGraf.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ReproductieGraf.displayName = 'ReproductieGraf';

export default ReproductieGraf;
