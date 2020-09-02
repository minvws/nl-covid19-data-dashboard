import styles from './iconList.module.scss';
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import Arrow from 'assets/arrow.svg';

interface IProps {
  list: Item[];
}

interface Item {
  content: string;
  text: string;
  icon: string;
}

interface IIconListItemProps {
  item: Item;
}

export default IconList;

function IconList({ list }: IProps) {
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

function IconListItem({ item }: IIconListItemProps) {
  const { text, icon } = item;

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img
          src={icon}
          className={styles.iconListImage}
          alt=""
          loading="lazy"
        />{' '}
        <h4>{text}</h4>
      </div>
    </li>
  );
}

function CollapseIconListItem({ item }: IIconListItemProps) {
  const [expanded, setExpanded] = useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: expanded,
  });

  const toggle = () => setExpanded((expanded) => !expanded);

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img
          src={item.icon}
          className={styles.iconListImage}
          loading="lazy"
          alt=""
        />{' '}
        <h4>
          <button
            className={styles.button}
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
