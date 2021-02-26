import { RichContent } from '~/components-styled/cms/rich-content';

export function formatMessages(messages: any[]) {
  console.log(messages);
  return {
    messageString: (id: string) => {
      const safeKey: any = id.replace(/\:/g, '_');
      return messages[safeKey] ?? id;
    },
    messageBlock: (id: string) => {
      const safeKey: any = id.replace(/\:/g, '_');
      const components = <RichContent blocks={messages[safeKey]} />;
      return components ?? <>{id}</>;
    },
  };
}
