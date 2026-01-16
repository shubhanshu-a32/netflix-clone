export const saveCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getCache = key => {
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
};