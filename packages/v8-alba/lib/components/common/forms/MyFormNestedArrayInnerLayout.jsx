import React from 'react'
import { instantiateComponent, replaceComponent } from 'meteor/vulcan:core'
import { Draggable } from 'react-beautiful-dnd'

const MyFormNestedArrayInnerLayout = props => {
  const { FormComponents, label, children, addItem, beforeComponent, afterComponent, itemIndex, name, path } = props
  const collection = name.slice(0, -2) || 'MyFormNestedArrayInnerLayoutIsNotWorking'

  if (collection === 'links') {  // See corresponding `if` statement in MyFormNestedArrayInnerLayout
    return (
      <div className='form-nested-array-inner-layout'>
        {instantiateComponent(beforeComponent, props)}
        {children}
        <FormComponents.FormNestedDivider label={label} addItem={addItem} />
        {instantiateComponent(afterComponent, props)}
      </div>
    )
  } else {
    return (
      <Draggable draggableId={path} index={itemIndex}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            >
            <div className='form-nested-array-inner-layout'>
              {instantiateComponent(beforeComponent, props)}
              <i class='fa fa-bars' {...provided.dragHandleProps}></i>
              {children}
              <FormComponents.FormNestedDivider label={label} addItem={addItem} />
              {instantiateComponent(afterComponent, props)}
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}
replaceComponent({
  name: 'FormNestedArrayInnerLayout',
  component: MyFormNestedArrayInnerLayout
})
