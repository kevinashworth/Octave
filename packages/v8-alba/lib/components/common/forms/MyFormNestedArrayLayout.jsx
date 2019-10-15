import { instantiateComponent, replaceComponent } from 'meteor/vulcan:lib'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
const RBD = require('react-beautiful-dnd')

console.log('RBD:', RBD)

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

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
  const droppableId = document._id + '-' + collection

  // Everything twice, once for the page (children), once for the db (collection)
  const [state, setState] = useState({
    children,
    [collection]: document[collection]
  })

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    if (result.destination.index === result.source.index) {
      return
    }
    const reorderedCollection = reorder(
      state[collection],
      result.source.index,
      result.destination.index
    )
    const reorderedChildren = reorder(
      state.children,
      result.source.index,
      result.destination.index
    )
    setState({
      children: reorderedChildren,
      [collection]: reorderedCollection
    })
    context.updateCurrentValues({ [collection]: reorderedCollection })
  }

  const onDragStart = (start) => {
    console.group('onDragStart:')
    console.info('draggableId:', start.draggableId)
    console.info('type:', start.type)
    console.info('source:', start.source)
    console.info('mode:', start.mode)
    console.groupEnd()
  }

  if (collection === 'links') { // See corresponding `if` statement in MyFormNestedArrayInnerLayout
    return (
      <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
        {instantiateComponent(beforeComponent, props)}
        <label className='control-label col-sm-3'>{label}</label>
        <div className='col-sm-9'>
          {children}
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
  } else {
    return (
      <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
        {instantiateComponent(beforeComponent, props)}
        <label className='control-label col-sm-3'>{label}</label>
        <div className='col-sm-9'>
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable droppableId={droppableId}>
              {(provided) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {React.Children.map(state.children, (child, i) => {
                      return child
                    })}
                    {provided.placeholder}
                  </div>
                )
              }}
            </Droppable>
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
          </DragDropContext>
        </div>
        {instantiateComponent(afterComponent, props)}
      </div>
    )
  }
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
