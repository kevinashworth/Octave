/*

My mutation wrapper to remove multiple documents from a collection.

=====
Notes to self:

Given the below from SO, but my limited knowledge, I don't know why Vulcan
provides name and __typename, seems _id is enough.

Here's the debug for a single delete:

--------------- start Contacts Delete Mutator ---------------
// collectionName:  Contacts
// selector:  { _id: 'NJHYaC4vtuPFh8boR' }
--------------- end Contacts Delete Mutator ---------------

+++++
From https://stackoverflow.com/questions/42129604/how-to-delete-multiple-items-with-graphql
You can batch multiple mutations in the same request to the GraphQL server using GraphQL aliases.
Let's say this is how you delete one Item:

mutation deleteOne {
  deleteItem(id: "id1") {
    id
  }
}

Then this is how you can delete multiple items in one request:

mutation deleteMultiple {
  id1: deleteItem(id: "id1") {
    id
  }
  id2: deleteItem(id: "id2") {
    id
  }
  # ... and so on
  id100: deleteItem(id: "id100") {
    id
  }
}
+++++
=====

Sample mutation:

  mutation deleteMovie($input: DeleteMovieInput) {
    deleteMovie(input: $input) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }

Arguments:

  - input
    - input.selector: the id of the document to remove

Child Props:

  - deleteMovie({ selector })

*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { deleteClientTemplate } from 'meteor/vulcan:core';
// import { extractCollectionInfo, extractFragmentInfo } from './handleOptions';

const withMultiDelete = options => {
  // const { collectionName, collection } = extractCollectionInfo(options);
  // const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const query = gql`
    ${deleteClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `;

  return graphql(query, {
    alias: `withMultiDelete${typeName}`,
    props: ({ ownProps, mutate }) => ({
      [`delete${typeName}`]: args => {
        const { selector } = args;
        return mutate({
          variables: { selector }
        });
      },

      // OpenCRUD backwards compatibility
      removeMultiMutation: args => {
        const { documentId } = args;
        const selector = { documentId };
        return mutate({
          variables: { selector }
        });
      }
    })
  });
};

export default withMultiDelete;
