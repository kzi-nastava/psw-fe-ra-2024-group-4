import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PostService } from '../post.service';
import { Post } from '../model/post.model'
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'
  ]
})
export class CommentComponent implements OnInit {
  comment: Comment[] = [];
  selectedComment: Comment;
  shouldRenderCommentForm: boolean=false ;
  shouldEdit: boolean ;
  postId: number;
  currentUser: User;
  postDetails: Post;
  
  constructor( private service: CommentService,private postService: PostService, private route: ActivatedRoute,private authService: AuthService ){}

  ngOnInit(): void {
      
      this.route.params.subscribe(params => {
      this.postId = +params['postId']; 
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      });
      this.getPostDetails(this.postId);
    });
    }

    getPostDetails(postId: number): void {
      const serviceToUse = this.currentUser?.role === 'author' ? this.postService : this.service;
      serviceToUse.getPostById(postId).subscribe({
        next: (post) => {
          this.postDetails = post;
          this.comment=this.postDetails.comments;
        },
      
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

   this.service.deleteCommentFromPost(comment.postId,comment.id!).subscribe({

   next: (_) =>{
    this.getPostDetails(this.postId);
  }
 })
  }
  getImage(imageUrl: string | undefined): string {
  return imageUrl ? environment.webroot + imageUrl : 'assets/images/placeholder.png';
}
}
