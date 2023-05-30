import { Tool, ConfigContext } from 'sanity';

// TODO: We could probably make use of whenNotAdministrator() here instead of duplicating the logic.
export const tools = (previousTools: Tool<any>[], context: ConfigContext) => {
  const isAdmin = context.currentUser?.roles.find(({ name }) => name === 'administrator');

  // If the user is an administrator, then all tools are available, otherwise, vision is not available.
  if (isAdmin) return previousTools;

  return previousTools.filter((tool) => tool.name !== 'vision');
};
