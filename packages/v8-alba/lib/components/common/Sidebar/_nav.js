import shortid from 'shortid'

const nav = {
  items: [
    {
      title: true,
      name: 'Home'
    },
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Latest Updates',
      url: '/latest',
      icon: 'icon-clock'
    }
  ],
  smItems: [
    {
      title: true,
      name: 'The Info'
    },
    {
      name: 'Contacts',
      url: '/contacts',
      icon: 'icon-people'
    },
    {
      name: 'Offices',
      url: '/offices',
      icon: 'icon-briefcase'
    },
    {
      name: 'Projects',
      url: '/projects',
      icon: 'fa fa-camera'
    },
    {
      name: 'Past Projects',
      url: '/past-projects/datatable',
      icon: 'fa fa-camera'
    }
  ],
  xsItems: [
    {
      title: true,
      name: 'The Info'
    },
    {
      name: 'Contacts (M)',
      url: '/m/contacts',
      icon: 'icon-people'
    },
    {
      name: 'Offices (M)',
      url: '/m/offices',
      icon: 'icon-briefcase'
    },
    {
      name: 'Projects (M)',
      url: '/m/projects',
      icon: 'fa fa-camera'
    }
  ],
  adminItems: [
    {
      title: true,
      name: 'Admin'
    },
    {
      name: 'New Project',
      url: '/projects/new',
      icon: 'fa fa-camera'
    },
    {
      name: 'Fragments',
      url: '/fragments',
      icon: 'fa fa-file-code-o'
    },
    {
      name: 'Modals',
      url: '/modals',
      icon: 'fa fa-external-link'
    },
    {
      name: 'Statistics',
      url: '/statistics/list',
      icon: 'fa fa-bar-chart'
    },
    {
      name: 'User Admin',
      url: '/admin',
      icon: 'fa fa-user-o'
    }
  ]
}

export default {
  items: nav.items.map(item => ({ ...item, id: shortid.generate() })),
  smItems: nav.smItems.map(item => ({ ...item, id: shortid.generate() })),
  xsItems: nav.xsItems.map(item => ({ ...item, id: shortid.generate() })),
  adminItems: nav.adminItems.map(item => ({ ...item, id: shortid.generate() }))
}
