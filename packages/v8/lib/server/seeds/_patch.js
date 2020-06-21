const seedPatch = {
  _id: 'v4vAkMJ2EyqMmFKGw',
  patches: [
    {
      date: new Date('2020-01-03T21:08:58.333Z').toUTCString(),
      patch: { op: 'replace', path: '/addresses/0/street2', value: 'Stage 4, 5th Floor' }
    }
  ],
  collectionName: 'Offices'
}

module.exports = { seedPatch }
