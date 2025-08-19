import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'css prop overrides component base',
  test: (() => {
    const A = styled('div', { color: 'red' })
    const B = styled(A, { color: 'green' })
    return (
      <>
        <A />
        <A css={{ color: 'pink' }} />
        <B />
        <B css={{ color: 'pink' }} />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div className="pink" />
      <div className="b" />
      <div className="pink" />
    </>
  ),
  css: css`
    .a {
      color: red;
    }
    .b {
      color: green;
    }
    .pink {
      color: pink;
    }
  `,
})
