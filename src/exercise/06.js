// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'
// import ErrorBoundary from './ErrorBoundary'

const statusArr = ['idle', 'pending', 'resolved', 'rejected']

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  // const [status, setStatus] = React.useState(statusArr[0])

  const [pokemon, setPokemon] = React.useState({
    data: null,
    error: null,
    status: 'idle',
  })
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (!pokemonName) return
    setPokemon(prev => {
      return {
        data: null,
        error: null,
        status: statusArr[1],
      }
    })
    // setError(null)
    // setStatus(statusArr[1])
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        /* update all the state here */
        setPokemon(prev => {
          return {
            data: pokemonData,
            error: null,
            status: statusArr[2],
          }
        })
      })
      .catch(error => {
        setPokemon(prev => {
          return {
            data: null,
            error: error,
            status: statusArr[3],
          }
        })
      })
  }, [pokemonName])

  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  if (pokemon.status === statusArr[0]) return 'Submit a pokemon'
  if (pokemon.status === statusArr[1])
    return <PokemonInfoFallback name={pokemonName} />
  if (pokemon.status === statusArr[2])
    return <PokemonDataView pokemon={pokemon.data} />
  if (pokemon.status === statusArr[3]) throw pokemon.error
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const FallbackComponent = ({error, resetErrorBoundary}) => {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          key={pokemonName}
          FallbackComponent={FallbackComponent}
          onReset={() => setPokemonName('')}
          // resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />{' '}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
