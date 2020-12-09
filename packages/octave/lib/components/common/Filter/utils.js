const getCheckboxVariant = (filters) => {
  if (filters.every((filter) => filter.value)) {
    return 'secondary'
  } else {
    return 'danger'
  }
}

const getRadioVariant = (filters) => {
  const all = filters.find((filter) => filter.updated === 'All')
  if (all.value) {
    return 'secondary'
  } else {
    return 'danger'
  }
}

const handleAllNoneToggle = (event, filters, dispatch, action) => {
  const all = event.target.innerHTML.indexOf('All') !== -1
  const none = event.target.innerHTML.indexOf('None') !== -1
  const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
  const length = filters.length
  if (toggle) {
    for (let i = 0; i < length; i++) {
      dispatch(action(i))
    }
  } else if (all || none) {
    for (let i = 0; i < length; i++) {
      if ((none && filters[i].value) || (all && !filters[i].value)) {
        dispatch(action(i))
      }
    }
  }
}

module.exports = {
  getCheckboxVariant,
  getRadioVariant,
  handleAllNoneToggle
}
