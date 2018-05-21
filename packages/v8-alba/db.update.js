db.contacts.updateOne(
  {_id: "cJQ8Ky858AQWiksfS"},
  {
    $set: {
    projectIds: [
      {
        projectId: "twkxT4DvW6DSyMpCx",
        projectTitle: "Great News"
      },
      {
        projectId: "2Lgn7maghuphbk8FL",
        projectTitle: "Andi Mack"
      }
      ]
    }
  }
)

db.offices.updateOne(
  {_id: "Rs6rMWEA5Ys8ZPB4Z"},
  {
    $set: {
    contactIds: [
      "rWN2hbMTZzns8Q93f",
      "AA9PXzDmvSnuoXtNB"
      ]
    }
  }
)
