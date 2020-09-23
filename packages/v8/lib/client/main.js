/* Due to FragmentsDashboard crashing, moved whyDidYouRender to AppGenerator.jsx in Vulcan */
// import React from 'react'
//
// if (process.env.NODE_ENV === 'development') {
// const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React);
// }

import '../modules/index.js'
import './logger.js'

document.body.classList.add('app')
document.body.classList.add('sidebar-fixed')
