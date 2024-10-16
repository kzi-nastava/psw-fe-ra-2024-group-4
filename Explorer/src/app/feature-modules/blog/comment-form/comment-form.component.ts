import { Component, EventEmitter,Input, OnChanges, OnInit, Output  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Comment } from '../model/comment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  
  @Output() commentUpdated = new EventEmitter<null>();
  userId: number = 0;
  constructor(private service: BlogService, private authService: AuthService){ }

  commentForm= new FormGroup({
    text: new FormControl('')
  })

  ngOnInit(): void {
    
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id; 
    });
  }


  addComment(): void{
    const currentDate = new Date().toISOString();
    console.log(this.commentForm.value)

    const comment: Comment = {
     
      text: this.commentForm.value.text || "",
      createdAt: currentDate,  
      updatedAt: currentDate ,
      userId: this.userId,
      postId: 1
      
      
    } ;
    console.log(comment); 
    this.service.addComment(comment).subscribe({
      next: (_) => {
        console.log("uspjesno")
        this.commentUpdated.emit()
      }
    });
  }
}
