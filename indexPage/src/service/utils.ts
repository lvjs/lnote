export function getDateBasedPrimaryKey() {
  return +new Date() + Math.random().toString().split(".")[1].slice(0, 7);
}
export function reverseMap(keyMap: Record<string, string>) {
  const res: Record<string, string> = {};
  for (const key in keyMap) {
    res[keyMap[key]] = key;
  }
  return res;
}
