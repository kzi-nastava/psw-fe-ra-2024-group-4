import { Component, OnInit, Input } from '@angular/core';
import { Problem } from '../../marketplace/model/problem.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ProblemComment } from '../../marketplace/model/problem-comment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PersonInfo } from '../../person.info/model/info.model';
import { PersonInfoService } from '../../person.info/person.info.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-club-posts',
  templateUrl: './club-posts.component.html',
  styleUrls: ['./club-posts.component.css']
})
export class ClubPostsComponent implements OnInit {
  @Input() clubId!: number; // Prosleđuje se kao ulaz u komponentu
  
  tourId!: number; // Tour ID se vezuje za Club ID
  problem: Problem; // Podaci o problemu
  comments: ProblemComment[] = []; // Komentari problema
  newComment: ProblemComment = {
    problemId: 0,
    userId: 0,
    text: "",
    timeSent: new Date()
  }
  user: User | null = null; // Trenutno ulogovani korisnik
  userFullNames: { [key: number]: string } = {}; // Mape za imena korisnika
  userImages: { [key: number]: string } = {}; // Mape za imena korisnika
  roles: { [key: number]: string } = {}; // Mape za uloge korisnika

  constructor(
    private service: MarketplaceService,
    private authService: AuthService,
    private personInfoService: PersonInfoService
  ) {}

  ngOnInit(): void {
    console.log(this.clubId);
    this.tourId = this.clubId; // Dodela clubId kao tourId
    this.authService.user$.subscribe(user => (this.user = user)); // Dobijanje trenutnog korisnika
    this.loadProblem(); // Učitavanje problema i povezanih podataka
  }
  loadProblem(): void {
    this.service.getFirstProblemByTourId(this.clubId).subscribe({
      next: (problem: Problem | null) => {
        if (problem) {
          this.problem = problem;
          this.comments = problem.comments || [];
          this.initializeProblemDetails();
          console.log('Problem loaded:', this.problem);
        } else {
          console.log('No problem found for the given tourId.');
          // Ako treba, postavi default vrednosti za `problem` i `comments`
         // this.problem = null; // ili neki podrazumevani `Problem` objekat
          this.comments = [];
        }
      },
      error: error => {
        console.error('Error loading problem:', error);
      }
    });
  }
  
  // loadProblem(): void {
  //   this.service.getFirstProblemByTourId(/*this.tourId*/1).subscribe({
  //     next: (problem: Problem) => {
  //       this.problem = problem;
  //       this.comments = problem.comments || [];
  //       this.initializeProblemDetails();
  //       console.log('Problem loaded:', this.problem);
  //     },
  //     error: error => {
  //       console.error('Error loading problem:', error);
  //     }
  //   });
  // }

  initializeProblemDetails(): void {
    this.setRoles();
    this.setNames();
  }

  setRoles(): void {
    this.roles[this.problem.userId] = 'Tourist';
    this.problem.comments.forEach(comment => {
      if (!this.roles[comment.userId]) {
        this.roles[comment.userId] = 'Commenter'; // Generička uloga za komentatore
      }
    });
  }

  setNames(): void {
    this.setName(this.problem.userId);
    this.problem.comments.forEach(comment => {
      this.setName(comment.userId);
    });
  }

  setName(userId: number): void {
    this.personInfoService.getTouristInfo(userId).subscribe({
      next: (info: PersonInfo) => {
        this.userFullNames[userId] = `${info.name} ${info.surname}`;
        this.userImages[userId] = info.imageUrl;
        console.log(info.imageUrl);
      },
      error: () => {
        console.log(`Error fetching info for userId: ${userId}`);
      }
    });
  }
  postComment(): void {
    if (!this.newComment.text.trim()) {
      console.error('Comment cannot be empty!');
      return;
    }
  
    if (!this.user || !this.problem || this.problem.id === undefined) {
      console.error('User, problem, or problem.id is null or undefined.');
      return;
    }
  
    // Postavljanje osnovnih vrednosti za komentar
    this.newComment.problemId = this.problem.id;
    this.newComment.userId = this.user.id;
  
    // Slanje komentara
    this.service.postProblemCommentAsTourist(this.newComment).subscribe({
      next: (response) => {
        console.log('Comment successfully posted:', response);
        this.loadProblem(); // Osvežavanje liste problema i komentara
      },
      error: (error) => {
        console.error('Error posting comment:', error);
      }
    });
  
    // Resetovanje polja za unos komentara
    this.newComment.text = '';
  }
  
 onCommentInput(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  this.newComment.text = textarea.value; 
}
getImage(image: string): string {
      return environment.webroot + "images/clubs/" + image;
    }
    getImage1(image: string): string {
      return environment.webroot  + image;
    }
}
