import sl from "./sl.js"

const VALLINGBY_ID = 9103
const FORECAST = 30
const DIRECTION = 2

function formatDepartures(departures) {
  return departures
    .sort((d1, d2) => d1.expected > d2.expected ? 1 : -1)
    .map(departure => {
      const expected_date = new Date(departure.expected);
      const expected_time = dateDiffInMinutes(expected_date, new Date());

      const pretty_date = ` (${expected_date.getHours()}:${expected_date.getMinutes()})`;
      return `${departure.destination}: ${expected_time} minutes ${pretty_date}`;
    });
}

function dateDiffInMinutes(date1, date2) {
  const diffTime = date1 - date2;
  return Math.floor(diffTime / (1000 * 60));
}

sl.getAllDeparturesFromSiteID(VALLINGBY_ID, FORECAST, DIRECTION)
  .then(formatDepartures)
  .then(departures => console.log(departures));