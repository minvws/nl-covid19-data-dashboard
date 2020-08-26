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

function IconList(props: IProps) {
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

function IconListItem(item: Item) {
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

function CollapseIconListItem(item: Item) {
  const { icon, text, content } = item;
  const [expanded, setExpanded] = useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: expanded,
  });

  const toggle = () => setExpanded((expanded) => !expanded);

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img
          src={icon}
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
              {text}
              <Arrow className={styles.arrow} width={13} height={8} />
            </span>
          </button>
        </h4>
      </div>
      <div className={styles.hiddenContent} {...getCollapseProps()}>
        <p>{content}</p>
      </div>
    </li>
  );
}

export default IconList;
