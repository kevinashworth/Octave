import { Components, registerComponent } from 'meteor/vulcan:lib'
import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader } from 'reactstrap'
import marked from 'marked'


const Message = (props) => {
  const { body, header } = props
  const markedBody = {__html: marked(body)}
  return (
    <div className="animated fadeIn">
      <Card className='mt-4'>
        {header &&
          <CardHeader><b>{header}</b></CardHeader>
        }
        <CardBody dangerouslySetInnerHTML={markedBody} />
      </Card>
    </div>
  )
}

Message.propTypes = {
  body: PropTypes.string.isRequired,
  header: PropTypes.string
}

registerComponent({
  name: 'Message',
  component: Message
})
