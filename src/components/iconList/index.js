import styles from './iconList.module.scss';
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import Arrow from 'assets/arrow.svg';

export default IconList;
function IconList(props) {
  const { list } = props;

  return (
    <ul className={styles.iconList}>
      {list.map((item) =>
        item?.content ? (
          <CollapseIconListItem
            key={`icon-list-item-${item.text}`}
            item={item}
          />
        ) : (
          <IconListItem item={item} />
        )
      )}
    </ul>
  );
}

function IconListItem(props) {
  const { item } = props;

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img src={item.icon} className={styles.iconListImage} alt="" />{' '}
        <h4>{item.text}</h4>
      </div>
    </li>
  );
}

function CollapseIconListItem(props) {
  const { item } = props;
  const [expanded, setExpanded] = useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: expanded,
  });

  const toggle = () => setExpanded((expanded) => !expanded);

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img src={item.icon} className={styles.iconListImage} alt="" />{' '}
        <h4>
          <button
            className={styles.button}
            aria-expanded={expanded}
            {...getToggleProps({ onClick: toggle })}
          >
            <span>
              {item.text}
              <Arrow className={styles.arrow} width={13} height={8} />
            </span>
          </button>
        </h4>
      </div>
      <div className={styles.hiddenContent} {...getCollapseProps()}>
        <p>{item.content}</p>
      </div>
    </li>
  );
}
