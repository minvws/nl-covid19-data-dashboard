import { CurrentUser, Tool } from 'sanity';
import { isAdmin } from './roles';

export const tools = (previousTools: Tool[], { currentUser }: { currentUser: Omit<CurrentUser, 'role'> | null }) => {
  // If the user is an administrator, then all tools are available, otherwise, vision is not available.
  if (isAdmin(currentUser)) return previousTools;

  return previousTools.filter((tool) => tool.name !== 'vision');
};
