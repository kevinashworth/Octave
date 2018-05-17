import { addRoute } from 'meteor/vulcan:core';

addRoute([
  {path: '/',                    name: 'Home',           componentName: 'Dashboard'}, // <Redirect from='/' to='/dashboard'/>
  {path: '/dashboard',           name: 'Dashboard',      componentName: 'Dashboard'},
  {path: '/contacts',            name: 'Contacts (T)',   componentName: 'ContactsTable'},
  {path: '/contacts/:_id/edit',         name: 'contacts.edit',   componentName: 'ContactsEditForm'},
  {path: '/contacts/:_id(/:slug)',      name: 'contacts.single', componentName: 'ContactsSingle'},
  {path: '/contactsdatatable',   name: 'Contacts (DT)',  componentName: 'ContactsDataTable'},
  {path: '/cdt',                        name: 'CDT',             componentName: 'CDT'},
  {path: '/modals',              name: 'Modals Test',    componentName: 'Modals'},
  {path: '/offices',                    name: 'Offices',         componentName: 'OfficesListGroup'},
  {path: '/projects',                   name: 'Projects (T)',    componentName: 'ProjectsTable'},
  {path: '/projectsdatatable',          name: 'Projects (DT)',   componentName: 'ProjectsDataTable'},
  {path: '/projects/:_id/edit',         name: 'projects.edit',   componentName: 'ProjectsEditForm'},
  {path: '/projects/:_id(/:slug)',      name: 'projects.single', componentName: 'ProjectsSingle'},
]);
