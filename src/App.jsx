import { languages } from "../languages"
import React from "react"
import clsx from "clsx"
import { getFarewellText, getRandomWord } from "../utils"
import Confetti from "react-confetti"
export default function App() {

  // states values
  const [guessedLetters, setguessedLetters] = React.useState([])
  const [currentWord, setcurrentWord] = React.useState(() => getRandomWord())


  //derived values
  const wrongGuessCount =
    (guessedLetters.filter(letter => !currentWord.includes(letter))).length
  const lastguessed = guessedLetters[guessedLetters.length - 1]
  const iswrongGuess = lastguessed && !currentWord.includes(lastguessed)
  const numGuessesLeft = languages.length - 1
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const alphabet = "abcdefghijklmnopqrstuvwxyz"


  //static values



  const languageChips = languages.map((language, index) => {
    const className = wrongGuessCount > index ? "chip lost" : "chip"
    return (
      <span
        className={className}
        key={language.name}
        style={{ backgroundColor: language.backgroundColor, color: language.color }}>
        {language.name}
      </span>
    )
  })


  function addGuessedLetters(letter) {
    setguessedLetters(prevLetters =>
      prevLetters.includes(letter) ? [...prevLetters] : [...prevLetters, letter]
    )
  }


  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })


  const keyElement = (Array.from(alphabet)).map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (<button
      className={className}
      disabled={isGameOver}
      aria-disabled={guessedLetters.includes(letter)}
      aria-label={`Letter ${letter}`}
      onClick={() => addGuessedLetters(letter)}
      key={letter}>
      {letter.toUpperCase()}
    </button>)
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: iswrongGuess && !isGameOver

  }
  )


  function renderGameStatus() {

    if (isGameWon) {
      return (<>
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
      </>)
    }
    if (isGameLost) {
      return (<>
        <h2>Game over!</h2>
        <p>You lose! Better start learning Assembly 😭</p>
      </>
      )
    }
    if (iswrongGuess && !isGameOver) {
      const lastLanguage = languages[wrongGuessCount - 1]
      return (
        <p>{getFarewellText(lastLanguage.name)}</p>
      )
    }
  }

  function handelClick() {
    setcurrentWord(getRandomWord())
    setguessedLetters([])
  }


  //rendering on page
  return (
    <main>

      {isGameWon &&
        <Confetti
          recycle={false}
          numberOfPieces={1000}
        />}


      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the
          programming world safe from Assembly!</p>
      </header>

      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>

      <div className="container">
        <section className="language-chips">
          {languageChips}
        </section>
      </div>

      <section className="word">
        {letterElements}
      </section>

      {/* hidden screen reader section */}
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastguessed) ?
            `Correct! The letter ${lastguessed} is in the word.` :
            `Sorry, the letter ${lastguessed} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>

        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>

      </section>


      <div className="container1">
        <section className="keyboard">
          {keyElement}
        </section>
      </div>

      {isGameOver && <button className="new-game" onClick={handelClick}>New Game</button>}

    </main>
  )
}