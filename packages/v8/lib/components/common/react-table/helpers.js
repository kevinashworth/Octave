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

export const linkFormatter = ({ cell, collection, row }) => {
  return (
    <Link to={`/${collection}/${row.original._id}/${row.original.slug}`}>
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

export function getSortTitle (title) {
  const theTitle = title.trim().toLowerCase()
  const firstSpace = theTitle.indexOf(' ')
  const firstWord = theTitle.slice(0, firstSpace)
  let sortTitle = ''
  switch (firstWord) {
    case 'a':
    case 'an':
    case 'the':
      sortTitle = theTitle.slice(firstSpace + 1)
      break
    default:
      sortTitle = theTitle
  }
  return sortTitle
}

export function titleSortFn (rowA, rowB) {
  const a = rowA.values.sortTitle
  const b = rowB.values.sortTitle
  return a.localeCompare(b)
}

export function nameSortFn (rowA, rowB) {
  const a = rowA.values.displayName
  const b = rowB.values.displayName
  return a.localeCompare(b)
}

// see https://stackoverflow.com/questions/29829205/sort-an-array-so-that-null-values-always-come-last
export function mySortFn (rowA, rowB, columnId) {
  const a = rowA.values[columnId]
  const b = rowB.values[columnId]
  return (a === null) - (b === null) || +(a > b) || -(a < b)
}
