const DATE_FORMAT_LONG = 'MMMM D YYYY, h:mm A';
const DATE_FORMAT_SHORT = 'YYYY-MM-DD';
const DATE_FORMAT_SHORT_FRIENDLY = 'MMM D';

const PROJECT_ENUM = [
  "Feature Film",
  "Feature Film (LB)",
  "Feature Film (MLB)",
  "Feature Film (ULB)",
  "Pilot One Hour",
  "Pilot 1/2 Hour",
  "TV One Hour",
  "TV 1/2 Hour",
  "TV Daytime",
  "TV Mini-Series",
  "TV Movie",
  "New Media (SVOD)",
  "New Media (AVOD)",
  "New Media (<$50k)"
];

const STATUS_ENUM = [
  "Casting",
  "On Hold",
  "Shooting",
  "On Hiatus",
  "See Notes",
  "Unknown",
  "Wrapped",
  "Canceled"
];

module.exports = {
  DATE_FORMAT_LONG,
  DATE_FORMAT_SHORT,
  DATE_FORMAT_SHORT_FRIENDLY,
  PROJECT_ENUM,
  STATUS_ENUM
}
