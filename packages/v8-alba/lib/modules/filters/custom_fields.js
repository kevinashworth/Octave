import Users from 'meteor/vulcan:users';
import { Utils } from 'meteor/vulcan:core';


const projectDropdownFilters = [
  {
    name: "Filter by type",
    order: 1,
    title: "Type",
    filters: [
      {
        name: "Feature Film",
        show: true
      }, {
        name: "Feature Film (LB)",
        show: true
      }, {
        name: "Feature Film (MLB)",
        show: true
      }, {
        name: "Feature Film (ULB)",
        show: false
      }, {
        name: "Pilot One Hour",
        show: true
      }, {
        name: "Pilot 1/2 Hour",
        show: true
      }, {
        name: "TV One Hour",
        show: true
      }, {
        name: "TV 1/2 Hour",
        show: true
      }, {
        name: "TV Daytime",
        show: true
      }, {
        name: "TV Mini-Series",
        show: true
      }, {
        name: "TV Movie",
        show: true
      }, {
        name: "New Media (SVOD)",
        show: true
      }, {
        name: "New Media (AVOD)",
        show: true
      }, {
        name: "New Media (<$50k)",
        show: false
      }
    ]
  }, {
    name: "Filter by last updated",
    order: 2,
    title: "Last updated",
    filters: [
      {
        name: "One Day",
        show: false
      }, {
        name: "One Week",
        show: false
      }, {
        name: "Two Weeks",
        show: true
      }, {
        name: "One Month",
        show: false
      }, {
        name: "Two Months",
        show: false
      }
    ]
  }, {
    name: "Filter by status",
    order: 3,
    title: "Status",
    filters: [
      { header: "Filter by status" },
      {
        name: "Casting",
        show: true
      }, {
        name: "On Hold",
        show: false
      }, {
        name: "Shooting",
        show: true
      }, {
        name: "On Hiatus",
        show: false
      }, {
        name: "See Notes",
        show: true
      },{
        name: "Unknown",
        show: true
      },
      { header: "Inactive" },
      {
        name: "Wrapped",
        show: false
      }, {
        name: "Canceled",
        show: false
      }
    ]
  }
];

// const filterByType = {
//   name: "Filter by type",
//   order: 2
// };

const addFields = () => {
  projectDropdownFilters[0].filters.forEach(filter => {
    Users.addField({
      fieldName: Utils.slugify(`${projectDropdownFilters[0].name} ${filter.name}`),
      fieldSchema: {
        label: `${filter.name}`,
        type: Boolean,
        optional: true,
        defaultValue: filter.show,
        control: "checkbox",
        viewableBy: ["members"],
        insertableBy: ["admins"],
        editableBy: ["admins"],
        group: {
          name: projectDropdownFilters[0].name,
          order: projectDropdownFilters[0].order
        },
      }
    });
  });

  projectDropdownFilters[0].filters.forEach(filter => {
    Users.addField({
      fieldName: Utils.slugify(`${projectDropdownFilters[1].name} ${filter.name}`),
      fieldSchema: {
        label: `${filter.name}`,
        type: Boolean,
        optional: true,
        defaultValue: filter.show,
        control: "checkbox",
        viewableBy: ["members"],
        insertableBy: ["admins"],
        editableBy: ["admins"],
        group: {
          name: projectDropdownFilters[1].name,
          order: projectDropdownFilters[1].order
        },
      }
    });
  });

  projectDropdownFilters[0].filters.forEach(filter => {
    if (filter.heading) {
      // TODO
    } else {
      Users.addField({
        fieldName: Utils.slugify(`${projectDropdownFilters[2].name} ${filter.name}`),
        fieldSchema: {
          label: `${filter.name}`,
          type: Boolean,
          optional: true,
          defaultValue: filter.show,
          control: "checkbox",
          viewableBy: ["members"],
          insertableBy: ["admins"],
          editableBy: ["admins"],
          group: {
            name: projectDropdownFilters[2].name,
            order: projectDropdownFilters[2].order
          },
        }
      });
    }
  });
};

// Add filter options for project type
addFields();
