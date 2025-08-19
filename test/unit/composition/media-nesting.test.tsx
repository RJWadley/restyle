import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'media: inner sets @media all color, outer sets base → outer wins',
  test: (() => {
    const A = styled('div', {
      color: 'red',
      '@media all': { color: 'blue' },
    })
    const B = styled(A, { color: 'green' })
    return <B />
  })(),
  expect: <div className="a" />,
  css: css`
    .a {
      color: green;
    }
  `,
})

createUnitTest({
  name: 'media: ambiguous — inner @media all &:first-child vs outer base',
  fails: true,
  test: (() => {
    const A = styled('div', {
      '@media all': {
        '&:first-child': { color: 'blue' },
      },
    })
    const B = styled(A, { color: 'green' })
    return (
      <>
        <B />
        <div />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div />
    </>
  ),
  css: css`
    .a {
      color: green;
    }
  `,
})

createUnitTest({
  name: 'media: both target @media all &:first-child → outer wins',
  test: (() => {
    const A = styled('div', {
      '@media all': {
        '&:first-child': { color: 'blue' },
      },
    })
    const B = styled(A, {
      '@media all': {
        '&:first-child': { color: 'green' },
      },
    })
    return (
      <>
        <B />
        <div />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div />
    </>
  ),
  css: css`
    .a:first-child {
      color: green;
    }
  `,
})
