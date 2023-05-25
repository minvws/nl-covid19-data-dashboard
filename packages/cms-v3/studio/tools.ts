import { Tool, ConfigContext } from 'sanity';

export const tools = (previousTools: Tool<any>[], context: ConfigContext) => {
  const isAdmin = context.currentUser?.roles.find(({ name }) => name === 'administrator');

  // If the user is an administrator, then all tools are available, otherwise, vision is not available.
  if (isAdmin) return previousTools;

  return previousTools.filter((tool) => tool.name !== 'vision');
};
