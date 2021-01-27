import React from 'react'
import styled from 'styled-components'

const Transparent = styled.span`
  margin: 5px 0 0 5px;
  color: transparent;
`

const Visible = styled.span`
  --fa-secondary-opacity: 0.2;
  margin: 5px 0 0 5px;
`

const CaretNone = () => <Transparent className='fad fa-sort' />

const CaretSort = () => <Visible className='fad fa-sort' />

const CaretSortDown = () => <Visible className='fad fa-sort-down' />

const CaretSortUp = () => <Visible className='fad fa-sort-up' />

const Caret = ({ column }) => {
  if (!column.canSort) {
    return <CaretNone />
  }
  if (column.isSorted && column.isSortedDesc) {
    return <CaretSortDown />
  } else if (column.isSorted) {
    return <CaretSortUp />
  }
  return <CaretSort />
}

export default Caret
