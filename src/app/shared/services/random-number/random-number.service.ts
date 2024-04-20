import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberService {
  private usedNumbers: Set<number> = new Set();
  private maxNumber = 1000000; // 1 million

  constructor() {}

  getRandomNonDuplicateNumber(): number | undefined {
    if (this.usedNumbers.size >= this.maxNumber) {
      return undefined;
    }

    let randomNum: number;
    do {
      randomNum = Math.floor(Math.random() * this.maxNumber) + 1;
    } while (this.usedNumbers.has(randomNum));

    this.usedNumbers.add(randomNum);
    return randomNum;
  }
}
