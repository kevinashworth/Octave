const DATE_FORMAT_LONG = 'MMMM D YYYY, h:mm A'
const DATE_FORMAT_SHORT = 'YYYY-MM-DD'
const DATE_FORMAT_SHORT_FRIENDLY = 'MMM D'
const DATE_FORMAT_MONGO = 'YYYY-MM-DD HH:mm:ss'

const CASTING_TITLES_ENUM = [
  { value: 'Casting Director', label: 'Casting Director' },
  { value: 'Casting Director / Associate', label: 'Casting Director / Associate' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Associate / Assistant', label: 'Associate / Assistant' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Assistant / Intern', label: 'Assistant / Intern' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Casting Executive', label: 'Casting Executive' },
  { value: 'Casting Director / Casting Executive', label: 'Casting Director / Casting Executive' },
  { value: 'Casting Consultant', label: 'Casting Consultant' },
  { value: 'Not Currently In Casting', label: 'Not Currently In Casting' },
  { value: 'Unknown Title', label: 'Unknown Title' }
]

const PHONE_NUMBER_TYPES_ENUM = [
  { value: 'Home', label: 'Home' },
  { value: 'Home Fax', label: 'Home Fax' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Office', label: 'Office' },
  { value: 'Office Fax', label: 'Office Fax' },
  { value: 'Other', label: 'Other' },
]

const ADDRESS_TYPES_ENUM = [
  { value: 'Auditions', label: 'Auditions' },
  { value: 'CSA', label: 'CSA' },
  { value: 'Former', label: 'Former' },
  { value: 'GPS', label: 'GPS' },
  { value: 'Mailing', label: 'Mailing' },
  { value: 'Main Office', label: 'Main Office' },
  { value: 'Office', label: 'Office' },
  { value: 'Other', label: 'Other' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Project', label: 'Project' },
  { value: 'Secondary Office', label: 'Secondary Office' },
  { value: 'Unverified', label: 'Unverified' },
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

const SHOOTING_LOCATIONS_US_ENUM = [
  { value: 'Alabama', label: 'Alabama' },
  { value: 'Albuquerque', label: 'Albuquerque, NM' },
  { value: 'Arkansas', label: 'Arkansas' },
  { value: 'Atlanta', label: 'Atlanta, GA' },
  { value: 'Austin', label: 'Austin, TX' },
  { value: 'Boston', label: 'Boston, MA' },
  { value: 'Chicago', label: 'Chicago, IL' },
  { value: 'Hawaii', label: 'Hawaii' },
  { value: 'Las Vegas', label: 'Las Vegas, NV' },
  { value: 'Los Angeles', label: 'Los Angeles, CA' },
  { value: 'Miami', label: 'Miami, FL' },
  { value: 'New Mexico', label: 'New Mexico' },
  { value: 'New Orleans', label: 'New Orleans, LA' },
  { value: 'New York', label: 'New York, NY' },
  { value: 'Oklahoma', label: 'Oklahoma' },
  { value: 'Philadelphia', label: 'Philadelphia, PA' },
  { value: 'Pittsburgh', label: 'Pittsburgh, PA' },
  { value: 'Portland, ME', label: 'Portland, Maine' },
  { value: 'Portland, OR', label: 'Portland, Oregon' },
  { value: 'Puerto Rico', label: 'Puerto Rico' },
  { value: 'Salt Lake City', label: 'Salt Lake City, UT' },
  { value: 'San Francisco', label: 'San Francisco, CA' },
  { value: 'Santa Fe', label: 'Santa Fe, NM' },
  { value: 'Savannah', label: 'Savannah, GA' },
  { value: 'Seattle', label: 'Seattle, WA' },
  { value: 'Washington', label: 'Washington, DC' },
  { value: 'Wilmington', label: 'Wilmington, NC' },
]
const SHOOTING_LOCATIONS_CANADA_ENUM = [
  { value: 'Toronto', label: 'Toronto, ON' },
  { value: 'Vancouver', label: 'Vancouver, BC' },
  { value: 'Winnipeg', label: 'Winnipeg, MB' },
]
const SHOOTING_LOCATIONS_WORLDWIDE_ENUM = [
    { value: 'Paris', label: 'Paris, France' },
    { value: 'London', label: 'London, UK' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Tokyo', label: 'Tokyo, Japan' },
]
const SHOOTING_LOCATIONS_OTHER_ENUM = [
    { value: 'TBD', label: 'TBD' },
]
export const GROUPED_LOCATIONS_ENUM = [
  {
    label: 'United States',
    options: SHOOTING_LOCATIONS_US_ENUM,
  },
  {
    label: 'Canada',
    options: SHOOTING_LOCATIONS_CANADA_ENUM,
  },
  {
    label: 'Worldwide',
    options: SHOOTING_LOCATIONS_WORLDWIDE_ENUM,
  },
  {
    label: 'Other',
    options: SHOOTING_LOCATIONS_OTHER_ENUM,
  },
];


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
  'NatGeo',
  'National Geographic',
  'Nick',
  'Nickelodeon',
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
  'AppleTV+',
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
  DATE_FORMAT_MONGO,
  CASTING_TITLES_ENUM,
  ADDRESS_TYPES_ENUM,
  PHONE_NUMBER_TYPES_ENUM,
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
