import { Comments } from './index.js';

Comments.addView('Comments', function (terms) {
  return {
    selector: {
      collectionName: terms.collectionName,
      objectId: terms.document._id
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
