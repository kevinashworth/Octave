const DATE_FORMAT_LONG = 'MMMM D YYYY, h:mm A';
const DATE_FORMAT_SHORT = 'YYYY-MM-DD';
const DATE_FORMAT_SHORT_FRIENDLY = 'MMM D';

const PROJECT_ENUM = [
  'Feature Film',
  'Feature Film (LB)',
  'Feature Film (MLB)',
  'Feature Film (ULB)',
  'Pilot One Hour',
  'Pilot 1/2 Hour',
  'TV One Hour',
  'TV 1/2 Hour',
  'TV Daytime',
  'TV Mini-Series',
  'TV Movie',
  'New Media (SVOD)',
  'New Media (AVOD)',
  'New Media (<$50k)'
];

const STATUS_ENUM = [
  'Casting',
  'On Hold',
  'Shooting',
  'On Hiatus',
  'See Notes',
  'Unknown',
  'Wrapped',
  'Canceled'
];

const CASTING_TITLES_ENUM = [
  { value: 'Casting Director', label: 'Casting Director' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Casting Director / Associate', label: 'Casting Director / Associate' },
  { value: 'Associate / Assistant', label: 'Associate / Assistant' },
  { value: 'Assistant / Intern', label: 'Assistant / Intern' },
  { value: 'Unknown', label: 'Unknown' },
];

const PROJECT_TYPES_ENUM = [
  { value: 'Feature Film', label: 'Feature Film'},
  { value: 'Feature Film (LB)', label: 'Feature Film (LB)'},
  { value: 'Feature Film (MLB)', label: 'Feature Film (MLB)'},
  { value: 'Feature Film (ULB)', label: 'Feature Film (ULB)'},
  { value: 'Short Film', label: 'Short Film'},
  { value: 'Pilot One Hour', label: 'Pilot One Hour'},
  { value: 'Pilot 1/2 Hour', label: 'Pilot 1/2 Hour'},
  { value: 'Pilot Presentation', label: 'Pilot Presentation'},
  { value: 'TV One Hour', label: 'TV One Hour'},
  { value: 'TV 1/2 Hour', label: 'TV 1/2 Hour'},
  { value: 'TV Daytime', label: 'TV Daytime'},
  { value: 'TV Mini-Series', label: 'TV Mini-Series'},
  { value: 'TV Movie', label: 'TV Movie'},
  { value: 'TV Telefilm', label: 'TV Telefilm'},
  { value: 'TV Talk/Variety', label: 'TV Talk/Variety'},
  { value: 'TV Sketch/Improv', label: 'TV Sketch/Improv'},
  { value: 'New Media', label: 'New Media'},
];

const PROJECT_STATUSES_ENUM = [
  {projectStatus: 'Casting', label: 'Casting'},
  {projectStatus: 'Ordered', label: 'Ordered'},
  {projectStatus: 'Pre-Prod.', label: 'Pre-Prod.'},
  {projectStatus: 'Shooting', label: 'Shooting'},
  {projectStatus: 'See Notes', label: 'See Notes'},
  {projectStatus: 'On Hiatus', label: 'On Hiatus'},
  {projectStatus: 'On Hold', label: 'On Hold'},
  {projectStatus: 'Unknown', label: 'Unknown'},
  {projectStatus: 'Wrapped', label: 'Wrapped'},
  {projectStatus: 'Canceled', label: 'Canceled'},
];

module.exports = {
  DATE_FORMAT_LONG,
  DATE_FORMAT_SHORT,
  DATE_FORMAT_SHORT_FRIENDLY,
  PROJECT_ENUM,
  STATUS_ENUM,
  CASTING_TITLES_ENUM,
  PROJECT_TYPES_ENUM,
  PROJECT_STATUSES_ENUM
}
