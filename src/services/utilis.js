export const safeJSONParse = (item) => {
  try {
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
};
