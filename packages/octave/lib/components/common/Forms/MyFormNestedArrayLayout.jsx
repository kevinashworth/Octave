import { instantiateComponent, replaceComponent } from 'meteor/vulcan:lib'
import React, { useState } from 'react'
import { useEffectOnce } from '../../../hooks'
import PropTypes from 'prop-types'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const DragHandle = sortableHandle(({ sortIndex }) => <i className='fas fa-bars' data-cy={`drag-handle-${sortIndex}`} tabIndex={0} />)

const SortableItem = sortableElement(({ child, isDisabled, sortIndex }) => (
  <div>
    {!isDisabled &&
      <DragHandle sortIndex={sortIndex} />}
    {child}
  </div>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <div className='col-sm-9'>{children}</div>
})

const MyFormNestedArrayLayout = (props, context) => {
  const {
    hasErrors,
    nestedArrayErrors,
    label,
    addItem,
    beforeComponent,
    afterComponent,
    formComponents,
    children
  } = props
  const FormComponents = formComponents
  const collectionString = props.arrayField.name.slice(0, -2) // `projects`, `links`, etc.
  const [collection, setCollection] = useState(props.document[collectionString])
  const [origCollLength, setOrigCollLength] = useState(0)

  useEffectOnce(() => {
    setOrigCollLength(props.document[collectionString] ? props.document[collectionString].length : 0)
  })

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedCollection = reorder(collection, oldIndex, newIndex)
    setCollection(reorderedCollection)
    context.updateCurrentValues({ [collectionString]: reorderedCollection })
  }

  return (
    <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
      {instantiateComponent(beforeComponent, props)}
      <label className='control-label col-sm-3'>{label}</label>
      <SortableContainer distance={2} onSortEnd={handleSortEnd} useDragHandle>
        {React.Children.map(children, (child, i) => {
          // don't sort new children or when there's just one child
          const disabled = (i > origCollLength - 1) || (origCollLength <= 1)
          return (
            <SortableItem key={`${collectionString}-${i}`} index={i} child={child} disabled={disabled} isDisabled={disabled} sortIndex={i} />
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
