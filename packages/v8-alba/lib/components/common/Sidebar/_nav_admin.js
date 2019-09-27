import shortid from 'shortid'

const nav = {
  items: [
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
  items: nav.items.map(item => ({ ...item, id: shortid.generate() }))
}
