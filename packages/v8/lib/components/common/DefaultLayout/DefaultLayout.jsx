import { Components, getSetting, replaceComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Media from 'react-media'
import Container from 'react-bootstrap/Container'
import {
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '../coreui-react'

import nav from './_nav'
import DefaultFooter from './DefaultFooter'
import DefaultHeader from './DefaultHeader'

class DefaultLayout extends Component {
  render () {
    // currentRoute, currentUserLoading, currentUserData not used by AppSidebarNav, just cause warnings
    // eslint-disable-next-line no-unused-vars
    const { children, currentUser, currentRoute, currentUserLoading, currentUserData, ...rest } = this.props

    var xsNav = { items: [] }
    if (!currentUser) {
      xsNav.items.push(...nav.signIn)
    }
    xsNav.items.push(...nav.topItems)
    xsNav.items.push(...nav.xsItems)
    if (Users.isAdmin(currentUser)) {
      xsNav.items.push(...nav.adminItems)
    }
    if (getSetting('myDebug') || Users.isAdmin(currentUser)) {
      xsNav.items.push(...nav.develItems)
    }

    var smNav = { items: [] }
    if (!currentUser) {
      smNav.items.push(...nav.signIn)
    }
    smNav.items.push(...nav.topItems)
    smNav.items.push(...nav.smItems)
    if (Users.isAdmin(currentUser)) {
      smNav.items.push(...nav.adminItems)
    }
    if (getSetting('myDebug') || Users.isAdmin(currentUser)) {
      smNav.items.push(...nav.develItems)
    }

    return (
      <div className='app'>
        <Helmet>
          <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
          <link rel='manifest' href='/favicon/site.webmanifest' />
          <link rel='mask-icon' href='/favicon/safari-pinned-tab.svg' color='#20a8d8' />
          <meta name='msapplication-TileColor' content='#da532c' />
          <meta name='theme-color' content='#ffffff' />
          <script src='https://kit.fontawesome.com/085731bca6.js' crossOrigin='anonymous' />
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css' integrity='sha256-7O1DfUu4pybYI7uAATw34eDrgQaWGOfMV/8erfDQz/Q=' crossOrigin='anonymous' />
        </Helmet>
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className='app-body'>
          <AppSidebar fixed display='lg'>
            <AppSidebarHeader>The 4th Wall</AppSidebarHeader>
            <AppSidebarForm>
              <Components.Search />
            </AppSidebarForm>
            <Media
              defaultMatches={false}
              query='(max-width: 575.98px)'
              render={() => (<AppSidebarNav navConfig={xsNav} {...rest} />)}
            />
            <Media
              defaultMatches
              query='(min-width: 576px)'
              render={() => (<AppSidebarNav navConfig={smNav} {...rest} />)}
            />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className='main'>
            <Components.FlashMessages />
            <Container fluid>
              {children}
            </Container>
            <Components.UsersGroups user={currentUser} />
          </main>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    )
  }
}

replaceComponent({
  name: 'Layout',
  component: DefaultLayout,
  hocs: [withCurrentUser]
})