import { readFile } from 'fs';
const filename = './sudoku.txt';

readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  const sudoku = data.split(/(\d{9}\n\d{9}\n\d{9}\n\d{9}\n\d{9}\n\d{9}\n\d{9}\n\d{9}\n\d{9})/);
  for (let index = 1; index < sudoku.length; index+=2){
    const element = sudoku[index];
    let matrix = convertToMatrix(element);
    console.log(sudoku[index-1])
    const solution = solve(matrix,0);
    outputSoduku(solution)

    const sum = solution[0]+solution[1]+solution[2];
    console.log(solution[0],'+',solution[1],'+',solution[2],' = ',sum)

  }
});


/**
 * 
 * @param {soduku} sourceMatrix 
 * @param {number} current
 * 
 * @returns {soduku} 
 */
function solve(sourceMatrix,current){
  let matrix = [...sourceMatrix]
  //let simple_solution_is_work = false;
  while (!isSolved(matrix)) {
    let next_guess = current
    if(matrix[current]!=0){
      next_guess = findNextEmpty(matrix,current)
    }
    const guess_result = findSolutionByGuess(matrix,next_guess)
    if(guess_result!==false){
      matrix = guess_result
    }else{
      return matrix;
    }
  }
  return matrix;
}

/**
 * 
 * @param {soduku} sourceMatrix 
 * @param {number} current
 * 
 * @returns {false|soduku} 
 */
function findSolutionByGuess(sourceMatrix,current){
  let matrix = [...sourceMatrix];
  const row_index = Math.floor(current/9);
  const col_index = Math.floor(current%9);
  const rows = getRow(matrix,row_index);
  const columns  = getColumn(matrix,col_index);
  const square  = getSquare(matrix,Math.floor(row_index/3),Math.floor(col_index/3));
  const merged_array = rows.concat(columns).concat(square)
  
  const possibilities = [1,2,3,4,5,6,7,8,9].filter(
    function(e) {
      return this.indexOf(e) < 0;
    },
    merged_array
  );
  if(possibilities.length == 0){
    //wrong guess
    return false
  }else{
    for (let index = 0; index < possibilities.length; index++) {
      const possibility = possibilities[index];
      //pick 1 possible answer
      matrix[current] = possibility;
      const solve_result = solve(matrix,current+1);
      if(isSolved(solve_result)){
        //Solution found
        return solve_result;
      }
    }
    //wrong guess
    return false;
  }

}

/**
 * 
 * @param {soduku} matrix 
 * @param {number} current 
 * 
 * @returns {false|number}
 */
function findNextEmpty(matrix,current){
  for (let index = current+1; index < matrix.length; index++) {
    if(matrix[index] == 0){
      return index;
    }
  }
  return false;
}

function outputSoduku(matrix){
  for (let index = 0; index < 9; index++) {
    console.log(
      matrix[0+index*9],
      matrix[1+index*9],
      matrix[2+index*9],
      matrix[3+index*9],
      matrix[4+index*9],
      matrix[5+index*9],
      matrix[6+index*9],
      matrix[7+index*9],
      matrix[8+index*9])
    
  }
}

/**
 * @param {soduku}
 */
function isSolved(matrix){
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const sum = matrix.reduce(reducer)
  return sum === 45*9;
}

/**
 * 
 * @param {string} data 
 * @returns {soduku}
 */
function convertToMatrix(data){
  const matrix = [];

  data.split('').forEach(num => {
    if(num != '\n' ){
      matrix.push(parseInt(num));
    }
  });
  return matrix;
}
/**
 * 
 * @param {soduku} matrix 
 * @param {0|1|2|3|4|5|6|7|8} row 
 * @returns {Array<number>}
 */
function getRow(matrix,row){
  const rowPlus = row*9;
  return [
    matrix[0+rowPlus],
    matrix[1+rowPlus],
    matrix[2+rowPlus],
    matrix[3+rowPlus],
    matrix[4+rowPlus],
    matrix[5+rowPlus],
    matrix[6+rowPlus],
    matrix[7+rowPlus],
    matrix[8+rowPlus]];
}
/**
 * 
 * @param {soduku} matrix 
 * @param {0|1|2|3|4|5|6|7|8} column 
 * @returns {Array<number>}
 */
function getColumn(matrix,column){
  const colPlus = column;
  return [matrix[0+colPlus],matrix[9+colPlus],matrix[18+colPlus],matrix[27+colPlus],matrix[36+colPlus],matrix[45+colPlus],matrix[54+colPlus],matrix[63+colPlus],matrix[72+colPlus]];
}
/**
 * 
 * @param {soduku} matrix 
 * @param {0|1|2} row 
 * @param {0|1|2} column 
 * @returns {Array<number>}
 */
function getSquare(matrix,row,column){
  let rowPlus = row*3*9;
  let colPlus = column*3
  return [
    matrix[0 +rowPlus+colPlus],matrix[1 +rowPlus+colPlus],matrix[2 +rowPlus+colPlus],
    matrix[9 +rowPlus+colPlus],matrix[10+rowPlus+colPlus],matrix[11+rowPlus+colPlus],
    matrix[18+rowPlus+colPlus],matrix[19+rowPlus+colPlus],matrix[20+rowPlus+colPlus]]
}


/** 
 @typedef {Array<number>} soduku
 */