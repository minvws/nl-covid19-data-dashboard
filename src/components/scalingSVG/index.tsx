import CSS from 'csstype';
import styles from './scalingSVG.module.scss';

interface IProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export function ScalingSVG(props: IProps) {
  const { children, width, height } = props;

  const style: CSS.Properties = { paddingBottom: `${100 * (height / width)}%` };

  return (
    <div style={style} className={styles.scalingSvgContainer}>
      {children}
    </div>
  );
}
