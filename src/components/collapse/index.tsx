import * as React from 'react';
import useCollapse from 'react-collapsed';
import { WithChildren } from 'types';

import * as piwik from '../../lib/piwik';

import Arrow from 'assets/arrow.svg';

interface IProps {
  openText: string;
  sluitText: string;
  piwikAction?: string;
  piwikName?: string;
  children: WithChildren;
}

function Collapse(props: WithChildren<IProps>) {
  const { children, openText, sluitText, piwikAction, piwikName } = props;
  const [open, setOpen] = React.useState(false);
  const [renderContent, setRenderContent] = React.useState(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: open,
    onCollapseEnd: () => setRenderContent(false),
    onExpandStart: () => setRenderContent(true),
  });

  const toggle = () => {
    setOpen((prevOpen) => !prevOpen);

    if (piwikAction && piwikName) {
      piwik.event({
        category: 'accordion-open',
        action: piwikAction,
        name: piwikName,
      });
    }
  };

  const buttonText = open ? openText : sluitText;

  return (
    <>
      <div className="collapseContent" {...getCollapseProps()}>
        {renderContent && children}
      </div>
      <button
        className="collapseButton"
        {...getToggleProps({ onClick: toggle })}
      >
        {buttonText}
        <Arrow />
      </button>
    </>
  );
}

export default Collapse;
