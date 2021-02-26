import { motion } from 'framer-motion';
import { memo } from 'react';
import { useIsMotionDisabled } from '~/utils/use-is-motion-disabled';
import { usePathMorph } from '~/utils/use-path-morph';

interface PathProps {
  path: string;
  fill?: string;
  strokeLinecap?: 'round' | 'inherit' | 'butt' | 'square';
  strokeLinejoin?: 'inherit' | 'round' | 'bevel' | 'miter';
  stroke?: string;
  strokeWidth?: number;
  isAnimated?: boolean;
}

export const Path = memo(PathUnmemoized);

function PathUnmemoized(props: PathProps) {
  const isMotionDisabled = useIsMotionDisabled();

  if (props.isAnimated && !isMotionDisabled) {
    return <AnimatedPath {...props} />;
  }

  return (
    <path
      d={props.path}
      fill={props.fill}
      strokeLinecap={props.strokeLinecap}
      strokeLinejoin={props.strokeLinejoin}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
    />
  );
}

const animationOptions = {
  type: 'spring',
  stiffness: 500,
  damping: 55,
} as const;

function AnimatedPath(props: PathProps) {
  const animatedPath = usePathMorph(props.path, animationOptions);

  return (
    <motion.path
      d={animatedPath}
      fill={props.fill}
      strokeLinecap={props.strokeLinecap}
      strokeLinejoin={props.strokeLinejoin}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
    />
  );
}
