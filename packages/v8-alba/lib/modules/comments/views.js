import { Comments } from './collection.js';

Comments.addView('Comments', function (terms) {
  return {
    selector: {
      collectionName: terms.collectionName,
      objectId: terms.objectId
    },
    options: {sort: {postedAt: -1}}
  };
});

Comments.addView('userComments', function (terms) {
  return {
    selector: {userId: terms.userId},
    options: {sort: {postedAt: -1}}
  };
});
