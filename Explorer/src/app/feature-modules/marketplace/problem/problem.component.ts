import { Component, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit{

  problems: Problem[] = [];

  constructor(private service: MarketplaceService){}

  ngOnInit(): void {
    this.service.getProblems().subscribe({
      next: (result: PagedResults<Problem>)=>{
        this.problems=result.results;
      },
      error: (err: any)=>{
        console.log(err);
      }
    })
  }

  
}
