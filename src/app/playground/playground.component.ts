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
      rightColorAndWrongPlace: 0,
      rightColorAndRightPlace: 0
    };

    // Count max pawns of each color
    let countColorsInComputerCombination: number[] = [];
    for (let i = 0; i < this.COLORS.length; i++) {
      countColorsInComputerCombination[i] = this.computerCombination.filter(
        value => value === this.COLORS[i]).length;
    }

    for (let i = 0; i < this.NUMBER_OF_VALUES; i++) {
      result.combination = result.combination + this.playerCombination[i]; // Add current pawn to the combination to display
      if (this.computerCombination[i] === this.playerCombination[i]) {
        // Increments counter for right color & right place if it is the case
        result.rightColorAndRightPlace++;
        countColorsInComputerCombination[this.getIndexOfColor(this.playerCombination[i])]--;
        if (countColorsInComputerCombination[this.getIndexOfColor(this.playerCombination[i])] < 0) {
          // Right color & right place pawn has priority over right color & wrong place pawn
          // Therefore remove a right color & wrong place pawn and add a right color & right place pawn
          countColorsInComputerCombination[this.getIndexOfColor(this.playerCombination[i])]++;
          result.rightColorAndWrongPlace--;
        }
      } else if (this.computerCombination.includes(this.playerCombination[i]) &&
        countColorsInComputerCombination[this.getIndexOfColor(this.playerCombination[i])] > 0) {
        // Increments counter for right color and wrong position if the maximum of pawns of this color has not been reached
        result.rightColorAndWrongPlace++;
        countColorsInComputerCombination[this.getIndexOfColor(this.playerCombination[i])]--;
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

  getIndexOfColor(color: string): number {
    return this.COLORS.indexOf(color);
  }
}
