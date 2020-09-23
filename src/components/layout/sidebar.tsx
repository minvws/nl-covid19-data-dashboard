import { WithChildren } from '~/types/index';

interface SidebarProps {
  openedTendency: string;
}

export function Sidebar(props: WithChildren<SidebarProps>) {
  const { openedTendency, children } = props;

  return <div className={openedTendency}>{children}</div>;
}
