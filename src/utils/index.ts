export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n - 1)}…` : str;
}
