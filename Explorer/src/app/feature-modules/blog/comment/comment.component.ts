import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PostService } from '../post.service';
@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comment: Comment[] = [];
  selectedComment: Comment;
  shouldRenderCommentForm: boolean=false ;
  shouldEdit: boolean ;
  postId: number;
  currentUser: User;
  
  constructor( private service: CommentService,private postService: PostService, private route: ActivatedRoute,private authService: AuthService ){}

  ngOnInit(): void {
      
      this.route.params.subscribe(params => {
      this.postId = +params['postId']; 
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      });
      this.getCommentByPost(this.postId); 
    });
    }

  onEditClicked(comment: Comment): void{
    this.shouldEdit = true;
    this.selectedComment=comment;

    
    console.log(this.selectedComment);
  }

 onAddClicked(): void{
  this.shouldRenderCommentForm=true;
  this.shouldEdit=false;

 }

 deleteComment(comment: Comment): void{

this.service.deleteComment(comment).subscribe({

  next: (_) =>{
    this.getCommentByPost(this.postId);
  }
})
 }

 getCommentByPost(postId: number): void {
  const serviceToUse = this.currentUser.role==='tourist' ? this.service : this.postService;
  serviceToUse.getCommentByPost(postId,0,0).subscribe({
    next: (result: PagedResults<Comment>) => {
      this.comment = result.results;
    }
  });
}
}
