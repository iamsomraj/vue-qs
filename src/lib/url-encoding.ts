/**
 * Encodes a query key or value, keeping URL-safe characters such as
 * `,` `:` `/` `[` `]` readable instead of percent-encoding them.
 * @internal
 */
export function encodeQueryValue(input: string): string {
  return (
    input
      .replace(/%/g, '%25')
      .replace(/\+/g, '%2B')
      .replace(/ /g, '+')
      .replace(/#/g, '%23')
      .replace(/&/g, '%26')
      .replace(/"/g, '%22')
      .replace(/'/g, '%27')
      .replace(/`/g, '%60')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, (char) => encodeURIComponent(char))
  );
}

/**
 * Renders search params as a query string with a leading `?`,
 * or an empty string when there are no params.
 * @internal
 */
export function renderQueryString(search: URLSearchParams): string {
  const parts: string[] = [];
  search.forEach((value, key) => {
    parts.push(`${encodeQueryValue(key).replace(/=/g, '%3D')}=${encodeQueryValue(value)}`);
  });
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}
