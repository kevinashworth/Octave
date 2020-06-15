import React from 'react'
import '../packages/v8/lib/stylesheets/compiled/main.css'

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
