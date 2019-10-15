import { instantiateComponent, replaceComponent } from 'meteor/vulcan:lib'
import React, { PureComponent, useState } from 'react'
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

const DragHandle = sortableHandle(() => <i className='fa fa-bars'></i>)

const SortableItem = sortableElement(({ child, isDisabled }) => (
  <div>
    {isDisabled
     ? null
     : <DragHandle />
    }
    {child}
  </div>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <div className='col-sm-9'>{children}</div>
})

class MyFormNestedArrayLayout extends PureComponent {
  constructor(props) {
    super(props)

    const collection = props.arrayField.name.slice(0, -2) || 'MyFormNestedArrayLayoutIsNotWorking' // `offices`, `projects`, `links`, etc.
    this.state = {
      [collection]: props.document[collection],
      collectionName: [collection],
      originalCollectionLength: props.document[collection] ? props.document[collection].length : 0
    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    const reorderedCollection = reorder(this.state[this.state.collectionName], oldIndex, newIndex)
    this.setState({
      [this.state.collectionName]: reorderedCollection,
    })
    this.context.updateCurrentValues({ [this.state.collectionName]: reorderedCollection })
  }

  render() {
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
    } = this.props
    const FormComponents = formComponents

    return (
      <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>
        {instantiateComponent(beforeComponent, this.props)}
        <label className='control-label col-sm-3'>{label}</label>
        <SortableContainer distance={2} onSortEnd={this.onSortEnd} useDragHandle>
          {React.Children.map(this.props.children, (child, i) => {
            // don't sort new children or when there's just one child
            const disabled = (i > this.state.originalCollectionLength - 1) || (this.state.originalCollectionLength <= 1)
            return (
              <SortableItem key={`${this.state.collectionName}-${i}`} index={i} child={child} disabled={disabled} isDisabled={disabled} />
            )
          })}
          {addItem && (
            <FormComponents.Button
              className='form-nested-button form-nested-add'
              size='sm'
              variant='success'
              onClick={addItem}>
              <FormComponents.IconAdd height={12} width={12} />
            </FormComponents.Button>
          )}
          {this.props.hasErrors ? (
            <FormComponents.FieldErrors key='form-nested-errors' errors={nestedArrayErrors} />
          ) : null}
        </SortableContainer>
        {instantiateComponent(afterComponent, this.props)}
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
