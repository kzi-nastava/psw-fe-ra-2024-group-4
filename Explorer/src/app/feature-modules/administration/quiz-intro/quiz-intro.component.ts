import { Component } from '@angular/core';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-quiz-intro',
  templateUrl: './quiz-intro.component.html',
  styleUrls: ['./quiz-intro.component.css']
})
export class QuizIntroComponent {
  showMore = false;

  constructor( private router: Router ){}
  getImage(image: string): string {
    return environment.webroot + "images/quiz/" + image;
  }
  navigateToQuiz() {
    this.router.navigate(['/quiz']);
}
showDescription(): void {
  this.showMore = !this.showMore;
}
}
