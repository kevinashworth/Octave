scalar JSON
scalar Date

# A user object
type User {
  _id: String
  username: String
  createdAt: Date
  isAdmin: Boolean
  profile: JSON
  services: JSON
  displayName: String
  bio: String
  email: String
  emailHash: String
  avatarUrl: String
  htmlBio: String
  karma: Float
  slug: String
  website: String
  twitterUsername: String
  groups: [String]
  pageUrl: String
  editUrl: String
}

# A user object (input type)
input UsersInput {
  username: String
  isAdmin: Boolean
  profile: JSON
  displayName: String
  bio: String
  email: String
  website: String
  twitterUsername: String
  groups: [String]
}

# A user object (unset input type)
input UsersUnset {
  username: Boolean
  isAdmin: Boolean
  profile: Boolean
  displayName: Boolean
  bio: Boolean
  email: Boolean
  website: Boolean
  twitterUsername: Boolean
  groups: Boolean
}

# Type for Settings
type Setting {
  name: String
  value: JSON
  defaultValue: JSON
  isPublic: Boolean
  description: String
}

# Type for Callbacks
type Callback {
  name: String
  arguments: [JSON]
  runs: String
  newSyntax: Boolean
  returns: String
  description: String
  hooks: [String]
}

# Type for Contacts
type Contact {
  _id: String
  createdAt: Date
  userId: String
  displayName: String
  firstName: String
  middleName: String
  lastName: String
  title: String
  gender: String
  body: String
  links: [JSON]
  street1: String
  street2: String
  city: String
  state: String
  zip: String
  slug: String
  updatedAt: Date
  fullName: String
}

# Type for Contacts (input type)
input ContactsInput {
  displayName: String
  firstName: String
  middleName: String
  lastName: String
  title: String
  gender: String
  body: String
  links: [JSON]
  street1: String
  street2: String
  city: String
  state: String
  zip: String
}

# Type for Contacts (unset input type)
input ContactsUnset {
  displayName: Boolean
  firstName: Boolean
  middleName: Boolean
  lastName: Boolean
  title: Boolean
  gender: Boolean
  body: Boolean
  links: Boolean
  street1: Boolean
  street2: Boolean
  city: Boolean
  state: Boolean
  zip: Boolean
}

# Type for Projects
type Project {
  _id: String
  createdAt: Date
  userId: String
  projectTitle: String
  projectType: String
  union: String
  network: String
  status: String
  logline: String
  notes: String
  season: String
  order: String
  castingCompany: String
  personnel: [JSON]
  address: JSON
  slug: String
  updatedAt: Date
}

# Type for Projects (input type)
input ProjectsInput {
  projectTitle: String
  projectType: String
  union: String
  network: String
  status: String
  logline: String
  notes: String
  season: String
  order: String
  castingCompany: String
  personnel: [JSON]
  address: JSON
}

# Type for Projects (unset input type)
input ProjectsUnset {
  projectTitle: Boolean
  projectType: Boolean
  union: Boolean
  network: Boolean
  status: Boolean
  logline: Boolean
  notes: Boolean
  season: Boolean
  order: Boolean
  castingCompany: Boolean
  personnel: Boolean
  address: Boolean
}

type Site {
  title: String
  url: String
  logoUrl: String
}

type Query {

  SiteData: Site

  UsersList(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # How much to offset the results by
    offset: Int,
    # A limit for the query
    limit: Int,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): [User]

  UsersSingle(
    # The document\'s unique ID
    documentId: String,
    # A unique slug identifying the document
    slug: String,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): User

  UsersTotal(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Int

  currentUser: User

  SettingsList(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # How much to offset the results by
    offset: Int,
    # A limit for the query
    limit: Int,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): [Setting]

  SettingsTotal(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Int

  CallbacksList(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # How much to offset the results by
    offset: Int,
    # A limit for the query
    limit: Int,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): [Callback]

  CallbacksTotal(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Int

  # A list of Contacts documents matching a set of query terms
  ContactsList(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # How much to offset the results by
    offset: Int,
    # A limit for the query
    limit: Int,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): [Contact]

  # A single Contacts document fetched by ID or slug
  ContactsSingle(
    # The document\'s unique ID
    documentId: String,
    # A unique slug identifying the document
    slug: String,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Contact

  # The total count of Contacts documents matching a set of query terms
  ContactsTotal(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Int

  # A list of Projects documents matching a set of query terms
  ProjectsList(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # How much to offset the results by
    offset: Int,
    # A limit for the query
    limit: Int,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): [Project]

  # A single Projects document fetched by ID or slug
  ProjectsSingle(
    # The document\'s unique ID
    documentId: String,
    # A unique slug identifying the document
    slug: String,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Project

  # The total count of Projects documents matching a set of query terms
  ProjectsTotal(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Int

}

type Mutation {

  usersNew(
    # The document to insert
    document: UsersInput
  ) : User

  usersEdit(
    # The unique ID of the document to edit
    documentId: String,
    # An array of fields to insert
    set: UsersInput,
    # An array of fields to delete
    unset: UsersUnset
  ) : User

  usersRemove(
    # The unique ID of the document to delete
    documentId: String
  ) : User

  # Mutation for inserting new Contacts documents
  ContactsNew(
    # The document to insert
    document: ContactsInput
  ) : Contact

  # Mutation for editing a Contacts document
  ContactsEdit(
    # The unique ID of the document to edit
    documentId: String,
    # An array of fields to insert
    set: ContactsInput,
    # An array of fields to delete
    unset: ContactsUnset
  ) : Contact

  # Mutation for upserting a Contacts document
  ContactsUpsert(
    # The document to search for (or partial document)
    search: JSON,
    # An array of fields to insert
    set: ContactsInput,
    # An array of fields to delete
    unset: ContactsUnset
  ) : Contact

  # Mutation for deleting a Contacts document
  ContactsRemove(
    # The unique ID of the document to delete
    documentId: String
  ) : Contact

  # Mutation for inserting new Projects documents
  ProjectsNew(
    # The document to insert
    document: ProjectsInput
  ) : Project

  # Mutation for editing a Projects document
  ProjectsEdit(
    # The unique ID of the document to edit
    documentId: String,
    # An array of fields to insert
    set: ProjectsInput,
    # An array of fields to delete
    unset: ProjectsUnset
  ) : Project

  # Mutation for upserting a Projects document
  ProjectsUpsert(
    # The document to search for (or partial document)
    search: JSON,
    # An array of fields to insert
    set: ProjectsInput,
    # An array of fields to delete
    unset: ProjectsUnset
  ) : Project

  # Mutation for deleting a Projects document
  ProjectsRemove(
    # The unique ID of the document to delete
    documentId: String
  ) : Project

}
