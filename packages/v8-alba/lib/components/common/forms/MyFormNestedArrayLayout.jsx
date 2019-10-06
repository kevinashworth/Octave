import { instantiateComponent, replaceComponent } from 'meteor/vulcan:lib'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

const MyFormNestedArrayLayout = props => {
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
  const initialCount = React.Children.count(children)
  const [count, setCount] = useState(initialCount)

  function onDragEnd (result) {
    if (!result.destination) {
      return
    }
    if (result.destination.index === result.source.index) {
      return
    }
    console.log('result:', result)
  }

  return (
    <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
      {instantiateComponent(beforeComponent, props)}

      <label className='control-label col-sm-3'>{label}</label>

      <div className='col-sm-9'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='nestedArray'>
            {(provided) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {children}
                </div>
              )
            }}
          </Droppable>
        </DragDropContext>
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

replaceComponent({
  name: 'FormNestedArrayLayout',
  component: MyFormNestedArrayLayout
})
