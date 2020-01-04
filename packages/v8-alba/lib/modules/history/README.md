Store diffs, not whole copies of documents in History/Histories.
See https://stackoverflow.com/questions/4185105/ways-to-implement-data-versioning-in-mongodb/4189257#4189257

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

```
{
	"_id" : "YcRdgf2rNfZoYkbn7",
	"changes" : [
		{
			"Fri Jan 03 2020 09:55:35 GMT-0800 (PST)" : {
				"contacts" : [
					{
						"contactId" : "CzXrFuJCuoRbXvY8J",
						"contactName" : "Testing Test",
						"contactTitle" : "Intern"
					}
				],
				"addresses" : [
					{

					}
				]
			}
		},
		{
			"Fri Jan 03 2020 09:56:12 GMT-0800 (PST)" : {
				"addresses" : [
					{
						"street2" : "Stage 4, 555th Floor"
					}
				]
			}
		}
	],
	"collectionName" : "Offices"
}
{
	"_id" : "v4vAkMJ2EyqMmFKGw",
	"changes" : [
		{
			"Fri Jan 03 2020 09:56:38 GMT-0800 (PST)" : {
				"body" : "I'm loving it!",
				"htmlBody" : "<p>I'm loving it!</p>\n"
			}
		}
	],
	"collectionName" : "Offices"
}
```

OR THIS IS BEST!

```
{
	"_id" : "YcRdgf2rNfZoYkbn7",
	"changes" : [
		{
			"date" : ISODate("2020-01-03T21:12:52.207Z"),
			"diff" : {
				"body" : "_Foo_",
				"htmlBody" : "<p><em>Foo</em></p>\n"
			}
		},
		{
			"date" : ISODate("2020-01-03T21:37:13.534Z"),
			"diff" : {
				"addresses" : [
					{
						"street2" : "Stage 4, 5th Floor"
					}
				]
			}
		}
	],
	"collectionName" : "Offices"
}
```


AND THIS IS `FAST`:

```
[KA] YcRdgf2rNfZoYkbn7 FAST diff:
[
{ op: 'add', path: '/updatedAt/0', value: '2' },
{ op: 'add', path: '/updatedAt/1', value: '0' },
{ op: 'add', path: '/updatedAt/2', value: '2' },
{ op: 'add', path: '/updatedAt/3', value: '0' },
{ op: 'add', path: '/updatedAt/4', value: '-' },
{ op: 'add', path: '/updatedAt/5', value: '0' },
{ op: 'add', path: '/updatedAt/6', value: '1' },
{ op: 'add', path: '/updatedAt/7', value: '-' },
{ op: 'add', path: '/updatedAt/8', value: '0' },
{ op: 'add', path: '/updatedAt/9', value: '3' },
{ op: 'add', path: '/updatedAt/10', value: 'T' },
{ op: 'add', path: '/updatedAt/11', value: '2' },
{ op: 'add', path: '/updatedAt/12', value: '1' },
{ op: 'add', path: '/updatedAt/13', value: ':' },
{ op: 'add', path: '/updatedAt/14', value: '3' },
{ op: 'add', path: '/updatedAt/15', value: '7' },
{ op: 'add', path: '/updatedAt/16', value: ':' },
{ op: 'add', path: '/updatedAt/17', value: '1' },
{ op: 'add', path: '/updatedAt/18', value: '3' },
{ op: 'add', path: '/updatedAt/19', value: '.' },
{ op: 'add', path: '/updatedAt/20', value: '5' },
{ op: 'add', path: '/updatedAt/21', value: '3' },
{ op: 'add', path: '/updatedAt/22', value: '4' },
{ op: 'add', path: '/updatedAt/23', value: 'Z' },
{ op: 'remove', path: '/pastProjects' },
{ op: 'remove', path: '/links' },
{ op: 'remove', path: '/projects' },
{ op: 'replace', path: '/addresses/0/street2', value: 'Stage 4, 5th Floor' },
{ op: 'add', path: '/_id', value: 'YcRdgf2rNfZoYkbn7' },
{ op: 'add', path: '/userId', value: 'AhH3HnQKsiAYNQnrj' },
{ op: 'add', path: '/createdAt', value: '2019-12-30T17:26:46.180Z' }
]
```
