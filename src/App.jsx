//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//data
import {wordsList} from "./data/words.jsx"

//components
import StartScreen from './components/StartScreen.jsx';
import Game from './components/Game.jsx';
import GameOver from './components/GameOver.jsx';


const stages =[
  {id: 1, name:"start" },
  {id: 2, name:"game"},
  {id: 3, name:"end"}
];

const guessesQty = 3
function App() {
const [gameStage, setGameStage] = useState(stages[0].name)
const [words] = useState(wordsList)

const [pickedWord, setPickedWord] = useState("")
const [pickedCategory, setPickedCategory] = useState("")
const [letters, SetLetters] = useState([])

const [guessedLetters, setGuessedLetters] = useState([])
const [wrongLetters, setWrongLetters] = useState([])
const [guesses, setGuesses] = useState(guessesQty)
const [score, setScore] = useState(0)



const pickedWordAndCategory = useCallback(() => {
  // pick a random category
  const categories = Object.keys(words)
  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
 
  // picked a random word
  const word = words[category][Math.floor(Math.random() * words[category].length)]
  
  return {word, category}
}, [words])
// starts the secret word game
const startGame = useCallback(() =>{
  //clear all letters 
clearLetterStates();

  // pick word and pick category
  const{word, category} = pickedWordAndCategory()
  // create an array of letters
  let wordLetters = word.split("")

  wordLetters = wordLetters.map((l) => l.toLowerCase())
  

  // fill states
  setPickedWord(word)
  setPickedCategory(category)
  SetLetters(wordLetters)

  setGameStage(stages[1].name)
}, [pickedWordAndCategory])
// process the letter input
const verifyLetter = (letter) =>{
  
  const normalizedLetter = letter.toLowerCase()

  //check if letter has already been utilized
  if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
    return
  }

  // push guessed letter or remove a guess
  if(letters.includes(normalizedLetter)){
    setGuessedLetters((actualGuessedLetters) => [
      ...actualGuessedLetters, normalizedLetter
    ])
  }else{
    setWrongLetters((actualWrongLetters) => [
      ...actualWrongLetters, normalizedLetter
    ]);
    setGuesses((actualGuesses) => actualGuesses - 1);

  }
 
}

const clearLetterStates = () =>{
  setGuessedLetters([])
  setWrongLetters([])
};

// check win condition
useEffect(() =>{
  const uniqueLetters = [...new Set(letters)]

  //win condition 
  if(guessedLetters.length === uniqueLetters.length){
    //add score
    setScore((actualScore) => actualScore += 100)

    // restart game with new word
    startGame();
  }
  

}, [guessedLetters, letters, startGame]);

useEffect(() =>{
  if(guesses <= 0){
    // reset all stages
    clearLetterStates()

    setGameStage(stages[2].name);
  }

}, [guesses]);
//restart the game
const retry = () => {
  setScore(0)
 setGuesses(guessesQty)

  setGameStage(stages[0].name)

}

  return (
    <div className="App">
   {gameStage === "start" &&  <StartScreen startGame={startGame}/>}
   {gameStage === "game" &&  <Game
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickdCategory={pickedCategory}
      letters={letters} 
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
       />}
   {gameStage === "end" &&  <GameOver retry={retry} score={score}/>}
    
    </div>
  );
}

export default App;
