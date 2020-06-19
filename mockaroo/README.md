# What I'm Doing Here
Trying to script this, instead of using the Mockaroo website.

<s>From the command line, run a Node program that does this:</s>
In `seed.js`, we have code that does this:

1. Create Contacts from a Schema. Upload this CSV as a Dataset, and also convert it to JSON for seeding Contacts Collection.
1. Create Offices from a Schema, using some of those Contacts from that Dataset. Upload CSV as Dataset, convert to JSON.
1. Create Projects from a Schema, using some of those Contacts and Offices from those Datasets. No need to upload as Dataset, just convert to JSON.
1. Create Past Projects from a Schema identical to Projects.
1. Create Statistics from a Schema, save as JSON.

To convert CSV to JSON, I'm using [papaparse](https://www.papaparse.com/). (Previously was using [csvtojson](https://github.com/Keyang/node-csvtojson#nested-json-structure)).

This process won't have all the interconnectedness of real data, but gets close.

# My Mockaroo stuff, on their website:
- [V8](https://mockaroo.com/projects/18659)
- [Schemas](https://mockaroo.com/schemas)
- [Datasets](https://mockaroo.com/lists)


# Helpful code from `mockaroo`

### [Their API](https://mockaroo.com/api/docs)

### [Upload a dataset:](http://forum.mockaroo.com/t/datasets-upload-via-rest-api/501/11)
```
const fetch = require('node-fetch')
const fs = require('fs')

function upload(apiKey, name, path) {
  fetch(`https://api.mockaroo.com/api/upload?key=${encodeURIComponent(apiKey)}&name=${encodeURIComponent(name)}`, {
    method: 'post',
    body: fs.readFileSync(path),
    headers: {
      "content-type": "text/csv"
    }
  })
  .then(res => res.json())
  .then(result => console.log(result))
}
```

### [Delete a dataset:](http://forum.mockaroo.com/t/datasets-upload-via-rest-api/501/11)
```
const fetch = require('node-fetch')
const fs = require('fs')

function destroy(apiKey, name, path) {
  fetch(`https://api.mockaroo.com/api/datasets/${encodeURIComponent(name)}?key=${encodeURIComponent(apiKey)}`, {
    method: 'delete'
  })
  .then(res => res.json())
  .then(result => console.log(result))
}
```

# Helpful snippets `csvtojson`

### [From CSV File to JSON Array](https://github.com/Keyang/node-csvtojson#from-csv-file-to-json-array):
```
/** csv file
a,b,c
1,2,3
4,5,6
*/
const csvFilePath='<path to csv file>'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
	console.log(jsonObj);
	/**
	 * [
	 * 	{a:"1", b:"2", c:"3"},
	 * 	{a:"4", b:"5". c:"6"}
	 * ]
	 */
})

// Async / await usage
const jsonArray=await csv().fromFile(csvFilePath);
```

### [Nested JSON Structure should just work.](https://github.com/Keyang/node-csvtojson#nested-json-structure)
