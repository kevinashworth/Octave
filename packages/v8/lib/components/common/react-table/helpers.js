import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { DATE_FORMAT_SHORT, PAGINATION_SIZE } from '../../../modules/constants.js'

export const dateFormatter = ({ cell, row }) => {
  let theDate
  if (!cell.value) { // i.e. there is only a createdAt, not an updatedAt
    theDate = row.original.createdAt
  } else {
    theDate = cell.value
  }
  return moment(theDate).format(DATE_FORMAT_SHORT)
}

export const linkFormatter = ({ cell, row }) => {
  return (
    <Link to={`/offices/${row.original._id}/${row.original.slug}`}>
      {cell.value}
    </Link>
  )
}

export const getPageOptionsVisible = ({ pageCount, pageIndex, pageOptions }) => {
  const fromEnd = (pageCount - 1) - pageIndex

  const firstOptionVisible =
    fromEnd < Math.trunc(PAGINATION_SIZE / 2)
      ? pageIndex - ((PAGINATION_SIZE - 1) - fromEnd)
      : Math.max(pageIndex - Math.trunc(PAGINATION_SIZE / 2), 0)

  const lastOptionVisible = firstOptionVisible + PAGINATION_SIZE

  const pageOptionsVisible =
    pageCount < PAGINATION_SIZE
      ? pageOptions
      : pageOptions.slice(firstOptionVisible, lastOptionVisible)

  return pageOptionsVisible
}
