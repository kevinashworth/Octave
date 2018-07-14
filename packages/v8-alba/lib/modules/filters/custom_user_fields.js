import { extendFragment } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import _ from 'lodash';

let filterProjectsByType = {
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

let filterProjectsByStatus = {
  "Casting": true,
  "On Hold": false,
  "Shooting": false,
  "On Hiatus": false,
  "See Notes": true,
  "Unknown": true,
  "Wrapped": false,
  "Canceled": false,
};

  // let filterProjectsByLastUpdated = {
  //   filterProjectsByLastUpdated: 'filterProjectsByLastUpdatedTwoWeeks'
  // }

let filterProjectsArray = [];

const addFields = () => {
  _.forEach(filterProjectsByType, function(value, key) {
    const fieldName = _.camelCase(`filterProjectsByType${key}`);
    filterProjectsArray.push(fieldName);
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
        //   name: "filterProjectsByType",
        //   order: 1
        // },
      }
    })
  });

  _.forEach(filterProjectsByStatus, function(value, key) {
    const fieldName = _.camelCase(`filterProjectsByStatus${key}`);
    filterProjectsArray.push(fieldName);
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
        //   name: "filterProjectsByStatus",
        //   order: 2
        // },
      }
    })
  });

  filterProjectsArray.push("filterProjectsByLastUpdated");
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
      //   name: "filterProjectsByStatus",
      //   order: 2
      // },
    }
  })

  const graphQLFilterList = filterProjectsArray.join().replace(/,/g, '\n');

  // registerFragment(`
  //   fragment UserProjectFiltersList on User {
  //     _id
  //     ${graphQLFilterList}
  //   }
  // `);

  extendFragment(
    'UsersCurrent',
    `
    ${graphQLFilterList}
  `
  );
};


// Add filter options for projects
addFields();
