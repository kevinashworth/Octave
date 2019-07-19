import { registerFragment } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import _ from 'lodash'

const projectFilters = [
  {
    name: 'Filter projects by type',
    order: 1,
    label: 'Type',
    filters: [
      {
        name: 'Feature Film',
        show: true
      }, {
        name: 'Feature Film (LB)',
        show: true
      }, {
        name: 'Feature Film (MLB)',
        show: true
      }, {
        name: 'Feature Film (ULB)',
        show: false
      }, {
        name: 'Pilot One Hour',
        show: true
      }, {
        name: 'Pilot 1/2 Hour',
        show: true
      }, {
        name: 'TV One Hour',
        show: true
      }, {
        name: 'TV 1/2 Hour',
        show: true
      }, {
        name: 'TV Daytime',
        show: true
      }, {
        name: 'TV Mini-Series',
        show: true
      }, {
        name: 'TV Movie',
        show: true
      }, {
        name: 'New Media (SVOD)',
        show: true
      }, {
        name: 'New Media (AVOD)',
        show: true
      }, {
        name: 'New Media (<$50k)',
        show: false
      }
    ]
  }, {
    name: 'Filter projects by last updated',
    order: 2,
    label: 'Last updated',
    filters: [
      {
        name: 'One Day',
        show: false
      }, {
        name: 'One Week',
        show: false
      }, {
        name: 'Two Weeks',
        show: true
      }, {
        name: 'One Month',
        show: false
      }, {
        name: 'Two Months',
        show: false
      }
    ]
  }, {
    name: 'Filter projects by status',
    order: 3,
    label: 'Status',
    filters: [
      { header: 'Filter by status' },
      {
        name: 'Casting',
        show: true
      }, {
        name: 'On Hold',
        show: false
      }, {
        name: 'Shooting',
        show: true
      }, {
        name: 'On Hiatus',
        show: false
      }, {
        name: 'See Notes',
        show: true
      }, {
        name: 'Unknown',
        show: true
      },
      { header: 'Inactive' },
      {
        name: 'Wrapped',
        show: false
      }, {
        name: 'Canceled',
        show: false
      }
    ]
  }
]

let projectFiltersArray = []

const addFields = () => {
  projectFilters[0].filters.forEach(filter => {
    const fieldName = _.camelCase(`${projectFilters[0].name} ${filter.name}`)
    projectFiltersArray.push(fieldName)
    Users.addField({
      fieldName: fieldName,
      fieldSchema: {
        label: `${filter.name}`,
        type: Boolean,
        optional: true,
        defaultValue: filter.show,
        control: 'checkbox',
        viewableBy: ['members'],
        insertableBy: ['members'],
        editableBy: ['members'],
        group: {
          label: projectFilters[0].label,
          name: projectFilters[0].name,
          order: projectFilters[0].order
        }
      }
    })
  })

  projectFilters[1].filters.forEach(filter => {
    const fieldName = _.camelCase(`${projectFilters[1].name} ${filter.name}`)
    projectFiltersArray.push(fieldName)
    Users.addField({
      fieldName: fieldName,
      fieldSchema: {
        label: `${filter.name}`,
        type: Boolean,
        optional: true,
        defaultValue: filter.show,
        control: 'checkbox',
        viewableBy: ['members'],
        insertableBy: ['members'],
        editableBy: ['members'],
        group: {
          label: projectFilters[1].label,
          name: projectFilters[1].name,
          order: projectFilters[1].order
        }
      }
    })
  })

  projectFilters[2].filters.forEach(filter => {
    const fieldName = _.camelCase(`${projectFilters[2].name} ${filter.name}`)
    if (filter.header) {
      // TODO
    } else {
      projectFiltersArray.push(fieldName)
      Users.addField({
        fieldName: fieldName,
        fieldSchema: {
          label: `${filter.name}`,
          type: Boolean,
          optional: true,
          defaultValue: filter.show,
          control: 'checkbox',
          viewableBy: ['members'],
          insertableBy: ['members'],
          editableBy: ['members'],
          group: {
            label: projectFilters[2].label,
            name: projectFilters[2].name,
            order: projectFilters[2].order
          }
        }
      })
    }
  })

  const graphQLFilterList = projectFiltersArray.join().replace(/,/g, '\n')

  registerFragment(`
    fragment UserProjectFilterList on User {
      _id
      ${graphQLFilterList}
    }
  `)
}

// Add filter options for projects
addFields()

export default projectFiltersArray
