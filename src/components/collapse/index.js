import * as React from 'react';
import useCollapse from 'react-collapsed';

import Arrow from 'assets/arrow.svg?sprite';

const Collapse = ({ children, openText, sluitText }) => {
  const [open, setOpen] = React.useState(false);
  const [renderContent, setRenderContent] = React.useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: open,
    onCollapseEnd: () => setRenderContent(false),
    onExpandStart: () => setRenderContent(true),
  });

  const toggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const buttonText = open ? openText : sluitText;

  return (
    <>
      <div className="collapseContent" {...getCollapseProps()}>
        {renderContent && children}
      </div>
      <button
        aria-expanded={open}
        className="collapseButton"
        {...getToggleProps({ onClick: toggle })}
      >
        {buttonText}
        <Arrow />
      </button>
    </>
  );
};

export default Collapse;
