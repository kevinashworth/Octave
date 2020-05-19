import { Components, getSetting, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Media from 'react-media';
import { Container } from 'reactstrap';
import {
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '@coreui/react';

import nav from './_nav';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component {
  render() {
    // currentRoute, currentUserLoading, currentUserData not used by AppSidebarNav, just cause warnings
    const { children, currentUser, currentRoute, currentUserLoading, currentUserData, ...rest } = this.props;

    var xsNav = { items: [] };
    xsNav.items.push(...nav.topItems);
    xsNav.items.push(...nav.xsItems);
    if (getSetting('myDebug') || Users.isAdmin(currentUser)) {
      xsNav.items.push(...nav.develItems);
    }
    if (Users.isAdmin(currentUser)) {
      xsNav.items.push(...nav.adminItems);
    }

    var smNav = { items: [] };
    smNav.items.push(...nav.topItems);
    smNav.items.push(...nav.smItems);
    if (getSetting('myDebug') || Users.isAdmin(currentUser)) {
      smNav.items.push(...nav.develItems);
    }
    if (Users.isAdmin(currentUser)) {
      smNav.items.push(...nav.adminItems);
    }

    return (
      <div className="app">
        <Helmet>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#20a8d8" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Helmet>
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader>The 4th Wall</AppSidebarHeader>
            <AppSidebarForm>
              <Components.Search />
            </AppSidebarForm>
            <Media query='(max-width: 575.98px)' defaultMatches={false}
              render={() => (<AppSidebarNav navConfig={xsNav} {...rest} />)} />
            <Media query='(min-width: 576px)' defaultMatches={true}
              render={() => (<AppSidebarNav navConfig={smNav} {...rest} />)} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {/*<AppBreadcrumb appRoutes={routes}/>*/}
            <Components.FlashMessages />
            {currentUser &&
              <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} />}
            <Container fluid>
              {children}
            </Container>
            <Components.UsersGroups user={currentUser} />
          </main>
          {/* <AppAside fixed hidden>
            <DefaultAside />
          </AppAside> */}
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

replaceComponent({
  name: 'Layout',
  component: DefaultLayout,
  hocs: [withCurrentUser]
});
