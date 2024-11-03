import { Component, createNgModule, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Problem } from '../model/problem.model';
import { ProblemComment } from '../model/problem-comment.model';

@Component({
  selector: 'xp-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent {

  user: User | null = null;
  @Output() problemAdded = new EventEmitter<void>();

  constructor(private servis: MarketplaceService, private authService: AuthService){
    this.authService.user$.subscribe((user)=>{
      this.user=user;    
   })
  }
  
  problemForm=new FormGroup({
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required])
  })

  addProblem(): void{
    
    if(this.user){
      const problem: Problem={
        category: this.problemForm.value.category || "",
        description: this.problemForm.value.description || "",
        priority: parseInt(this.problemForm.value.priority ?? '0'),
        time: new Date(Date.now()),
        userId: this.user.id,
        tourId: 1,
        isActive: true,
        comments: []
      };

      console.log("Problem to be sent:", problem);

      this.servis.addProblem(problem).subscribe({
        next: (_)=>{
          console.log("Uspesan zahtev!");
          this.problemAdded.emit();
        }
      });
    }
  }
}
