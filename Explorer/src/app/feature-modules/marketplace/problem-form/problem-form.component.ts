import { Component, createNgModule, EventEmitter, Output, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Problem } from '../model/problem.model';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'xp-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent {

  user: User | null = null;
  @Output() problemAdded = new EventEmitter<void>();
  @Input() tourId!: number;

  priorities = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium-Low' },
    { value: '3', label: 'Medium' },
    { value: '4', label: 'Medium-High' },
    { value: '5', label: 'High' },
  ];

  
  
  isChatOpen: boolean = false; 
  chatMessage: string = 'Submit a new problem or issue by filling out the form below. Specify the category, description, and priority of the problem. Once completed, click Done to submit the issue.';  
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(private servis: MarketplaceService, 
              private authService: AuthService, 
              private dialogRef: MatDialogRef<ProblemFormComponent>,
              @Inject(MAT_DIALOG_DATA) private data: {tourId: number }){
                
    this.authService.user$.subscribe((user)=>{
      this.user=user;    
      this.tourId = data.tourId
   })
  }

  ngOnInit(): void {}
  
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
        tourId: this.tourId,
        isActive: true,
        comments: [],
        deadline:0
      };

      console.log("Problem to be sent:", problem);

      this.servis.addProblem(problem).subscribe({
        next: (_)=>{
          console.log("Uspesan zahtev!");
          this.problemForm.reset(); // Optionally reset the form after submissio
          this.problemAdded.emit();
          this.dialogRef.close();
        }
      });
    }
  }
}
