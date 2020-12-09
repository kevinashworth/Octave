const algoliaSettings = {
  attributesToHighlight: [
    'body',
    'name'
  ],
  attributesToSnippet: [
    'body:10'
  ],
  exactOnSingleWordQuery: 'word',
  highlightPostTag: '</strong>',
  highlightPreTag: '<strong>',
  hitsPerPage: 24,
  paginationLimitedTo: 48,
  ranking: [
    'desc(boosted)',
    'exact',
    'asc(name)',
    'desc(updatedAt)',
    'typo',
    'words',
    'proximity',
    'attribute'
  ],
  searchableAttributes: [
    'name',
    'body',
    'notes',
    'addressString',
    'network',
    'url'
  ],
  snippetEllipsisText: '…'
}

export default algoliaSettings
