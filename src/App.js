import { useReducer } from 'react';
import './styles.css';
import ButtonDigit from './ButtonDigit';
import OperationButton from './OperationButton';

// Initializing the different actions that needs to be performed
export const ACTIONS = {
  ADD_DIGIT:'add-digit',
  CLEAR:'clear', 
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATION: 'evaluate'
}

function reducer (state, {type, payload}) {

  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state, 
          currOperand: payload.digit,
          overwrite: false
        }

      } 
      if (payload.digit === "0" && state.currOperand === "0") return state
      if (payload.digit === "." && state.currOperand.includes(".")) return state
      return {
        ...state, 
        currOperand: `${state.currOperand || ""}${payload.digit}`

      };
    
    case ACTIONS.CHOOSE_OPERATION: 
      if (state.currOperand == null && state.prevOperand == null) {
        return state
      }
      if (state.currOperand == null ) {
        return {
          ...state, 
          operation: payload.operation, 
        }
      }
      

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null

        }
      }

      return {
        ...state, 
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null
      }

    case ACTIONS.EVALUATION: 
      if (state.operation == null || state.currOperand ==null || state.prevOperand == null ){
        return state
      }
      return {
        overwrite: true,
        ...state,
        prevOperand: null, 
        operation: null,
        currOperand: evaluate(state)
      }
    
    case ACTIONS.DELETE_DIGIT: 
      // if(state.overwrite) {
      //   return {
      //     ...state, 
      //     currOperand: null,
      //     overwrite: false
      //   }
      // }
      if(state.currOperand == null) return state
      if(state.currOperand.length === 1) {
        return { ...state, currOperand: null}
      }

      return {
        ...state, 
        currOperand: state.currOperand.slice(0,-1)
      }
      
    case ACTIONS.CLEAR: 
      return {} 



      default: 
      return state;
  }

}

// This function is to perform the different operations on the inputs
function evaluate({currOperand, prevOperand, operation}) {

  const prev = parseFloat(prevOperand)
  const curr = parseFloat(currOperand)
  if (isNaN(prev) || isNaN(curr)) {
    return ""
  }
  let compute = ""
  switch (operation) {
    case "+":
      compute = prev + curr
      break
    case "-":
      compute = prev - curr
      break
    case "/":
      compute = prev / curr
      break
    case "*":
      compute = prev * curr
      break
    default: 
      break
  }

  return compute.toString()

}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

// This functtion is used to separate the number with commas in US notation 
function formatOperand(operand) {
  if(operand == null ) return 
  const[integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

// Main Component
function App() {

  const [{currOperand, prevOperand, operation}, dispatch] = useReducer(reducer, {})
  return (

    <div className='calc-grid'>
      <div className='output'>
        <div className='prev-operand'>{formatOperand(prevOperand)} {operation}</div>
        <div className='curr-operand' >{formatOperand(currOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch( {type: ACTIONS.CLEAR})}>CLR</button>

      <button onClick={() => dispatch( {type: ACTIONS.DELETE_DIGIT})}>DEL</button>

      <OperationButton operation="/" dispatch={dispatch} />

      <ButtonDigit digit="1" dispatch={dispatch} />
      <ButtonDigit digit="2" dispatch={dispatch} />
      <ButtonDigit digit="3" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />

      <ButtonDigit digit="4" dispatch={dispatch} />
      <ButtonDigit digit="5" dispatch={dispatch} />
      <ButtonDigit digit="6" dispatch={dispatch} />

      <OperationButton operation="+" dispatch={dispatch} />

      <ButtonDigit digit="7" dispatch={dispatch} />
      <ButtonDigit digit="8" dispatch={dispatch} />
      <ButtonDigit digit="9" dispatch={dispatch} />

      <OperationButton operation="-" dispatch={dispatch} />

      <ButtonDigit digit="." dispatch={dispatch} />
      <ButtonDigit digit="0" dispatch={dispatch} />

      <button className='span-two' onClick={() => dispatch( {type: ACTIONS.EVALUATION})}>=</button>
    </div>
  )
}

export default App;
