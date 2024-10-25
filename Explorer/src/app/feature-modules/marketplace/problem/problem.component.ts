import { Component, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'xp-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit{

  problems: Problem[] = [];
  shouldEdit: boolean=false;
  shoudAdd: boolean=false;
  isLoggedIn: boolean=false;
  showProblemForm: boolean=false;
  user: User;

  constructor(private service: MarketplaceService, private authService: AuthService){  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User) => {
      this.user = user;
      this.checkIfLoggedIn(); // Ensure to check login status after user data is fetched
    });
    this.checkIfLoggedIn();
    this.authService.userLoggedIn.subscribe(()=>{
      this.checkIfLoggedIn();
   })
   this.authService.userLoggedOut.subscribe(()=>{
      this.showProblemForm = false; 
      this.isLoggedIn=false;
   })
  }

  checkIfLoggedIn(): void{
    this.isLoggedIn=this.authService.isLoggedIn();
    if(this.isLoggedIn){
      this.getProblems();
    }
  }


  deleteProblem(id: number):void{
    this.service.deleteProblem(id).subscribe({
      next: ()=>{
        this.getProblems();
      }
    })
  }

  getProblems(): void {
    if (!this.user) {
      console.warn('User is undefined, cannot fetch problems.');
      return;
    }
    console.log(this.user.role);
    if(this.user.role=='administrator'){
      this.service.getProblems().subscribe({
        next: (result: PagedResults<Problem>) => {
          this.problems = result.results;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
    if(this.user.role=='tourist'){
      this.service.getProblemsByTouristId(this.user.id).subscribe({
        next: (result: Problem[]) => {
          console.log(result);
          this.problems = result;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  onAddClick(): void{
    this.shoudAdd=true;
    this.shouldEdit=false;
    this.showProblemForm=true;
  }

  onProblemAdded(): void {
    this.getProblems();
    this.showProblemForm = false; 
  }
  

}
