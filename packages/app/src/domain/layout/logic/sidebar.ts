type Category = {
  title: string;
  items: Item[];
};

type Item = {
  title: string;
  icon: React.ReactElement;
  href: string;
};

export type SidebarData = Category | Item[];
