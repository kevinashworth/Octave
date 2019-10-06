import React from 'react'
import { instantiateComponent, replaceComponent } from 'meteor/vulcan:core'
import { Draggable } from 'react-beautiful-dnd'

const MyFormNestedArrayInnerLayout = props => {
  const { FormComponents, label, children, addItem, beforeComponent, afterComponent, itemIndex } = props
  const tempId = label + itemIndex
  return (
    <Draggable draggableId={tempId} index={itemIndex}>
      {(provided) => (
        <div className='form-nested-array-inner-layout'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          >
          {instantiateComponent(beforeComponent, props)}
          {children}
          <FormComponents.FormNestedDivider label={label} addItem={addItem} />
          {instantiateComponent(afterComponent, props)}
        </div>
      )}
    </Draggable>
  )
}
replaceComponent({
  name: 'FormNestedArrayInnerLayout',
  component: MyFormNestedArrayInnerLayout
})
