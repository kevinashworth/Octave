import React from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

const ToggleButtons = ({ buttons = ['All', 'None', 'Toggle'], onClickHandler }) => {
  return (
    <ButtonGroup className='mt-2'>
      {buttons.map(
        (label) => (
          <Button
            className='mr-1'
            key={label}
            onClick={onClickHandler}
            variant='outline-secondary'
            size='sm'
          >
            {label}
          </Button>
        )
      )}
    </ButtonGroup>
  )
}

export default ToggleButtons
