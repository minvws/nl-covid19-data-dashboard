import styles from './scalingSVG.module.scss';
import CSS from 'csstype';
import { WithChildren } from 'types';

interface IProps {
  width: number;
  height: number;
  children: WithChildren;
}

export function ScalingSVG(props: WithChildren<IProps>) {
  const { children, width, height } = props;

  const style: CSS.Properties = { paddingBottom: `${100 * (height / width)}%` };

  return (
    <div style={style} className={styles.scalingSvgContainer}>
      {children}
    </div>
  );
}
