import { registerFragment } from "meteor/vulcan:core";

registerFragment(/* GraphQL */ `
  fragment ContactsItemFragment on Contact {
    _id
    createdAt
    userId
    user {
      displayName
    }
  }
`);

registerFragment(/* GraphQL */ `
  fragment ContactsDetailsFragment on Contact {
    _id
    createdAt
    userId
    user {
      displayName
    }
    body
  }
`);
