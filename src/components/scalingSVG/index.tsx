import styles from './scalingSVG.module.scss';
import CSS from 'csstype';

const ScalingSVG: React.FC<{ width: number; height: number }> = (props) => {
  const { children, width, height } = props;

  const style: CSS.Properties = { paddingBottom: `${100 * (height / width)}%` };

  return (
    <div style={style} className={styles.scalingSvgContainer}>
      {children}
    </div>
  );
};

export default ScalingSVG;
