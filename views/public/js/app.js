async function loadStats() {

  const res =
    await fetch('/api/stats');

  const data =
    await res.json();

  document.getElementById(
    'servers'
  ).textContent =
    data.servers;

  document.getElementById(
    'users'
  ).textContent =
    data.users;

}

loadStats();