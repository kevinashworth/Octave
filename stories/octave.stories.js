import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
// import { linkTo } from '@storybook/addon-links'
// import StoryRouter from 'storybook-react-router'

import { contactData, officeData, projectData } from './data.js'
import theStats from './data-stats.js'

import ThemeCard from './ThemeCard.jsx'

import AddressDetail from '../packages/octave/lib/components/common/AddressDetail.jsx'
import ContactDetail from '../packages/octave/lib/components/common/ContactDetail.jsx'
import ErrorBoundary from '../packages/octave/lib/components/common/ErrorBoundary.jsx'
import LineChartLarge from '../packages/octave/lib/components/common/Trends/LineChartLarge.jsx'
import LinkDetail from '../packages/octave/lib/components/common/LinkDetail.jsx'
import MyLoading from '../packages/octave/lib/components/common/MyLoading.jsx'
import PhoneDetail from '../packages/octave/lib/components/common/PhoneDetail.jsx'
import GlobalFilter from '../packages/octave/lib/components/common/react-table/GlobalFilter.jsx'
import ContactMini from '../packages/octave/lib/components/contacts/ContactMini.jsx'
import OfficeMini from '../packages/octave/lib/components/offices/OfficeMini.jsx'
import ProjectMini from '../packages/octave/lib/components/projects/ProjectMini.jsx'

addDecorator(storyFn => <ThemeCard>{storyFn()}</ThemeCard>)

storiesOf('Octave/Common/AddressDetail', module)
  .add('Default', () => (
    <AddressDetail address={officeData.addresses[0]} />
  ))

storiesOf('Octave/Common/ContactDetail', module)
  .add('Default', () => (
    <ContactDetail contact={officeData.contacts[0]} />
  ))

storiesOf('Octave/Common/ErrorBoundary', module)
  .add('Default', () => (
    <ErrorBoundary>Default</ErrorBoundary>
  ))

storiesOf('Octave/Common/LinkDetail', module)
  .add('Default', () => (
    <>
      <LinkDetail link={projectData.links[0]} />
      <LinkDetail link={projectData.links[1]} />
    </>
  ))

storiesOf('Octave/Common/LineChartLarge', module)
  .add('Default', () => (
    <LineChartLarge theStats={theStats} />
  ))

storiesOf('Octave/Common/MyLoading', module)
  .add('Default', () => <MyLoading />)
  .add('Large', () => <MyLoading height={80} />)
  .add('Primary Variant', () => <MyLoading variant='primary' />)

storiesOf('Octave/Common/PhoneDetail', module)
  .add('Default', () => (
    <PhoneDetail phone={officeData.phones[0]} />
  ))

storiesOf('Octave/Contacts/ContactMini', module)
  .add('Default', () => (
    <ContactMini document={contactData} documentId='KbJXy2kb3LezW7v5q' />
  ))

storiesOf('Octave/Offices/OfficeMini', module)
  .add('Default', () => (
    <OfficeMini document={officeData} documentId='DLF5b8mntvgMfpQyf' />
  ))

storiesOf('Octave/Projects/ProjectMini', module)
  .add('Default', () => (
    <ProjectMini document={projectData} documentId='oJS7SvurxsG2jEFrZ' />
  ))

storiesOf('Octave/Datatables/GlobalFilter', module)
  .add('Default', () => (
    <GlobalFilter />
  ))
  .add('Search Text', () => (
    <GlobalFilter globalFilter='foo' />
  ))
