Store diffs, not whole copies of documents in Patches.

Started out here. See https://stackoverflow.com/questions/4185105/ways-to-implement-data-versioning-in-mongodb/4189257#4189257
```
{
  _id: "vyGJcZ4qgy2TaCukK", // okay to use what are essentially duplicates but in other collections ???
  objectId: "vyGJcZ4qgy2TaCukK", // if there is a problem, switch to storing this separately
  collectionName: "Offices",
  changes : {
    Dec 4 : { "city" : "Omaha", "state" : "Nebraska" },
    Dec 3 : { "city" : "Kansas City", "state" : "Missouri" }
   }
}
```

Now here. See https://github.com/Starcounter-Jack/JSON-Patch

```
{
  "_id": "47p5cux979C6FMiSN",
  "changes": [
    {
      "date": "Sat, 04 Jan 2020 16:36:25 GMT",
      "patch": [
        {
          "op": "replace",
          "path": "/body",
          "value": "Hello, world."
        }
      ]
    }
  ],
  "createdAt": "2020-01-04T16:36:25.980Z",
  "userId": "QzNMTJdveamHh8iGP",
  "updatedAt": "Sat, 04 Jan 2020 16:36:25 GMT",
  "collectionName": "Offices"
}
```
