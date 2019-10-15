import { instantiateComponent, replaceComponent } from 'meteor/vulcan:core'
import React from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'

const DragHandle = sortableHandle(() => <span>::</span>)

const SortableItem = sortableElement(({value}) => (
  <span>
    <DragHandle />
    {value}
  </span>
))

const Sortables = sortableContainer(({children}) => {
  return <span>{children}</span>;
})


const MyFormNestedArrayInnerLayout = props => {
  const { FormComponents, label, children, addItem, beforeComponent, afterComponent, itemIndex } = props

  return (
    <Sortables useDragHandle={true}>
    <div className='form-nested-array-inner-layout'>
      {instantiateComponent(beforeComponent, props)}
      <SortableItem>
        {children}
      </SortableItem>
      <FormComponents.FormNestedDivider label={label} addItem={addItem} />
      {instantiateComponent(afterComponent, props)}
    </div>
    </Sortables>
  )
}

replaceComponent({
  name: 'FormNestedArrayInnerLayout',
  component: MyFormNestedArrayInnerLayout
})
