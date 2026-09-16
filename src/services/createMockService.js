export function createMockService(store, key) {
  return {
    list: () => [...store[key]],
    getById: (id, idField) => store[key].find((item) => item[idField] === id || item.id === id) || null,
    create: (item) => {
      store[key].push(item);
      return item;
    },
    update: (id, patch, idField) => {
      const index = store[key].findIndex((item) => item[idField] === id || item.id === id);
      if (index === -1) return null;
      store[key][index] = { ...store[key][index], ...patch };
      return store[key][index];
    },
  };
}
