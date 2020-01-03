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
