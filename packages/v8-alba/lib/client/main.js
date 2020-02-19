import React from 'react'

// if (process.env.NODE_ENV === 'development') {
//   // const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   // See https://github.com/welldone-software/why-did-you-render/issues/5#issuecomment-467900253
//   const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     include: [/^Contact/, /^Office/, /^PastProject/, /^Project/],
//     exclude: [/NewForm$/, /FormGroup/]
//   });
// }

import '../modules/index.js'

document.body.classList.add('app')
document.body.classList.add('sidebar-fixed')
