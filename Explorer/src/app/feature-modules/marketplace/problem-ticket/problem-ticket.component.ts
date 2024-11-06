import { Component, OnInit, Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Problem } from '../model/problem.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ProblemComment } from '../model/problem-comment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PersonInfo } from '../../person.info/model/info.model';
import { PersonInfoService } from '../../person.info/person.info.service';
import { TourService } from '../../tour-authoring/tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-problem-ticket',
  templateUrl: './problem-ticket.component.html',
  styleUrls: ['./problem-ticket.component.css']
})
export class ProblemTicketComponent implements OnInit {
  @Input() problem!: Problem;
  user: User | null = null;
  newCommentText: string = '';
  problem1: Problem; 
  users: {[key: number]: PersonInfo} = {}
  userFullNames: {[key: number]: String} = {}
  roles: {[key: number]: String} = {}
  authorId: number = 0;
  isModalOpen = false;  
  

  newComment: ProblemComment = {
    problemId: 0,
    userId: 0,
    text: "",
    timeSent: new Date()
  }
  /*problem : Problem = {
    id: 5,
    userId: 1,
    tourId: 1,
    category: 'TEHNICKI',
    description: 'Ovo je deskripcija tehnickog problema Ovo je deskripcija tehnickog problema Ovo je deskripcija tehnickog problema Ovo je deskripcija tehnickog problema ',
    priority: 1,
    time: new Date(),
    isActive: true,
    comments: [
      {
        problemId: 5,
        userId: 1,
        text: 'TestKomentar 1',
        timeSent: new Date()
      },
      {
        problemId: 5,
        userId: 1,
        text: 'TestKomentar 2',
        timeSent: new Date()
      },
    ],
  };*/

  constructor(private service: MarketplaceService, private authService: AuthService, private personInfoService: PersonInfoService, private tourService: TourService, private router: Router) {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      //console.log(this.user);
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
    }, 200);
    this.problem = history.state.problem;


    if (this.problem.id) {
      this.loadProblem(this.problem.id);
    }
    //this.problem = this.problemm;
    console.log('poslat problem', this.problem);
    this.setAuthorId();
    this.setRoles();
    this.setNames();
  }
  loadProblem(problemId: number): void {
    this.service.getProblemById(problemId).subscribe(
      (problem: Problem) => {
        this.problem = problem;
        this.initializeComponent();
      },
      (error) => {
        console.error('Error loading problem:', error);
      }
    );
  }
  initializeComponent(): void {
    console.log('Problem loaded:', this.problem);
    this.setAuthorId();
    this.setRoles();
    this.setNames();
  }


  setAuthorId(){
    if(this.user !== null && this.user.role==='author'){
      this.authorId = this.user?.id;
    }
    this.problem.comments.forEach(comment => {
      if(comment.userId !== this.problem.userId){
        this.authorId = comment.userId;
      }
    })
  }


  setNames(){
    
    //set names as tourist
    if(this.user?.role==='tourist'){
      //tourist name
      this.setNameAsTourist(this.problem.userId);
      //author
      this.setNameAsTourist(this.authorId);
    }
    if(this.user?.role==='author'){
      //tourist name
      this.setNameAsAuthor(this.problem.userId);
      //set author name
      this.setNameAsAuthor(this.authorId);
    }


  }

  setNameAsTourist(id: number){
    this.personInfoService.getTouristInfo(id).subscribe({
      next:(result: PersonInfo)=>{
        this.users[result.userId] = result;
        this.userFullNames[result.userId] = result.name + ' ' + result.surname;
        //console.log(this.users);
      },
      error: () => {
        console.log('error getting tourist info');
      }
    })
  }

  setNameAsAuthor(id: number){
    if(this.authorId !== 0){
      this.personInfoService.getAuthorInfo(id).subscribe({
        next:(result: PersonInfo)=>{
          this.users[result.userId] = result;
          this.userFullNames[result.userId] = result.name + ' ' + result.surname;
          //console.log(this.users);
        },
        error: () => {
          console.log('error getting author info');
        }
      })
    }
    else{
      console.log('off sync ofc');
    }
  }

 /* setAuthorId(): number{
    var authorId = 0;
    this.tourService.getTour(this.problem.tourId).subscribe({
      next:(result: Tour)=>{
        authorId = result.userId;
        return authorId;
      },
      error:()=>{
        console.log('Error getting tour');
        return authorId;
      }
    })
    return authorId;
  }*/

  returnToAll(): void{
    this.router.navigate(['/problem']);
  }

  setRoles(){
    this.roles[this.problem.userId] = 'Tourist';
    this.roles[this.authorId] = 'Author';

  }

  toggleProblemStatus(): void {
    this.isModalOpen = true;

    if (!this.hasAuthorComment()) {
      alert('You cannot close this problem! Author must first add a comment before closing the issue.');
      return;
  }

    if (!this.problem || typeof this.problem.id !== 'number') {
      console.error('Problem nije definisan ili ID nije validan.');
      return; 
    }
    const newStatus = !this.problem.isActive;
    
    this.service.updateProblemStatus(this.problem.id , newStatus).subscribe(
      (updatedProblem: Problem) => {
        this.problem = updatedProblem;
        console.log('Updated problem status:', updatedProblem);
      },
      (error) => {
        console.error('Error updating problem status:', error);
      }
    );
  }
  hasAuthorComment(): boolean {
    // Proverite da li je autor u listi komentara
    return this.problem.comments.some(comment => comment.userId === this.authorId);
}

  closeModal(): void {
    this.isModalOpen = false;  // Zatvori modal bez akcije
  }
/*
  submitAndClose(): void {
    if (!this.newComment.text.trim()) {
      console.error('Comment cannot be empty!');
      return;
    }

    // Postavi podatke za novi komentar
    this.newComment.problemId = this.problem.id;
    this.newComment.userId = this.user?.id || 0;
    this.problem.isActive = false;

    // Pošalji komentar i zatvori problem
    this.service.postProblemCommentAsTourist(this.newComment).subscribe(
      (response: Problem) => {
        this.problem = response;
        this.toggleProblemStatus();  // Zatvori problem
        this.isModalOpen = false;    // Zatvori modal
        this.newComment.text = '';   // Resetuj tekst
      },
      (error) => {
        console.error('Error posting comment:', error);
      }
    );
  }*/
    submitAndClose(): void {
      if (!this.newComment.text.trim()) {
        console.error('Comment cannot be empty!');
        return;
      }
    
      this.newComment.problemId = this.problem.id;
      this.newComment.userId = this.user?.id || 0;
      if (!this.problem || typeof this.problem.id !== 'number') {
        console.error('Problem nije definisan ili ID nije validan.');
        return; 
      }
      // Zatvori problem pre slanja komentara
      this.problem.isActive = false;
      this.service.updateProblemStatus(this.problem.id, false).subscribe(
        () => {
          this.postCommentAndClose(); // Nastavi sa slanjem komentara
        },
        (error) => {
          console.error('Error updating problem status:', error);
          this.isModalOpen = false; // Zatvori modal čak i ako ažuriranje nije uspelo
        }
      );
    }
    
    postCommentAndClose(): void {
      this.service.postProblemCommentAsTourist(this.newComment).subscribe(
        (response: Problem) => {
          this.problem = response;
          console.log('Comment added and problem closed:', response);
          this.isModalOpen = false; // Zatvori modal
          this.newComment.text = ''; // Resetuj unos komentara
        },
        (error) => {
          console.error('Error posting comment:', error);
        }
      );
    }
    


  onCommentInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.newComment.text = textarea.value; 
  }

  postComment(): void{
    if (!this.newComment.text.trim()) {
      console.error('Comment cannot be empty!');
      return; 
    }
    if(this.user!==null && this.problem.id !== null){
      this.newComment.problemId = this.problem.id;
      this.newComment.userId = this.user.id;
      console.log(this.newComment);
      if(this.user.role ==='tourist'){
        this.service.postProblemCommentAsTourist(this.newComment).subscribe(
          (response: Problem) => {
            console.log('Problem returned:', response);
            //ovo obrisi /zakomentarisi
            this.problem1 = response;
            this.problem = response;
            console.log(this.problem1);

          
            this.newComment.text = ''; 
          },
          (error) => {
            console.error('Error posting comment:', error);
            console.log(this.newComment);
            
          }
        );
      }
      if(this.user.role ==='author'){
        this.service.postProblemCommentAsAuthor(this.newComment).subscribe(
          (response: Problem) => {
            console.log('Problem returned:', response);
            //ovo obrisi /zakomentarisi
            this.problem1 = response;
            this.problem = response;
            console.log(this.problem1);

            this.newComment.text = ''; 
          },
          (error) => {
            console.error('Error posting comment:', error);
            console.log(this.newComment);
            
          }
        );
      }
    }
  }
}
