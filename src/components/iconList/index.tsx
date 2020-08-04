import styles from './iconList.module.scss';
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import Arrow from 'assets/arrow.svg';
import { Translation } from 'types/data';

interface Item {
  content: Translation;
  text: Translation;
  icon: Translation;
}

const IconList: React.FC<{ list: Item[] }> = (props) => {
  const { list } = props;

  return (
    <ul className={styles.iconList}>
      {list.map((item) =>
        item?.content ? (
          <CollapseIconListItem
            key={`icon-list-item-${item.text.translation}`}
            item={item}
          />
        ) : (
          <IconListItem item={item} />
        )
      )}
    </ul>
  );
};

const IconListItem: React.FC<{ item: Item }> = (props) => {
  const { item } = props;

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img
          src={item.icon.translation}
          className={styles.iconListImage}
          alt=""
          loading="lazy"
        />{' '}
        <h4>{item.text.translation}</h4>
      </div>
    </li>
  );
};

const CollapseIconListItem: React.FC<{ item: Item }> = (props) => {
  const { item } = props;
  const [expanded, setExpanded] = useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: expanded,
  });

  const toggle = () => setExpanded((expanded) => !expanded);

  return (
    <li className={styles.iconListItem}>
      <div className={styles.content}>
        <img
          src={item.icon.translation}
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
              {item.text.translation}
              <Arrow className={styles.arrow} width={13} height={8} />
            </span>
          </button>
        </h4>
      </div>
      <div className={styles.hiddenContent} {...getCollapseProps()}>
        <p>{item.content.translation}</p>
      </div>
    </li>
  );
};

export default IconList;
