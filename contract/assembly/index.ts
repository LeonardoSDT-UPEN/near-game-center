//import para traer los tipos de datos de model
import { score, scoreBoard } from './model';
import { Context, logging, storage } from 'near-sdk-as'

const DEFAULT_MESSAGE = 'Bienvenido'

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

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

  return result;
}

export function getSortedScores(): Array<score> {
  return getScores().sort(
    (ScoreA, ScoreB) => <u16>ScoreB.quantity - <u16>ScoreA.quantity
  );
}