const navItems = {
  signIn: [
    {
      title: true,
      name: 'Sign In'
    },
    {
      name: 'Sign In / Sign Up',
      url: '/login',
      icon: 'fad fa-sign-in'
    }
  ],
  topItems: [
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
      icon: 'fa fa-bullhorn'
    },
    {
      title: true,
      name: 'The Info'
    }
  ],
  smItems: [
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
      icon: 'fad fa-camera'
    },
    {
      name: 'Past Projects',
      url: '/past-projects',
      icon: 'fad fa-camera-retro'
    }
  ],
  xsItems: [
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
      icon: 'fad fa-camera'
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
      icon: 'fad fa-camera'
    },
    {
      name: 'User Admin',
      url: '/admin/users',
      icon: 'fa fa-user-o'
    },
    {
      name: 'Comments Admin',
      url: '/admin/comments',
      icon: 'fa fa-comments-o'
    },
    {
      name: 'Back Office',
      url: '/backoffice',
      icon: 'fa fa-pencil'
    },
    {
      name: 'Statistics',
      url: '/statistics/list',
      icon: 'fa fa-bar-chart',
      badge: {
        variant: 'danger',
        text: 'WIP'
      }
    }
  ],
  develItems: [
    {
      title: true,
      name: 'Development'
    },
    {
      name: 'ApolloTest',
      url: '/test',
      icon: 'fa fa fa-balance-scale'
    },
    {
      name: 'Debug',
      url: '/debug',
      icon: 'fa fa-file-code-o'
    },
    {
      name: 'Fragments',
      url: '/fragments',
      icon: 'fa fa-files-o'
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
      icon: 'fad fa-camera'
    },
    {
      name: 'QraphQL',
      url: 'http://localhost:4004/graphql',
      icon: 'fa fa-first-order',
      attributes: { target: 'graphql', rel: 'noreferrer noopener' }
    },
    {
      name: 'QraphiQL',
      url: 'http://localhost:4004/graphiql',
      icon: 'fa fa-info',
      attributes: { target: 'graphql', rel: 'noreferrer noopener' }
    }
  ]
}

let keyCounter = 0
export default {
  signIn: navItems.signIn.map(item => ({ ...item, id: keyCounter++ })),
  topItems: navItems.topItems.map(item => ({ ...item, id: keyCounter++ })),
  smItems: navItems.smItems.map(item => ({ ...item, id: keyCounter++ })),
  xsItems: navItems.xsItems.map(item => ({ ...item, id: keyCounter++ })),
  adminItems: navItems.adminItems.map(item => ({ ...item, id: keyCounter++ })),
  develItems: navItems.develItems.map(item => ({ ...item, id: keyCounter++ }))
}
