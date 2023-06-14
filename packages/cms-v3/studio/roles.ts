import { CurrentUser } from 'sanity';

// The 'role' key is omitted, as this is marked as deprecated by Sanity and throws type errors when included.
export const isAdmin = (currentUser: Omit<CurrentUser, 'role'> | null) => {
  if (!currentUser) return true;

  return currentUser.roles.find(({ name }: { name: string }) => name === 'administrator');
};
