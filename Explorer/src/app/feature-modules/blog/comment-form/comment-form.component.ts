import { Component, EventEmitter,Input, OnChanges, OnInit, Output, SimpleChanges  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../comment.service';
import { Comment } from '../model/comment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PostService } from '../post.service';

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
  showCommentForm: boolean = true;
  @Input() postId: number;


  constructor(private service: CommentService, private authService: AuthService,private postService: PostService){ }

  commentForm= new FormGroup({
    text: new FormControl('', [Validators.required]),

  });

  ngOnInit(): void {
    
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id; 
     
    });
  }

  ngOnChanges(): void{
   this.commentForm.reset();
    if(this.shouldEdit){
      this.commentForm.patchValue(this.comment);
      this.showCommentForm = true;
    }
      
    
    
  }

  addComment(): void {
    const currentDate = new Date().toISOString();
    this.authService.user$.subscribe((user: User) => {
    const comment: Comment = {
      text: this.commentForm.value.text || "",
      createdAt: currentDate,
      updatedAt: currentDate,
      userId: this.userId,
      postId: this.postId,
      username: user.username
    };
  
    this.service.addCommentToPost(this.postId, comment).subscribe({
      next: () => {
        this.commentUpdated.emit();
        this.commentForm.reset();
        this.showCommentForm = false;
      }
    });
  });
}
  

updateComment(): void {
  const currentDate = new Date().toISOString();
  this.authService.user$.subscribe((user: User) => {
  const updatedComment: Comment = {
    id: this.comment.id,
    text: this.commentForm.value.text || "",
    createdAt: this.comment.createdAt,
    updatedAt: currentDate,
    userId: this.userId,
    postId: this.postId,
    username: user.username
  };

  this.service.updateCommentInPost(this.postId,updatedComment).subscribe({
    next: () => {
      this.commentUpdated.emit();
      this.commentForm.reset();
      this.showCommentForm = false;
    }
  });
});
}


}
