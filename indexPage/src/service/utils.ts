export function getDateBasedPrimaryKey() {
  return +new Date() + Math.random().toString().split(".")[1].slice(0, 7);
}
