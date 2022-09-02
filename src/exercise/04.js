// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onSelectSquare}) {
  // 🐨 squares is the state for this component. Add useState for squares
  // const squares = Array(9).fill(null)
  // const [squares, setSquares] = React.useState(
  //   () =>
  //     (window.localStorage.getItem('squares') &&
  //       JSON.parse(window.localStorage.getItem('squares'))) ??
  //     initialSquares,
  // )
  // const [squares, setSquares] = useLocalStorageState('squares', initialSquares)
  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // React.useEffect(() => {
  //   window.localStorage.setItem('squares', JSON.stringify(squares))
  // }, [squares])

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(squareIdx) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (calculateWinner(squares) || squares[squareIdx]) return
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    const nextValue = calculateNextValue(squares)
    // setSquares(prevSquares => {
    //   return prevSquares.map((currSquare, index) => {
    //     if (index === squareIdx) currSquare = nextValue
    //     return currSquare
    //   })
    // })

    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const squaresCopy = [...squares]
    squaresCopy[squareIdx] = nextValue
    onSelectSquare(squaresCopy)
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    //
    // 🐨 set the squares to your copy
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      {/* <div className="status">
        {squares &&
          calculateStatus(
            calculateWinner(squares),
            squares,
            calculateNextValue(squares),
          )}
      </div> */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {/* <button className="restart" onClick={restart}>
        restart
      </button> */}
    </div>
  )
}

const initialSquares = Array(9).fill(null)
// const initialHistory = Array(9).fill(Array[1].fill(null))
function Game() {
  // const [currentSquares, setCurrentSquares] = useLocalStorageState(
  //   'squares',
  //   initialSquares,
  // )
  const [history, setHistory] = useLocalStorageState('history', [
    initialSquares,
  ])

  const [currentStep, setCurrentStep] = useLocalStorageState('step', 0)

  const onSelectSquare = updatedSquares => {
    setHistory(prevHistory => [...prevHistory, updatedSquares])
    // setCurrentSquares(updatedSquares)
    setCurrentStep(prevStep => prevStep + 1)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    // setCurrentSquares(initialSquares)
    setHistory([initialSquares])
    setCurrentStep(0)
  }

  const renderButton = (_, index) => {
    let btnText
    let currentText = ' (current)'
    if (index === 0) btnText = 'Go to game start'
    else
      btnText = `Go to move #${index}${
        currentStep === index ? currentText : ''
      }`
    return (
      <li key={index}>
        <button
          disabled={currentStep === index}
          onClick={() => setCurrentStep(index)}
        >
          {btnText}
        </button>
      </li>
    )
  }

  return (
    <div className="game">
      <div className="game-board">
        {/* <Board onSelectSquare={onSelectSquare} squares={currentSquares} /> */}
        <Board onSelectSquare={onSelectSquare} squares={history[currentStep]} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>
          {history[currentStep] &&
            calculateStatus(
              calculateWinner(history[currentStep]),
              history[currentStep],
              calculateNextValue(history[currentStep]),
            )}
        </div>
        <ol>{history.map(renderButton)}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
