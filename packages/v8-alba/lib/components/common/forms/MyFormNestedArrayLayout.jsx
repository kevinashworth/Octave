import { instantiateComponent, replaceComponent } from 'meteor/vulcan:lib'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const DragHandle = sortableHandle(() => <i class='fa fa-bars'></i>)

const SortableItem = sortableElement(({ child }) => (
  <li>
    <DragHandle />
    {child}
  </li>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>
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
    children,
    document,
    arrayField
  } = props
  const FormComponents = formComponents

  const collection = arrayField.name.slice(0, -2) || 'MyFormNestedArrayLayoutIsNotWorking' // `offices`, `projects`, `links`, etc.

  // Everything twice, once for the page (children), once for the db (collection)
  const [state, setState] = useState({
    children,
    [collection]: document[collection]
  })

  const onSortEnd = ({oldIndex, newIndex}) => {
    console.log('state[collection]:', state[collection])
    const reorderedCollection = reorder(state[collection], oldIndex, newIndex)
    console.log('reorderedCollection:', reorderedCollection)
    console.log('state[collection]:', children)
    const reorderedChildren = reorder(children, oldIndex, newIndex)
    console.log('reorderedChildren:', reorderedCollection)
    setState({
      children: reorderedChildren,
      [collection]: reorderedCollection,
    })
    context.updateCurrentValues({ [collection]: reorderedCollection })
  }

  return (
    <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
      {instantiateComponent(beforeComponent, props)}
      <label className='control-label col-sm-3'>{label}</label>
      <div className='col-sm-9'>
        <SortableContainer onSortEnd={onSortEnd} useDragHandle>
          {React.Children.map(state.children, (child, i) => {
            console.log('child:', `${collection}-${i}`)
            return (
              <SortableItem key={`${collection}-${i}`} index={i} child={child} />
            )
          })}
        </SortableContainer>
        {addItem && (
          <FormComponents.Button
            className='form-nested-button form-nested-add'
            size='sm'
            variant='success'
            onClick={addItem}>
            <FormComponents.IconAdd height={12} width={12} />
          </FormComponents.Button>
        )}
        {props.hasErrors ? (
          <FormComponents.FieldErrors key='form-nested-errors' errors={nestedArrayErrors} />
        ) : null}
      </div>
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
