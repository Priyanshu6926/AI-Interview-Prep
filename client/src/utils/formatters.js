export function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function badgeText(count, label) {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}
