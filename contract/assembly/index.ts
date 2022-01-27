//import para traer los tipos de datos de model
import { score, scoreBoard } from './model';

//esta funcion sirve para agregar una puntuación ligada al id con el que se inició sesión
export function addScore(actualScore: u16): void {
  //se crea una puntuación
  const scored = new score(actualScore);
  //se agrega al final
  scoreBoard.push(scored);
}

export function getScores(): score[] {
  const scoresNumber = scoreBoard.length;
  let result = new Array<score>(scoresNumber);

  //pasar los datos de scoreBoard a un resultado de tipo score[]
  for(let i = 0; i < scoresNumber; i++) {
    result[i] = scoreBoard[i];
  }
  //ordenar los datos
  result=bucketSort(result,scoresNumber);

  return result;
}

//Algoritmo de ordenamiento bucket
// InsertionSort to be used within bucket sort
function insertionSort(array:u16[]) {
  var length = array.length;
  
  for(var i = 1; i < length; i++) {
    var temp = array[i];
    for(var j = i - 1; j >= 0 && array[j] > temp; j--) {
      array[j+1] = array[j];
    }
    array[j+1] = temp;
  }
  
  return array;
}

// Implement bucket sort
function bucketSort(array:score[], bucketSize:u32) {
  if (array.length === 0) {
    return array;
  }

  // Declaring vars
  var i,
      minValue = array[0].quantity,
      maxValue = array[0].quantity,
      bucketSize = bucketSize || 5;
  
  // Setting min and max values
  array.forEach(function (currentVal) {
  	if (currentVal.quantity < minValue) {
  		minValue = currentVal.quantity;
  	} else if (currentVal.quantity > maxValue) {
  		maxValue = currentVal.quantity;
  	}
  })

  // Initializing buckets
  var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  var allBuckets = new Array<u16[]>(bucketCount);
  
  for (i = 0; i < allBuckets.length; i++) {
    allBuckets[i] = [];
  }
  
  // Pushing values to buckets
  array.forEach(function (currentVal:score) {
  	allBuckets[Math.floor((currentVal.quantity - minValue) / bucketSize)].push(currentVal.quantity);
  });

  // Sorting buckets
  array.length = 0;
  
  allBuckets.forEach(function(bucket:u16[]) {
  	insertionSort(bucket);
  	bucket.forEach(function (element) {
  		array.push(new score(element))
  	});
  });

  return array;
}
//Termina algoritmo de ordenamiento bucket