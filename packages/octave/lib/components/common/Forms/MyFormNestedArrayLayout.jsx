import { instantiateComponent, replaceComponent } from 'meteor/vulcan:lib'
import React, { useEffect, useState } from 'react'
import { useEffectOnce } from '../../../hooks'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import findIndex from 'lodash/findIndex'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const DragHandle = sortableHandle(({ disabled, sortIndex }) => (
  <i
    className={classNames('fas fa-bars', { 'text-light': disabled })}
    data-cy={`drag-handle-${sortIndex}`}
    tabIndex={0}
  />
))

const SortableItem = sortableElement(({ child, isDisabled, sortIndex }) => (
  <div>
    <DragHandle sortIndex={sortIndex} disabled={isDisabled} />
    {child}
  </div>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <div className='col-sm-9'>{children}</div>
})

const MyFormNestedArrayLayout = (props, context) => {
  const {
    addItem,
    afterComponent,
    arrayField,
    beforeComponent,
    children,
    document,
    formComponents,
    hasErrors,
    label,
    nestedArrayErrors
  } = props
  const FormComponents = formComponents
  const collectionString = arrayField.name.slice(0, -2) // `projects`, `links`, etc.
  const propsCollection = document[collectionString]
  const [collection, setCollection] = useState(propsCollection)
  const [initialCollectionLength, setInitialCollectionLength] = useState(null)
  const [haveDeletedAnItem, setHaveDeletedAnItem] = useState(false)

  useEffectOnce(() => {
    setInitialCollectionLength(propsCollection?.length || 0)
  })

  // Vulcan uses updateCurrentValues to set deleted items to null.
  // drag-n-drop then becomes unreliable, so disable it when we find nulls.
  useEffect(() => {
    if (propsCollection?.length) {
      const collectionWithoutNulls = propsCollection.filter(x => x)
      if (collectionWithoutNulls.length < propsCollection.length) {
        setHaveDeletedAnItem(true)
      }
    }
  }, [propsCollection])

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedCollection = reorder(collection, oldIndex, newIndex)
    setCollection(reorderedCollection)
    context.updateCurrentValues({ [collectionString]: reorderedCollection })
  }

  // disable sortable on new children, or when there's just one child,
  // or after having deleted an item
  const getDisabled = (i) => {
    if (haveDeletedAnItem) {
      return true
    }
    return (i > initialCollectionLength - 1) || (initialCollectionLength <= 1)
  }

  return (
    <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
      {instantiateComponent(beforeComponent, props)}
      <label className='control-label col-sm-3'>{label}</label>
      <SortableContainer distance={2} onSortEnd={handleSortEnd} useDragHandle>
        {React.Children.toArray(children).sort(function (a, b) {
          const aObj = propsCollection[a.props.itemIndex]
          const bObj = propsCollection[b.props.itemIndex]
          const aIndex = findIndex(collection, { contactId: aObj.contactId })
          const bIndex = findIndex(collection, { contactId: bObj.contactId })
          if (aIndex === -1 && bIndex !== -1) { // new entries at end of array
            return 1
          }
          return aIndex - bIndex
        }).map((child, i) => {
          const disabled = getDisabled(i)
          return (
            <SortableItem
              child={child}
              key={`${collectionString}-${i}`}
              index={i}
              sortIndex={i}
              disabled={disabled}
              isDisabled={disabled}
            />
          )
        })}
        {addItem && (
          <FormComponents.Button
            className='form-nested-button form-nested-add'
            size='sm'
            variant='success'
            onClick={addItem}
          >
            <FormComponents.IconAdd height={12} width={12} />
          </FormComponents.Button>
        )}
        {hasErrors
          ? <FormComponents.FieldErrors key='form-nested-errors' errors={nestedArrayErrors} />
          : null}
      </SortableContainer>
      {instantiateComponent(afterComponent, props)}
    </div>
  )
}

MyFormNestedArrayLayout.propTypes = {
  hasErrors: PropTypes.bool.isRequired,
  nestedArrayErrors: PropTypes.array,
  label: PropTypes.node,
  hideLabel: PropTypes.bool,
  addItem: PropTypes.func,
  beforeComponent: PropTypes.node,
  afterComponent: PropTypes.node,
  formComponents: PropTypes.object,
  children: PropTypes.node
}

MyFormNestedArrayLayout.contextTypes = {
  updateCurrentValues: PropTypes.func
}

replaceComponent({
  name: 'FormNestedArrayLayout',
  component: MyFormNestedArrayLayout
})
