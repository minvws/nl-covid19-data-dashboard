import { CurrentUser, Tool } from 'sanity';
import { isAdmin } from './roles';

// TODO: We could probably make use of whenNotAdministrator() here instead of duplicating the logic.
export const tools = (previousTools: Tool<any>[], { currentUser }: { currentUser: Omit<CurrentUser, 'role'> | null }) => {
  // If the user is an administrator, then all tools are available, otherwise, vision is not available.
  if (isAdmin(currentUser)) return previousTools;

  return previousTools.filter((tool) => tool.name !== 'vision');
};
