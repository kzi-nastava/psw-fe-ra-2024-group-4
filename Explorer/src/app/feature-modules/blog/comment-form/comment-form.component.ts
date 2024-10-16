import { Component, EventEmitter,Input, OnChanges, OnInit, Output, SimpleChanges  } from '@angular/core';
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
export class CommentFormComponent implements OnChanges {
  
  @Output() commentUpdated = new EventEmitter<null>();
  @Input() comment: Comment;
  @Input() shouldEdit: boolean = false;
  userId: number = 0;
  @Input() postId: number;

  constructor(private service: BlogService, private authService: AuthService){ }

  commentForm= new FormGroup({
    text: new FormControl('', [Validators.required]),

  });

  ngOnInit(): void {
    
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id; 
     
    });
  }

  ngOnChanges(changes: SimpleChanges): void{
   this.commentForm.reset();
    if(this.shouldEdit){
      this.commentForm.patchValue(this.comment);
    }
      
    
    
  }

  addComment(): void{
    const currentDate = new Date().toISOString();
    console.log(this.commentForm.value)

    const comment: Comment = {
     
      text: this.commentForm.value.text || "",
      createdAt: currentDate,  
      updatedAt: currentDate ,
      userId: this.userId,
      postId: this.postId
      
      
    } ;
    console.log(comment); 
    this.service.addComment(comment).subscribe({
      next: (_) => {
        console.log("uspjesno")
        this.commentUpdated.emit()
      }
    });
  }

  updateComment(): void{
    const currentDate = new Date().toISOString();
    const comment: Comment = {
     
      text: this.commentForm.value.text || "",
      createdAt: currentDate,  
      updatedAt: currentDate ,
      userId: this.userId,
      postId: this.postId
      
      
    } ;
    comment.id=this.comment.id;
    this.service.updateComment(comment).subscribe({
      next: (_) => {
        this.commentUpdated.emit()

      }

    })
  }


}
