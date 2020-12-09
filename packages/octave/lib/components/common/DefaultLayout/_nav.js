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
      name: 'Latest Updates',
      url: '/latest',
      icon: 'fad fa-megaphone'
    },
    {
      name: 'Trends',
      url: '/trends',
      icon: 'fad fa-chart-line'
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
      icon: 'fad fa-address-book'
    },
    {
      name: 'Offices',
      url: '/offices',
      icon: 'fad fa-city'
    },
    {
      name: 'Projects',
      url: '/projects',
      icon: 'fad fa-camera',
      prefetch: {
        collection: 'Projects',
        limit: 600
      }
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
      icon: 'fad fa-address-book'
    },
    {
      name: 'Offices (M)',
      url: '/m/offices',
      icon: 'fad fa-city'
    },
    {
      name: 'Projects (M)',
      url: '/m/projects',
      icon: 'fad fa-camera'
    }
  ],
  editorItems: [
    {
      title: true,
      name: 'Create'
    },
    {
      name: 'New Contact',
      url: '/contacts/new',
      icon: 'fad fa-address-card'
    },
    {
      name: 'New Office',
      url: '/offices/new',
      icon: 'fad fa-building'
    },
    {
      name: 'New Project',
      url: '/projects/new',
      icon: 'fad fa-camera'
    }
  ],
  adminItems: [
    {
      title: true,
      name: 'Admin'
    },
    {
      name: 'User Admin',
      url: '/admin/users',
      icon: 'fad fa-user'
    },
    {
      name: 'Comments Admin',
      url: '/admin/comments',
      icon: 'fad fa-comments'
    },
    {
      name: 'Back Office',
      url: '/backoffice',
      icon: 'fad fa-pencil'
    },
    {
      name: 'Statistics',
      url: '/statistics/list',
      icon: 'fad fa-chart-bar',
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
      icon: 'fad fa-balance-scale'
    },
    {
      name: 'Debug',
      url: '/debug',
      icon: 'fad fa-file-code'
    },
    {
      name: 'Fragments',
      url: '/fragments',
      icon: 'fad fa-file-alt'
    },
    {
      name: 'Contacts (M)',
      url: '/m/contacts',
      icon: 'fad fa-address-book'
    },
    {
      name: 'Offices (M)',
      url: '/m/offices',
      icon: 'fad fa-city'
    },
    {
      name: 'Projects (M)',
      url: '/m/projects',
      icon: 'fad fa-camera'
    },
    {
      name: 'QraphQL',
      url: 'http://localhost:4004/graphql',
      icon: 'fab fa-first-order',
      attributes: { target: 'graphql', rel: 'noreferrer noopener' }
    },
    {
      name: 'QraphiQL',
      url: 'http://localhost:4004/graphiql',
      icon: 'fad fa-info',
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
  editorItems: navItems.editorItems.map(item => ({ ...item, id: keyCounter++ })),
  adminItems: navItems.adminItems.map(item => ({ ...item, id: keyCounter++ })),
  develItems: navItems.develItems.map(item => ({ ...item, id: keyCounter++ }))
}
