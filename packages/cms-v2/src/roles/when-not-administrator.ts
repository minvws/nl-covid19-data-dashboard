export function whenNotAdministrator({ currentUser }: { currentUser: any }) {
  return !currentUser.roles.find(({ name }: { name: string }) => name === 'administrator');
}
