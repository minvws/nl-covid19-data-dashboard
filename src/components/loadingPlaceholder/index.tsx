import styles from './loadingPlaceholder.module.scss';

const LoadingPlaceholder: React.FC = ({ children }) => {
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
};

export default LoadingPlaceholder;
