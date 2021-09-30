import React from 'react';
import FlashcardList from './FlashcardList';

import axios from 'axios';

import './app.css'

function App() {
  const [flashcards, setFlashcards] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  const categoryEl = React.useRef();
  const amountEl = React.useRef();

  const decodeString = str => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.get('https://opentdb.com/api.php?amount=10', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
      .then(res => {

        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem?.correct_answer);
          const options = [...questionItem.incorrect_answers?.map(a => decodeString(a)), answer];
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem?.question),
            answer: answer,
            options: options.sort(() => Math.random() - 0.5)
          }
        }))
      })
  }

  React.useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10')
      .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem?.correct_answer);
          const options = [...questionItem.incorrect_answers?.map(a => decodeString(a)), answer];
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem?.question),
            answer: answer,
            options: options.sort(() => Math.random() - 0.5)
          }
        }))
      })
  }, [])

  React.useEffect(() => {
    axios.get("https://opentdb.com/api_category.php")
      .then(res => setCategories(res.data.trivia_categories))
  })

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories?.map(category => {
              return <option value={category?.id} key={category?.id}>{category?.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number Of Questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
