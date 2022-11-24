import { useCallback, useEffect, useState } from "react"
import { HangmanDrawing } from "./components/HangmanDrawing"
import { HangmanWord } from "./components/HangmanWord"
import { Keyboard } from "./components/Keyboard"
import words from "./wordList.json"

import styles from './app.module.css'

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return

      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      // canvas for wining screen
      {isWinner && <div className={styles.panel}>
        <p>Yes the word was <span style={{ color: 'yellowgreen', textTransform: 'uppercase'}}>{wordToGuess}</span></p>
        {"Yay! you won. Restart to play again"}
        <button style={{
          display: "block",
          marginTop: "30px",
          padding: "20px 30px",
          fontSize: "2rem",
          width: "300px",
          height: "100px",
          background: "green",
          color: "white",
          cursor: "pointer",
          
        }}
        onClick={() => window.location.reload()}>Play Again</button>
      </div>}

      // canvas for losing screen
      {isLoser && <div className={styles.panel}>
        <p>Word was <span style={{ color: 'yellowgreen', textTransform: 'uppercase'}}>{wordToGuess}</span></p>
        {`Valiant Effort! Better Luck Next Time.`}
        <button style={{
          display: "inline-block",
          marginTop: "30px",
          padding: "20px 30px",
          fontSize: "2rem",
          width: "300px",
          height: "100px",
          background: "green",
          color: "white",
          cursor: 'pointer'
        }} onClick={() => window.location.reload()}>Play Again</button>
      </div>}

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App
