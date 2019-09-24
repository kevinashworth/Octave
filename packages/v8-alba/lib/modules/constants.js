const DATE_FORMAT_LONG = 'MMMM D YYYY, h:mm A'
const DATE_FORMAT_SHORT = 'YYYY-MM-DD'
const DATE_FORMAT_SHORT_FRIENDLY = 'MMM D'

const CASTING_TITLES_ENUM = [
  { value: 'Casting Director', label: 'Casting Director' },
  { value: 'Casting Director / Associate', label: 'Casting Director / Associate' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Associate / Assistant', label: 'Associate / Assistant' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Assistant / Intern', label: 'Assistant / Intern' },
  { value: 'Intern', label: 'Intern' },
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
  { value: 'TV Animation', label: 'TV Animation' },
  { value: 'New Media', label: 'New Media' }
]

const BROADCAST_ENUM = [
  'ABC',
  'CBS',
  'CW', // In SAG-AFTRA terms, "Made For: Broadcast Non-Network (WB/UPN/CW)" or "CW Supplement"
  'FOX',
  'Fox',
  'NBC',
  'The CW'
]

const CABLE_ENUM = [
  'Adult Swim',
  'AMC',
  'Audience',
  'BET',
  'Bravo',
  'Cartoon Network',
  'CMT',
  'Comedy Central',
  'Disney',
  'Disney Channel',
  'Disney XD',
  'E!',
  'Freeform',
  'FX',
  'FXX',
  'Hallmark',
  'History',
  'History Channel',
  'IFC',
  'Lifetime',
  'Logo',
  'MTV',
  'Nat Geo',
  'Nick',
  'Nick Jr.',
  'OWN',
  'Paramount',
  'Paramount Network',
  'Pop TV',
  'Spike', // became Paramount Network in 2018
  'Sundance',
  'SyFy',
  'TBS',
  'TLC',
  'TNT',
  'TruTV',
  'truTV',
  'TV Land',
  'USA',
  'VH1',
  'Viceland',
  'WGN'
]

const PAYTV_ENUM = [
  'Cinemax',
  'Epix',
  'HBO',
  'Showtime',
  'Starz'
]

const SVOD_ENUM = [
  'Amazon',
  'Amazon Prime',
  'Apple TV+',
  'BET+',
  'CBS All Access',
  'DC Universe',
  'Disney+',
  'Netflix',
  'Quibi',
  'Spectrum Originals',
  'Seeso', // closed Nov 2017
  'Viaplay',
  'YouTube Premium', // formerly YouTube Red
  'YouTube Red'
]

const AVOD_ENUM = [
  'Crackle',
  'HBO Max',
  'Hulu',
  'NBCUniversal streaming', // before it was named Peacock
  'Peacock',
  'Sony Crackle',
  'Vudu'
]

const ACTIVE_PROJECT_STATUSES_ENUM = [
  { value: 'Casting', label: 'Casting' },
  { value: 'Shooting', label: 'Shooting' },
  { value: 'See Notes', label: 'See Notes' },
  { value: 'Pre-Prod.', label: 'Pre-Prod.' },
  { value: 'Ordered', label: 'Ordered' },
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

const SIZE_PER_PAGE_LIST_SEED = [{
  text: '20', value: 20
}, {
  text: '50', value: 50
}, {
  text: '100', value: 100
}]

module.exports = {
  DATE_FORMAT_LONG,
  DATE_FORMAT_SHORT,
  DATE_FORMAT_SHORT_FRIENDLY,
  CASTING_TITLES_ENUM,
  PROJECT_TYPES_ENUM,
  BROADCAST_ENUM,
  CABLE_ENUM,
  PAYTV_ENUM,
  SVOD_ENUM,
  AVOD_ENUM,
  ACTIVE_PROJECT_STATUSES_ENUM,
  PAST_PROJECT_STATUSES_ENUM,
  PROJECT_STATUSES_ENUM,
  ACTIVE_PROJECT_STATUSES_ARRAY,
  PAST_PROJECT_STATUSES_ARRAY,
  PROJECT_STATUSES_ARRAY,
  SIZE_PER_PAGE_LIST_SEED
}
