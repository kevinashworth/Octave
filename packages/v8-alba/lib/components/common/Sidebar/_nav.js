export default {
  items: [
    {
      title: true,
      name: 'Dashboard',
      wrapper: {          // optional wrapper object
        element: '',      // required valid HTML5 element tag
        attributes: {}    // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ""           // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      title: true,
      name: 'The Info'
    },
    {
      name: 'Contacts (T)',
      url: '/contacts',
      icon: 'icon-people'
    },
    {
      name: 'Contacts (DT)',
      url: '/contactsdatatable',
      icon: 'icon-people'
    },
    {
      name: 'CDT',
      url: '/cdt',
      icon: 'icon-people'
    },
    {
      name: 'Contacts & Projects',
      url: '/contactsandprojects',
      icon: 'icon-book-open'
    },
    {
      name: 'Offices',
      url: '/offices',
      icon: 'icon-briefcase',
    },
    {
      name: 'Projects (T)',
      url: '/projects',
      icon: 'fa fa-picture-o'
    },
    {
      name: 'Projects (DT)',
      url: '/projectsdatatable',
      icon: 'fa fa-camera'
    },
    {
      name: 'Modals',
      url: '/modals',
      icon: 'fa fa-external-link'
    }
  ]
};
