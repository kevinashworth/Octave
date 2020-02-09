import { Components, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import React, { Component } from 'react';
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
  AppSidebarNav,
} from '@coreui/react';

import nav from './_nav';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component {
  render() {
    const { children, currentUser, ...rest } = this.props;

    var xsNav = { items: [] };
    xsNav.items.push(...nav.topItems);
    xsNav.items.push(...nav.xsItems);
    if (Users.isAdmin(currentUser)) {
      xsNav.items.push(...nav.adminItems);
    }
    var smNav = { items: [] };
    smNav.items.push(...nav.topItems);
    smNav.items.push(...nav.smItems);
    if (Users.isAdmin(currentUser)) {
      smNav.items.push(...nav.adminItems);
    }

    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader>V8</AppSidebarHeader>
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
            <Container fluid>
              {children}
            </Container>
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

// {currentUser &&
//   <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} />}
