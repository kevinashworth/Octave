import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
// import { linkTo } from '@storybook/addon-links'
// import StoryRouter from 'storybook-react-router'

import { contactData, officeData, projectData } from './data.js'

import ThemeCard from './ThemeCard.jsx'

import AddressDetail from '../packages/v8/lib/components/common/AddressDetail.jsx'
import ErrorBoundary from '../packages/v8/lib/components/common/ErrorBoundary.jsx'
import LinkDetail from '../packages/v8/lib/components/common/LinkDetail.jsx'
import MyLoading from '../packages/v8/lib/components/common/MyLoading.jsx'
import PhoneDetail from '../packages/v8/lib/components/common/PhoneDetail.jsx'
import ContactMini from '../packages/v8/lib/components/contacts/ContactMini.jsx'
import OfficeMini from '../packages/v8/lib/components/offices/OfficeMini.jsx'
// import OfficesSingle from '../packages/v8/lib/components/offices/OfficesSingle.jsx'
import ProjectMini from '../packages/v8/lib/components/projects/ProjectMini.jsx'

addDecorator(storyFn => <ThemeCard>{storyFn()}</ThemeCard>)

storiesOf('V8/AddressDetail', module)
  .add('Default', () => (
    <AddressDetail address={officeData.addresses[0]} />
  ))

storiesOf('V8/ErrorBoundary', module)
  .add('Default', () => (
    <ErrorBoundary>Default</ErrorBoundary>
  ))

storiesOf('V8/LinkDetail', module)
  .add('Default', () => (
    <LinkDetail link={projectData.links[0]} />
  ))

storiesOf('V8/MyLoading', module)
  .add('Default', () => <MyLoading />)
  .add('Large', () => <MyLoading height={80} />)
  .add('Primary Variant', () => <MyLoading variant='primary' />)

storiesOf('V8/PhoneDetail', module)
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

// storiesOf('V8/Offices/OfficesSingle', module)
//   .addDecorator(
//     StoryRouter({
//       '/offices/DLF5b8mntvgMfpQyf/edit': linkTo('Linked stories', 'Edit')
//     })
//   )
//   .add('Default', () => (
//     <OfficesSingle document={officeData} documentId='DLF5b8mntvgMfpQyf' match={{ params: { _id: 'DLF5b8mntvgMfpQyf' } }} />
//   ))

storiesOf('V8/Projects/ProjectMini', module)
  .add('Default', () => (
    <ProjectMini document={projectData} documentId='oJS7SvurxsG2jEFrZ' />
  ))
