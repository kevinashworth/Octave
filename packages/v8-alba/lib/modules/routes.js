import { addRoute } from 'meteor/vulcan:core';

addRoute([
  {path: '/',                    name: 'Home',           componentName: 'Dashboard'}, // <Redirect from='/' to='/dashboard'/>
  {path: '/dashboard',           name: 'Dashboard',      componentName: 'Dashboard'},
  {path: '/contacts',            name: 'Contacts (T)',   componentName: 'ContactsTable'},
  {path: '/contacts/:_id(/:slug)',      name: 'contacts.single', componentName: 'ContactsSingle'},
  {path: '/contacts/:_id(/:slug)/edit', name: 'contacts.edit',   componentName: 'ContactsEditForm'},
  {path: '/contactsdatatable',   name: 'Contacts (DT)',  componentName: 'ContactsDataTable'},
  {path: '/cdt',                        name: 'CDT',             componentName: 'CDT'},
  {path: '/modals',              name: 'Modals Test',    componentName: 'Modals'},
]);
