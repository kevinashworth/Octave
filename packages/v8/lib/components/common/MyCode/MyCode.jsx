/* eslint-disable react/jsx-key */
import React from 'react'
import prettier from 'prettier/standalone'
import parserGraphql from 'prettier/parser-graphql'
import parserJson from 'prettier/parser-babel'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'
import styled from 'styled-components'

const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`

function MyCode ({ code, language }) {
  let prettyCode
  if (language === 'json') {
    prettyCode = prettier.format(code, {
      parser: 'json',
      plugins: [parserJson],
      htmlWhitespaceSensitivity: 'ignore'
    })
  } else {
    prettyCode = prettier.format(code, {
      parser: 'graphql',
      plugins: [parserGraphql],
      htmlWhitespaceSensitivity: 'ignore'
    })
  }
  return (
    <Highlight {...defaultProps} theme={theme} code={prettyCode} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Pre>
      )}
    </Highlight>
  )
}

export default MyCode
