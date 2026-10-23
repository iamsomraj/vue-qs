/**
 * Reads an own property, ignoring inherited ones (`constructor`, `hasOwnProperty`…).
 * @internal
 */
export function getOwn<T>(object: Partial<Record<string, T>>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(object, key) ? object[key] : undefined;
}

/**
 * Returns the URL key of a state key, as renamed by `urlKeys`.
 * @internal
 */
export function getUrlKey(
  urlKeys: Partial<Record<string, string>> | undefined,
  key: string
): string {
  return (urlKeys && getOwn(urlKeys, key)) ?? key;
}
