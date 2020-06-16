import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
// import { linkTo } from '@storybook/addon-links'
// import StoryRouter from 'storybook-react-router'

import { contactData, officeData, projectData } from './data.js'
import theStats from './the-stats.js'

import ThemeCard from './ThemeCard.jsx'

import AddressDetail from '../packages/v8/lib/components/common/AddressDetail.jsx'
import ContactDetail from '../packages/v8/lib/components/common/ContactDetail.jsx'
import ErrorBoundary from '../packages/v8/lib/components/common/ErrorBoundary.jsx'
import LineChartLarge from '../packages/v8/lib/components/common/Dashboard/LineChartLarge.jsx'
import LinkDetail from '../packages/v8/lib/components/common/LinkDetail.jsx'
import MyLoading from '../packages/v8/lib/components/common/MyLoading.jsx'
import PhoneDetail from '../packages/v8/lib/components/common/PhoneDetail.jsx'
import GlobalFilter from '../packages/v8/lib/components/common/react-table/GlobalFilter.jsx'
import ContactMini from '../packages/v8/lib/components/contacts/ContactMini.jsx'
import OfficeMini from '../packages/v8/lib/components/offices/OfficeMini.jsx'
import OfficesDataTableLoading from '../packages/v8/lib/components/offices/OfficesDataTableLoading.jsx'
import ProjectMini from '../packages/v8/lib/components/projects/ProjectMini.jsx'

addDecorator(storyFn => <ThemeCard>{storyFn()}</ThemeCard>)

storiesOf('V8/Common/AddressDetail', module)
  .add('Default', () => (
    <AddressDetail address={officeData.addresses[0]} />
  ))

storiesOf('V8/Common/ContactDetail', module)
  .add('Default', () => (
    <ContactDetail contact={officeData.contacts[0]} />
  ))

storiesOf('V8/Common/ErrorBoundary', module)
  .add('Default', () => (
    <ErrorBoundary>Default</ErrorBoundary>
  ))

storiesOf('V8/Common/LinkDetail', module)
  .add('Default', () => (
    <LinkDetail link={projectData.links[0]} />
  ))

storiesOf('V8/Common/LineChartLarge', module)
  .add('Default', () => (
    <LineChartLarge theStats={theStats} />
  ))

storiesOf('V8/Common/MyLoading', module)
  .add('Default', () => <MyLoading />)
  .add('Large', () => <MyLoading height={80} />)
  .add('Primary Variant', () => <MyLoading variant='primary' />)

storiesOf('V8/Common/PhoneDetail', module)
  .add('Default', () => (
    <PhoneDetail phone={officeData.phones[0]} />
  ))

storiesOf('V8/Contacts/ContactMini', module)
  .add('Default', () => (
    <ContactMini document={contactData} documentId='KbJXy2kb3LezW7v5q' />
  ))

storiesOf('V8/Offices/OfficeMini', module)
  .add('Default', () => (
    <OfficeMini document={officeData} documentId='DLF5b8mntvgMfpQyf' />
  ))

storiesOf('V8/Projects/ProjectMini', module)
  .add('Default', () => (
    <ProjectMini document={projectData} documentId='oJS7SvurxsG2jEFrZ' />
  ))

storiesOf('V8/Datatables/GlobalFilter', module)
  .add('Default', () => (
    <GlobalFilter />
  ))
  .add('Search Text', () => (
    <GlobalFilter globalFilter='foo' />
  ))

storiesOf('V8/Datatables/OfficesDataTableLoading', module)
  .add('Default', () => (
    <OfficesDataTableLoading />
  ))
