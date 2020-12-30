import React from 'react'
import '../packages/octave/lib/stylesheets/compiled/main.css'
import '../packages/octave/lib/stylesheets/custom/algolia.css'
import '../packages/octave/lib/stylesheets/custom/btn.css'
import '../packages/octave/lib/stylesheets/custom/datatable.css'
import '../packages/octave/lib/stylesheets/custom/misc.css'
import '../packages/octave/lib/stylesheets/vendors/react-perfect-scrollbar.css'
import '../packages/octave/lib/stylesheets/vendors/react-virtualized/styles.css'

const ThemeCard = ({ children }) => {
  return (
    <main className='main'>
      <div className='container-fluid'>
        <div className='card-accent-warning card'>
          <div className='card-body'>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ThemeCard
