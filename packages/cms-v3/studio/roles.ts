// TODO: see if this can be properly typed (CurrentUser throws errors)
export const whenNotAdministrator = ({ currentUser }: { currentUser: any }) => {
  return !currentUser.roles.find(({ name }: { name: string }) => name === 'administrator');
};
