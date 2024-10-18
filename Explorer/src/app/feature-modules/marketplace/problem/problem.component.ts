import { Component, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

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

  constructor(private service: MarketplaceService, private authService: AuthService){}

  ngOnInit(): void {
    this.checkIfLoggedIn();
    this.authService.userLoggedIn.subscribe(()=>{
      this.checkIfLoggedIn();
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

  getProblems():void{
    this.service.getProblems().subscribe({
      next: (result: PagedResults<Problem>)=>{
        this.problems=result.results;
      },
      error: (err: any)=>{
        console.log(err);
      }
    })
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
