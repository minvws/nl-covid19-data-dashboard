export function getSkipLinkId(source: string): string {
  return source.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Ensures unique IDs for the provided array of objects,
 * by adding -1 or -2 to duplicate IDs.
 */
export function ensureUniqueSkipLinkIds(members: { id: string }[]): void {
  members.forEach((member) => {
    const catches = members.filter((x) => x.id === member.id);

    if (catches.length !== 1) {
      catches.forEach((x, index) => {
        x.id = `${x.id}-${index + 1}`;
      });
    }
  });
}
