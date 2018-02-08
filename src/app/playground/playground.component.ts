import { Component, OnInit } from '@angular/core';

import { Result } from '../result';
import { Combination } from '../combination';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  NUMBER_OF_VALUES = 4;
  MAXIMUM_PLAYS = 10;
  COLORS: string[] = ['R', 'J',  'B', 'O', 'V', 'N'];

  computerCombination: Combination = [null, null, null, null];
  playerCombination: Combination = [null, null, null, null];
  results: Result[] = [];
  gameFinished = false;

  constructor() { }

  ngOnInit() {
    this.setRandomCombination();
  }

  // Required when biding to array elements using ngModel and inside a ngFor
  trackByIndex(index: number, value: number) {
    return index;
  }


  restart(): void {
    this.setRandomCombination();
    for (let i = 0; i < this.playerCombination.length; i++) {
      this.playerCombination[i] = null;
    }
    this.results = [];
    this.gameFinished = false;
  }

  setRandomCombination(): void {
    for (let i = 0; i < this.NUMBER_OF_VALUES; i++) {
      let randomNumber = Math.floor((Math.random() * this.COLORS.length));
      this.computerCombination[i] = this.COLORS[randomNumber];
    }
    console.log('New combination : ', this.computerCombination);
  }

  play(): void {
    // Init empty result
    let result: Result = {
      combination: '',
      rightColor: 0,
      rightColorAndRightPlace: 0
    };

    // Set number of perfect values
    for (let i = 0; i < this.NUMBER_OF_VALUES; i++) {
      result.combination = result.combination + this.playerCombination[i];
      if (this.computerCombination[i] === this.playerCombination[i]) {
        result.rightColorAndRightPlace++;
      }
    }

    // Set number of values with right number but wrong position
    for (let i = 0; i < this.COLORS.length; i++) {
      let countInComputerCombination = this.computerCombination.filter(
        value => value === this.COLORS[i]).length;
      let countInPlayerCombination = this.playerCombination.filter(
        value => value === this.COLORS[i]).length;

      if (countInPlayerCombination >= countInComputerCombination) {
        result.rightColor = result.rightColor + countInComputerCombination;
      } else {
        result.rightColor = result.rightColor + countInPlayerCombination;
      }
    }
    this.results.push(result);
    for (let i = 0; i < this.playerCombination.length; i++) {
      this.playerCombination[i] = null;
    }
    this.evaluatePlay();
  }

  evaluatePlay(): void {
    if (this.results[this.results.length - 1].rightColorAndRightPlace === this.NUMBER_OF_VALUES) {
      alert('You won !');
      this.gameFinished = true;
    } else if (this.results.length === this.MAXIMUM_PLAYS) {
      alert('You lost !');
      this.gameFinished = true;
    }
  }
}
