import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';

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
  
  constructor( private service: CommentService, private route: ActivatedRoute ){}

  ngOnInit(): void {
      
      this.route.params.subscribe(params => {
      this.postId = +params['postId']; 
      this.getCommentByPost(this.postId); 
    });
    }

 
    
    getComment():void{
      this.service.getComment().subscribe({
        next: (result: PagedResults<Comment>) => {
        this.comment = result.results;
      },
      error: () => {
        
      }
    })
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
  this.service.getCommentByPost(postId,0,0).subscribe({
    next: (result: PagedResults<Comment>) => {
      this.comment = result.results;
    }
  });
}
}
