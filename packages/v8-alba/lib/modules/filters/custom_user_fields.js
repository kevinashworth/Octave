import { extendFragment } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import _ from 'lodash';

let projectFiltersByType = {
  "Feature Film": true,
  "Feature Film (LB)": false,
  "Feature Film (MLB)": false,
  "Feature Film (ULB)": false,
  "Pilot One Hour": true,
  "Pilot 1/2 Hour": true,
  "TV One Hour": false,
  "TV 1/2 Hour": false,
  "TV Daytime": false,
  "TV Mini-Series": false,
  "TV Movie": false,
  "New Media (SVOD)": true,
  "New Media (AVOD)": true,
  "New Media (<$50k)": false,
};

let projectFiltersByStatus = {
  "Casting": true,
  "On Hold": false,
  "Shooting": false,
  "On Hiatus": false,
  "See Notes": true,
  "Unknown": true,
  "Wrapped": false,
  "Canceled": false,
};

  // let projectFiltersByLastUpdated = {
  //   filterProjectsByLastUpdated: 'filterProjectsByLastUpdatedTwoWeeks'
  // }

let projectFiltersArray = [];

const addFields = () => {
  _.forEach(projectFiltersByType, function(value, key) {
    const fieldName = _.camelCase(`projectFiltersByType${key}`);
    projectFiltersArray.push(fieldName);
    Users.addField({
      fieldName: fieldName,
      fieldSchema: {
        label: `${key}`,
        type: Boolean,
        optional: true,
        defaultValue: value,
        control: "checkbox",
        viewableBy: ["members"],
        insertableBy: ["members"],
        editableBy: ["members"],
        // group: {
        //   label: "Type",
        //   name: "projectFiltersByType",
        //   order: 1
        // },
      }
    })
  });

  _.forEach(projectFiltersByStatus, function(value, key) {
    const fieldName = _.camelCase(`projectFiltersByStatus${key}`);
    projectFiltersArray.push(fieldName);
    Users.addField({
      fieldName: fieldName,
      fieldSchema: {
        label: `${key}`,
        type: Boolean,
        optional: true,
        defaultValue: value,
        control: "checkbox",
        viewableBy: ["members"],
        insertableBy: ["members"],
        editableBy: ["members"],
        // group: {
        //   label: "Status",
        //   name: "projectFiltersByStatus",
        //   order: 2
        // },
      }
    })
  });

  projectFiltersArray.push("filterProjectsByLastUpdated");
  Users.addField({
    fieldName: "filterProjectsByLastUpdated",
    fieldSchema: {
      label: "filterProjectsByLastUpdated",
      type: String,
      optional: true,
      defaultValue: "filterProjectsByLastUpdatedTwoWeeks",
      control: "text",
      viewableBy: ["members"],
      insertableBy: ["members"],
      editableBy: ["members"],
      // group: {
      //   label: "Status",
      //   name: "projectFiltersByStatus",
      //   order: 2
      // },
    }
  })

  const graphQLFilterList = projectFiltersArray.join().replace(/,/g, '\n');

  // registerFragment(`
  //   fragment UserProjectFiltersList on User {
  //     _id
  //     ${graphQLFilterList}
  //   }
  // `);

  extendFragment(
    'UsersDefaultFragment',
    `
    ${graphQLFilterList}
  `
  );
};


// Add filter options for projects
addFields();
