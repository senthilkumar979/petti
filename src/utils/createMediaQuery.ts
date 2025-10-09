export const createMediaQuery = (query: string) => {
  const mediaQuery = window.matchMedia(query);
  return mediaQuery.matches;
};
