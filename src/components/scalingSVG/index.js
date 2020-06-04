import styles from './scalingSVG.module.scss';

export default function ScalingSVG(props) {
  const { children, width, height } = props;

  return (
    <div
      style={`padding-bottom: ${100 * (height / width)}% `}
      className={styles.scalingSvgContainer}
    >
      {children}
    </div>
  );
}
