export function setSearchParam(key: string, value: string): void {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);

  const newURL = `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }?${searchParams.toString()}`;

  window.history.replaceState(null, '', newURL);
}
