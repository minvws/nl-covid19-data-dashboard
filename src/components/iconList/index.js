import styles from './iconList.module.scss';

export default IconList;
function IconList(props) {
  const { list } = props;

  return (
    <ul className={styles.iconList}>
      {list.map((item, index) => (
        <li key={`iconlist-${index}`} className={styles.iconListItem}>
          <img src={item.icon} className={styles.iconListImage} alt="" />{' '}
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
