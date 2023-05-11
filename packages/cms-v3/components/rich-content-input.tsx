import { BlockEditor } from 'sanity';

// TODO: properly type the props and consider implementing markers which can display the error messages on the page (if possible)
export const RichContentInput = (props: any) => {
  return <BlockEditor {...props} />;
};
