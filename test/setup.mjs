/* Node has no localStorage; back it with a Map so the store module loads. */
const map = new Map();

globalThis.localStorage = {
  getItem: (k) => (map.has(k) ? map.get(k) : null),
  setItem: (k, v) => void map.set(k, String(v)),
  removeItem: (k) => void map.delete(k),
  clear: () => map.clear(),
};
