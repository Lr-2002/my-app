import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component {


//   render() {
//     return (
//       <button
//         className="square"
//         onClick={()=> this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props){
  return (
    <button className = 'square' onClick = {props.onClick}>
      {props.value}
    </button>);
}

class Board extends React.Component {
  handleClick(i){
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return ; // return if square[i] is occupied or the game is over
    }
    
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares:squares,
      xIsNext : !this.state.xIsNext
    });  // square 被点击之后将信息传送给 board  然后board 处理点击时间，并将结果传给儿子
  }
  renderSquare(i) {
    return <Square value = {this.props.squares[i]}  onClick = {() => this.props.onClick(i)}
    />;
  } 


  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares : Array(9).fill(null),
      }],// property
    xIsNext : true,
    stepNumber : 0,
    };
  } // record the history
  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1 ];
    const squares = current.squares.slice(); // slice is a face-copy of the current squares
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares : squares,

      }]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext,
    });
    
  }  

  jumpTo(step){
      this.setState({
        stepNumber : step,
        xIsNext :(step%2) === 0,
      })
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]; 
    const winner = calculateWinner(current.squares);
    let status;
    
    const moves = history.map((step,move) => {
      const desc = move ?
      'Go to move ' + move : 'Go to game start';
      return (
        <li key={move}>
          <button
          onClick = {() => this.jumpTo(move)}>{desc} </button> 
        </li>
      ); // record the approach to make list show of move 
    });


    if (winner){
      status = 'winner' + winner;
    }else {
      status = 'next player " ' + (this.state.xIsNext ?"X": "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares = {current.squares}
          onClick = {(i) => this.handleClick(i)} // put in a variaty in the ()
          />
        </div>
        <div className="game-info">
          <div>{status      }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}