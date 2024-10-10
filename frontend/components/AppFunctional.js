import React, { useState } from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/result'
// Suggested initial states
const initialValues = {
  Message: '',
  Email: '',
  Steps: 0,
  Index: 4
}

export default function AppFunctional(props) {
  
  const [state, setState] = useState(initialValues)

  function getXY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const row = (Math.floor(index / 3)) + 1;
    const col = (index % 3) + 1;
    //console.log(col, row)
    return {col, row };
  }
  

  function getXYMessage(index) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { col , row } = getXY(index)
    //console.log(col , row)
    return `Coordinates (${col}, ${row})`
    
  }
 

  function reset() {

    setState(initialValues)
    
  }

  function getNextIndex(index, direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    switch (direction) {
      case "left":
        return index % 3 === 0 ? index : index - 1;
      case "right":
        return index % 3 === 2 ? index : index + 1;
      case "up":
        return index < 3 ? index : index - 3;
      case "down":
        return index > 5 ? index : index + 3;
      default:
        return index; // Invalid direction
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const newIndex = getNextIndex(state.Index, direction);
    if (newIndex !== state.Index) {
      setState((prevState) => ({
        ...prevState,
        Index: newIndex,
        Steps: prevState.Steps + 1
      }));
    } else {
      // If the move is not possible, display the appropriate limit reached message
      switch (direction) {
        case "left":
          setState((prevState) => ({
            ...prevState,
            Message: "You can't go left"
          }));
          break;
        case "right":
          setState((prevState) => ({
            ...prevState,
            Message: "You can't go right"
          }));
          break;
        case "up":
          setState((prevState) => ({
            ...prevState,
            Message: "You can't go up"
          }));
          break;
        case "down":
          setState((prevState) => ({
            ...prevState,
            Message: "You can't go down"
          }));
          break;
        default:
          break; // Invalid direction
      }
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setState((prevState) => ({
      ...prevState,
      Email: evt.target.value
    }));
  }

  function onSubmit(evt) {
    // Message appears "lady win #133" on success
    // "Ouch: x coordinate must be 1, 2 or 3" , "Ouch: y coordinate must be 1, 2 or 3" , 
    // "Ouch: steps must be 0 or greater" , "Ouch: email must be a valid email" on failure

    const row = (Math.floor(state.Index / 3)) + 1;
    const col = (state.Index % 3) + 1;

    evt.preventDefault();

    const payload = {
      x: col,
      y: row,
      steps: state.Steps,
      email: state.Email
    }

    axios.post(URL, payload)
    .then(response => {
      setState(prevState => ({
        ...prevState,
        Message: response.data.message ,
        Email: ''
      }))
    })
    .catch(error => {
      setState(prevState =>({
        ...prevState,
        Message: error.response.data.message 
        
      }))
    })

    
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(state.Index)}</h3>
        <h3 id="steps">You moved {state.Steps} {state.Steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.Index ? ' active' : ''}`}>
              {idx === state.Index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.Message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input value={state.Email} id="email" type="email" placeholder="type email" onChange={onChange}></input>
        <input id="submit" type="submit" ></input>
      </form >
    </div>
  )
}
