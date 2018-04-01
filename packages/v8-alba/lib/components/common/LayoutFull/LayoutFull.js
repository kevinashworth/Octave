import { replaceComponent, Components } from 'meteor/vulcan:core';
import React from 'react';
import {Container} from 'reactstrap';

const LayoutFull = ({ children }) => (
  <div className="app">
    <Components.Header />
    <div className="app-body">
      <Components.Sidebar {...this.props}/>
      <main className="main">
        <Components.Breadcrumb />
        <Container fluid>
          {children}
        </Container>
      </main>
      <Components.Aside />
    </div>
    <Components.Footer />
  </div>
);

replaceComponent('Layout', LayoutFull);
