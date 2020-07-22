import React from 'react';

type TSizes = {
  width: number | undefined;
  height: number | undefined;
};

export const useResize = (
  ref: React.MutableRefObject<HTMLElement> | null
): TSizes => {
  const [sizes, refreshSize] = React.useState<TSizes>({ width: 0, height: 0 });

  React.useEffect(() => {
    const getDimensions = () => ({
      width: ref?.current.offsetWidth,
      height: ref?.current.offsetHeight,
    });

    const handleResize = () => {
      refreshSize(getDimensions());
    };

    if (ref?.current) {
      refreshSize(getDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return sizes;
};
