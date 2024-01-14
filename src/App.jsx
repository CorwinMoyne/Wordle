import { Fragment, useEffect, useId, useRef, useState } from "react";
import "./App.css";
import words from "./words";
import Tile from "./components/Tile/Tile";

// const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

const MAX_WORD_LENGTH = 5;
const MAX_ROW_LENGTH = 6;

const Classes = {
  NotPresent: "notPresent",
  PresentAtIndex: "presentAtIndex",
  PresentAtOtherIndex: "presentAtOtherIndex",
};

function App() {
  const solution = useRef("");
  const activeRowIndex = useRef(0);
  const activeColIndex = useRef(0);

  const [guesses, setGuesses] = useState([
    {
      id: 0,
      options: [
        { id: 0, letter: "", class: "" },
        { id: 1, letter: "", class: "" },
        { id: 2, letter: "", class: "" },
        { id: 3, letter: "", class: "" },
        { id: 4, letter: "", class: "" },
      ],
    },
    {
      id: 1,
      options: [
        { id: 5, letter: "", class: "" },
        { id: 6, letter: "", class: "" },
        { id: 7, letter: "", class: "" },
        { id: 8, letter: "", class: "" },
        { id: 9, letter: "", class: "" },
      ],
    },
    {
      id: 2,
      options: [
        { id: 10, letter: "", class: "" },
        { id: 11, letter: "", class: "" },
        { id: 12, letter: "", class: "" },
        { id: 13, letter: "", class: "" },
        { id: 14, letter: "", class: "" },
      ],
    },
    {
      id: 3,
      options: [
        { id: 15, letter: "", class: "" },
        { id: 16, letter: "", class: "" },
        { id: 17, letter: "", class: "" },
        { id: 18, letter: "", class: "" },
        { id: 19, letter: "", class: "" },
      ],
    },
    {
      id: 4,
      options: [
        { id: 20, letter: "", class: "" },
        { id: 21, letter: "", class: "" },
        { id: 22, letter: "", class: "" },
        { id: 23, letter: "", class: "" },
        { id: 24, letter: "", class: "" },
      ],
    },
    {
      id: 5,
      options: [
        { id: 25, letter: "", class: "" },
        { id: 26, letter: "", class: "" },
        { id: 27, letter: "", class: "" },
        { id: 28, letter: "", class: "" },
        { id: 29, letter: "", class: "" },
      ],
    },
  ]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);


  console.log("solution", solution.current);

  // TODO: limit to numbers

  function getRow() {
    const copy = [...guesses];
    return copy[activeRowIndex.current].options;
  }

  function hasLetterAtIndex(index, letter) {
    return solution.current.includes(letter) && solution.current[index] === letter;
  }

  function hasLetterAtOtherIndex(index, letter) {
    return solution.current.includes(letter) && solution.current[index] !== letter;
  }

  function processRow() {
    const copy = [...guesses];
    const row = getRow();

    row.map((item, index) => {
      if (hasLetterAtIndex(index, item.letter.toUpperCase())) {
        item.class = Classes.PresentAtIndex;
      } else if (hasLetterAtOtherIndex(index, item.letter.toUpperCase())) {
        item.class = Classes.PresentAtOtherIndex;
      } else {
        item.class = Classes.NotPresent;
      }
    });

    if (
      row.filter((item) => item.class === Classes.PresentAtIndex).length ===
      MAX_WORD_LENGTH
    ) {
      setIsAnswerCorrect(true);
    }

    setGuesses(copy);
  }

  function handleEnterKey() {
    console.log("enter");
    const row = getRow();
    const isInvalid = row.some((item) => item.letter === "");
    if (isInvalid) {
      return;
    }
    processRow();
    activeRowIndex.current++;
    activeColIndex.current = 0;
  }

  function handleBackspaceKey() {
    console.log("backspace");
    if (activeColIndex.current === 0) {
      return;
    }
    const copy = [...guesses];
    const row = getRow();
    activeColIndex.current--;
    row[activeColIndex.current].letter = "";
    setGuesses(copy);
  }

  function handleKeydown(event) {
    if (activeRowIndex.current >= MAX_ROW_LENGTH || isAnswerCorrect) {
      return;
    }
    if (event.key === "Enter") {
      handleEnterKey();
    } else if (event.key === "Backspace") {
      handleBackspaceKey();
    } else {
      const copy = [...guesses];
      copy[activeRowIndex.current].options[activeColIndex.current].letter =
        event.key;
      activeColIndex.current++;
      setGuesses(copy);
    }
  }

  useEffect(() => {
    try {
      const fetchWords = async () => {
        // const response = await fetch(API_URL);
        // const words = await response.json();
        const index = Math.floor(Math.random() * words.length);
        solution.current = words[index];
      };
      fetchWords();

      window.addEventListener("keydown", handleKeydown);

      return () => window.removeEventListener("keydown", handleKeydown);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <section className="container">
      <section className="grid">
        {guesses.map((guess) => (
          <Fragment key={guess.id}>
            {guess.options.map((option) => (
              <Tile key={option.id} guess={option} />
            ))}
          </Fragment>
        ))}
      </section>
      <section>
        {activeRowIndex.current >= MAX_ROW_LENGTH || isAnswerCorrect ? (
          <div className="solution">{solution.current}</div>
        ) : null}
      </section>
    </section>
  );
}

export default App;
