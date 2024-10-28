import { Component, OnInit, Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Problem } from '../model/problem.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ProblemComment } from '../model/problem-comment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-problem-ticket',
  templateUrl: './problem-ticket.component.html',
  styleUrls: ['./problem-ticket.component.css']
})
export class ProblemTicketComponent implements OnInit {
  @Input() problemm: Problem;
  user: User | null = null;
  newCommentText: string = '';
  problem1: Problem; 
  tourist: User | null = null;
  author: User | null = null;
  
  newComment: ProblemComment = {
    problemId: 0,
    userId: 0,
    text: "",
    timeSent: new Date()
  }
  problem : Problem = {
    id: 5,
    userId: 1,
    tourId: 1,
    category: 'TEHNICKI',
    description: 'Ovo je deskripcija tehnickog problema Ovo je deskripcija tehnickog problema Ovo je deskripcija tehnickog problema Ovo je deskripcija tehnickog problema ',
    priority: 1,
    time: new Date(),
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
  };

  constructor(private service: MarketplaceService, private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      this.tourist = user;
      console.log(user); 
    });
  }

  ngOnInit(): void {
    this.setRoles();
  }

  setRoles(){
    if(this.user!==null){
      if(this.user.role==='tourist'){
        this.tourist = this.user;
        this.getAuthor();
      }
      else{
        this.author = this.user;
        this.getTourist();
      }
    }
  }

  getAuthor(){

  }
  getTourist(){

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
        //postasauthor
      }
    }
  }
}
