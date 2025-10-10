// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

/**
 * Gets the announcement message for result count changes.
 * @param count - Number of results.
 * @returns Announcement string.
 */
export function getResultAnnouncement(count: number): string {
  return `${count} product${count === 1 ? '' : 's'} found.`;
}