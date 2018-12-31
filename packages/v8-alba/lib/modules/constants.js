const DATE_FORMAT_LONG = 'MMMM D YYYY, h:mm A'
const DATE_FORMAT_SHORT = 'YYYY-MM-DD'
const DATE_FORMAT_SHORT_FRIENDLY = 'MMM D'

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
]

const CASTING_TITLES_ENUM = [
  { value: 'Casting Director', label: 'Casting Director' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Casting Director / Associate', label: 'Casting Director / Associate' },
  { value: 'Associate / Assistant', label: 'Associate / Assistant' },
  { value: 'Assistant / Intern', label: 'Assistant / Intern' },
  { value: 'Unknown', label: 'Unknown' }
]

const PROJECT_TYPES_ENUM = [
  { value: 'Feature Film', label: 'Feature Film' },
  { value: 'Feature Film (LB)', label: 'Feature Film (LB)' },
  { value: 'Feature Film (MLB)', label: 'Feature Film (MLB)' },
  { value: 'Feature Film (ULB)', label: 'Feature Film (ULB)' },
  { value: 'Short Film', label: 'Short Film' },
  { value: 'Pilot One Hour', label: 'Pilot One Hour' },
  { value: 'Pilot 1/2 Hour', label: 'Pilot 1/2 Hour' },
  { value: 'Pilot Presentation', label: 'Pilot Presentation' },
  { value: 'TV One Hour', label: 'TV One Hour' },
  { value: 'TV 1/2 Hour', label: 'TV 1/2 Hour' },
  { value: 'TV Daytime', label: 'TV Daytime' },
  { value: 'TV Mini-Series', label: 'TV Mini-Series' },
  { value: 'TV Movie', label: 'TV Movie' },
  { value: 'TV Telefilm', label: 'TV Telefilm' },
  { value: 'TV Talk/Variety', label: 'TV Talk/Variety' },
  { value: 'TV Sketch/Improv', label: 'TV Sketch/Improv' },
  { value: 'New Media', label: 'New Media' }
]

const ACTIVE_PROJECT_STATUSES_ENUM = [
  { value: 'Casting', label: 'Casting' },
  { value: 'Ordered', label: 'Ordered' },
  { value: 'Pre-Prod.', label: 'Pre-Prod.' },
  { value: 'Shooting', label: 'Shooting' },
  { value: 'See Notes', label: 'See Notes' },
  { value: 'On Hiatus', label: 'On Hiatus' },
  { value: 'On Hold', label: 'On Hold' }
]

const PAST_PROJECT_STATUSES_ENUM = [
  { value: 'Relocated', label: 'Relocated' },
  { value: 'Unknown', label: 'Unknown' },
  { value: 'Wrapped', label: 'Wrapped' },
  { value: 'Canceled', label: 'Canceled' }
]

const PROJECT_STATUSES_ENUM = ACTIVE_PROJECT_STATUSES_ENUM.concat(PAST_PROJECT_STATUSES_ENUM)

const ACTIVE_PROJECT_STATUSES_ARRAY = ACTIVE_PROJECT_STATUSES_ENUM.map(o => o.label)
const PAST_PROJECT_STATUSES_ARRAY = PAST_PROJECT_STATUSES_ENUM.map(o => o.label)
const PROJECT_STATUSES_ARRAY = ACTIVE_PROJECT_STATUSES_ARRAY.concat(PAST_PROJECT_STATUSES_ARRAY)

module.exports = {
  DATE_FORMAT_LONG,
  DATE_FORMAT_SHORT,
  DATE_FORMAT_SHORT_FRIENDLY,
  PROJECT_ENUM,
  CASTING_TITLES_ENUM,
  PROJECT_TYPES_ENUM,
  ACTIVE_PROJECT_STATUSES_ENUM,
  PAST_PROJECT_STATUSES_ENUM,
  PROJECT_STATUSES_ENUM,
  ACTIVE_PROJECT_STATUSES_ARRAY,
  PAST_PROJECT_STATUSES_ARRAY,
  PROJECT_STATUSES_ARRAY
}
