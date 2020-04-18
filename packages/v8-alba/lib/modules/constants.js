export const DATE_FORMAT_LONG = 'MMMM D YYYY, h:mm A'
export const DATE_FORMAT_SHORT = 'YYYY-MM-DD'
export const DATE_FORMAT_SHORT_FRIENDLY = 'MMM D'
export const DATE_FORMAT_MONGO = 'YYYY-MM-DD HH:mm:ss'

export const CASTING_TITLES_ENUM = [
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

export const PHONE_NUMBER_TYPES_ENUM = [
  { value: 'Home', label: 'Home' },
  { value: 'Home Fax', label: 'Home Fax' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Office', label: 'Office' },
  { value: 'Office Fax', label: 'Office Fax' },
  { value: 'Other', label: 'Other' }
]

export const ADDRESS_TYPES_ENUM = [
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
  { value: 'Unverified', label: 'Unverified' }
]

export const PROJECT_TYPES_ENUM = [
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
  { value: 'TV Talk/Variety', label: 'TV Talk/Variety' },
  { value: 'TV Sketch/Improv', label: 'TV Sketch/Improv' },
  { value: 'TV Animation', label: 'TV Animation' },
  { value: 'New Media', label: 'New Media' }
]

export const SHOOTING_LOCATIONS_US_ENUM = [
  { value: 'Alabama', label: 'Alabama' },
  { value: 'Albuquerque', label: 'Albuquerque, NM' },
  { value: 'Arkansas', label: 'Arkansas' },
  { value: 'Atlanta', label: 'Atlanta, GA' },
  { value: 'Austin', label: 'Austin, TX' },
  { value: 'Boston', label: 'Boston, MA' },
  { value: 'Chicago', label: 'Chicago, IL' },
  { value: 'Dallas', label: 'Dallas, TX' },
  { value: 'Hawaii', label: 'Hawaii' },
  { value: 'Las Vegas', label: 'Las Vegas, NV' },
  { value: 'Los Angeles', label: 'Los Angeles, CA' },
  { value: 'Miami', label: 'Miami, FL' },
  { value: 'Nashville', label: 'Nashville, TN' },
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
  { value: 'Wilmington', label: 'Wilmington, NC' }
]
export const SHOOTING_LOCATIONS_CANADA_ENUM = [
  { value: 'Calgary', label: 'Calgary, MB' },
  { value: 'Montreal', label: 'Montreal, QC' },
  { value: 'Nova Scotia', label: 'Nova Scotia' },
  { value: 'Toronto', label: 'Toronto, ON' },
  { value: 'Vancouver', label: 'Vancouver, BC' },
  { value: 'Winnipeg', label: 'Winnipeg, MB' }
]
export const SHOOTING_LOCATIONS_WORLDWIDE_ENUM = [
  { value: 'Budapest', label: 'Budapest, Hungary' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Iceland', label: 'Iceland' },
  { value: 'London', label: 'London, UK' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Paris', label: 'Paris, France' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Tokyo', label: 'Tokyo, Japan' },
  { value: 'United Kingdom', label: 'United Kingdom' }
]
export const SHOOTING_LOCATIONS_OTHER_ENUM = [
  { value: 'TBD', label: 'TBD' }
]
export const GROUPED_LOCATIONS_ENUM = [
  {
    label: 'United States',
    options: SHOOTING_LOCATIONS_US_ENUM
  },
  {
    label: 'Canada',
    options: SHOOTING_LOCATIONS_CANADA_ENUM
  },
  {
    label: 'Worldwide',
    options: SHOOTING_LOCATIONS_WORLDWIDE_ENUM
  },
  {
    label: 'Other',
    options: SHOOTING_LOCATIONS_OTHER_ENUM
  }
]

export const BROADCAST_ENUM = [
  'ABC',
  'CBS',
  'CW', // In SAG-AFTRA terms, "Made For: Broadcast Non-Network (WB/UPN/CW)" or "CW Supplement"
  'FOX',
  'Fox',
  'NBC',
  'The CW'
]

export const CABLE_ENUM = [
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

export const PAYTV_ENUM = [
  'Cinemax',
  'Epix',
  'HBO',
  'Showtime',
  'Starz'
]

export const SVOD_ENUM = [
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

export const AVOD_ENUM = [
  'Crackle',
  'HBO Max',
  'Hulu',
  'NBCUniversal streaming', // before it was named Peacock
  'Peacock',
  'Sony Crackle',
  'Vudu'
]

// Casting, Shooting, See Notes are the 3 actively Active
// TODO: The number 3 appears on line 170 of ProjectFilters.js
// Pre-Prod., Ordered, On Hiatus, On Hold are not necessarily Active
// Suspended is new as of 2020 for COVID-19 and such
export const ACTIVE_PROJECT_STATUSES_ENUM = [
  { value: 'Casting', label: 'Casting' },
  { value: 'Shooting', label: 'Shooting' },
  { value: 'See Notes', label: 'See Notes' },
  { value: 'On Hiatus', label: 'On Hiatus' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Ordered', label: 'Ordered' },
  { value: 'Pre-Prod.', label: 'Pre-Prod.' },
  { value: 'Suspended', label: 'Suspended' }
]

export const PAST_PROJECT_STATUSES_ENUM = [
  { value: 'Canceled', label: 'Canceled' },
  { value: 'Relocated', label: 'Relocated' },
  { value: 'Unknown', label: 'Unknown' },
  { value: 'Wrapped', label: 'Wrapped' }
]

export const PROJECT_STATUSES_ENUM = ACTIVE_PROJECT_STATUSES_ENUM.concat(PAST_PROJECT_STATUSES_ENUM)

export const ACTIVE_PROJECT_STATUSES_ARRAY = ACTIVE_PROJECT_STATUSES_ENUM.map(o => o.label)
export const PAST_PROJECT_STATUSES_ARRAY = PAST_PROJECT_STATUSES_ENUM.map(o => o.label)
export const PROJECT_STATUSES_ARRAY = ACTIVE_PROJECT_STATUSES_ARRAY.concat(PAST_PROJECT_STATUSES_ARRAY)

export const SIZE_PER_PAGE_LIST_SEED = [{
  text: '20', value: 20
}, {
  text: '50', value: 50
}, {
  text: '100', value: 100
}]

export const nullOption = { value: null, label: '' }
