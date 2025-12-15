module.exports = function getWeekKey() {
  const now = new Date();
  const year = now.getFullYear();

  const firstDay = new Date(year, 0, 1);
  const dayOfYear =
    Math.floor((now - firstDay) / (24 * 60 * 60 * 1000)) + 1;

  const week = Math.ceil((dayOfYear + firstDay.getDay()) / 7);

  return `${year}-W${week}`;
};