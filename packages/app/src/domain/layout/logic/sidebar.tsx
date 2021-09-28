import { Ziekenhuis } from '@corona-dashboard/icons';

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

const gm = [
  {
    title: 'Ziekenhuizen',
    items: [
      {
        title: 'Ziekenhuisopnames',
        icon: <Ziekenhuis />,
      },
    ],
  },
];
