export function getSkipLinkId(source: string): string {
  return source.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
}

/**
 * Ensures unique IDs for the provided array of objects,
 * by adding -1 or -2 to duplicate IDs.
 */
export function ensureUniqueSkipLinkIds(members: { id: string }[]): void {
  members.forEach((member) => {
    const catches = members.filter((mem) => mem.id === member.id);

    if (catches.length !== 1) {
      catches.forEach((mem, index) => {
        mem.id = `${mem.id}-${index + 1}`;
      });
    }
  });
}
