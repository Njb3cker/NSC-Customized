async function fetchJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

export function fetchUpgrades() {
  return fetchJson('./upgrades.json');
}

export function fetchCurses() {
  return fetchJson('./curses.json');
}
