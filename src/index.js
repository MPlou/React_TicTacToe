import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Squares
function Square(props) {
    return (
      <button className="square"
        onClick={props.onClick}>
          {props.value}
      </button>
    );
}

function Scores(props) {
  let xScore;
  let oScore;
  let drawScore;
  xScore = 'X_____: '+ props.score[0];
  oScore = 'O ____: '+ props.score[1];
  drawScore = 'Draw_: '+ props.score[2];
    return (
      <div>
        <div> <strong>Scores : </strong></div>
        <div> <u>{xScore}</u></div>
        <div> <u>{oScore}</u> </div>
        <div> <u>{drawScore}</u> </div>
      </div>
    );
}

//BOARD
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xTurn : true,
      scores : Array(3).fill(0),
      xAI : false,
      oAI : false,
      gameOver : true,
    };
  }

playMove(i) {
  const squares = this.state.squares.slice();
  if (calculateWinner(squares) || squares[i]) {
    return;
  }
  squares[i] = this.state.xTurn ? 'X' : 'O';
  this.setState({
    squares: squares,
    xTurn : !this.state.xTurn,
  });
}

handleClick(i) {
  if ((this.state.gameOver) ||
  (this.state.xTurn && this.state.xAI) || (!this.state.xTurn && this.state.oAI))
    return
  this.playMove(i);
}

newGame() {
  this.setState( {
    gameOver : false,
    squares : Array(9).fill(null),
    xTurn : true,
  });
}

changeTeam(team) {
  if (team === 'X') {
    let newTeam = !this.state.xAI;
    this.setState({xAI : newTeam});
  } else {
    let newTeam = !this.state.oAI;
    this.setState({oAI : newTeam});
  }
}

playAI() {
  if (this.state.gameOver)
    return;
  setTimeout(() => {
    this.playMove(whereToPlay(this.state.squares, (this.state.xTurn ? 'X' : 'O')))
  }, 500);
}

  renderSquare(i) {
    return <Square value={this.state.squares[i]}
    onClick = {()=> this.handleClick(i)}
    />;
  }

renderMenu() {
  if (this.state.gameOver) {
    let x = this.state.xAI ? 'AI' : 'Human';
    let o = this.state.oAI ? 'AI' : 'Human';
    return <div>
            <div><strong>X : </strong><button onClick = {()=> this.changeTeam('X')}> {x} </button></div>
            <div><strong>O: </strong><button onClick = {()=> this.changeTeam('O')}> {o} </button></div>
            <br></br>
            <div><button onClick = {()=> this.newGame()}><strong> Play ! </strong></button></div>
            </div>
  } else
    return
}

  render() {

    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'We have a winner: '+ winner+' won!';
      this.state.gameOver = true;
      if (winner === 'X')
        this.state.scores[0] += 1;
      else
        this.state.scores[1] += 1
    } else if (checkDraw(this.state.squares)) {
      this.state.gameOver = true;
      status = "It's a draw !";
      this.state.scores[2] += 1
    } else
      status = 'Next player: '+ (this.state.xTurn ? 'X' : 'O');
    if ((this.state.xTurn && this.state.xAI) || (!this.state.xTurn && this.state.oAI))
      this.playAI();
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <Scores score = {this.state.scores}/>
        <br></br>
        <div className="status">{status}</div>
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
        <br></br>
        {this.renderMenu()}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function checkDraw(squares){
  for (let i = 0; i < squares.length; i++)
    if (squares[i] == null)
      return false;
  return true;
}

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


// ME : X | index | Value
// -----------------------
// . . .  | 0     | 1
// X . .  | 1     | 2
// X X .  | 2     | 100
// O . .  | 3     | 1
// X O .  | 4     | 0
// impossible
// O O .  | 6     | 10

//What is the value of playing on this specific line?
function calculateLineValue(line, team) {
  const values = [1, 2, 100, 1, 0, 0, 10]
  let index = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] == null)
     continue ;
     index += (line[i] === team ? 1 : 3);
   }
  return values[index];
}

// How interresting is it to make that move?
function calculateWeight(squares, team, position) {
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
  let weight = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(position)) {
      const [a, b, c] = lines[i];
      weight += calculateLineValue([squares[a], squares[b], squares[c]], team);
    }
  }
  //preventing the AI from prefering the middle
  if (position === 4 && weight > 3)
    weight -= 3;
  return weight;
}

// where should I play?
function whereToPlay(squares, team) {
  let weight = -1;
  let move = 0;
  let comparedWeight = 0;
  for (let i = 0; i < 9; i++) {
    if (squares[i] != null)
      continue ;
    comparedWeight = calculateWeight(squares, team, i);
    if (comparedWeight > weight) {
      weight = comparedWeight;
      move = i;
    }
  }
//  alert(team+ '  '+move + ' '+ weight);

  return (move);
}

//
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Score
