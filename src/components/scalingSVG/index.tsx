import styles from './scalingSVG.module.scss';
import CSS from 'csstype';
import { WithChildren } from 'types';

interface IProps {
  width: number;
  height: number;
  children: WithChildren;
}

function ScalingSVG({ children, width, height }: IProps) {
  const style: CSS.Properties = { paddingBottom: `${100 * (height / width)}%` };

  return (
    <div style={style} className={styles.scalingSvgContainer}>
      {children}
    </div>
  );
}

export default ScalingSVG;
