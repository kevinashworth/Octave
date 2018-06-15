db.contacts.updateOne(
  {_id: "ch3G4DkfPRXLpKDxh"},
  {
    $set: {
    projectIds: [
      {
        projectId: "miAnpe7qHxQLP5kLu",
        projectTitle: "Great News"
      },
      {
        projectId: "b5Kh3LTJug3Z6TQKB",
        projectTitle: "Andi Mack"
      }
      ]
    }
  }
)

db.offices.updateOne(
  {_id: "3JgyZa23h8TvW6xQj"},
  {
    $set: {
    contactIds: [
      "ch3G4DkfPRXLpKDxh",
      "siWZMeiuYuD59wH8m"
      ]
    }
  }
)
