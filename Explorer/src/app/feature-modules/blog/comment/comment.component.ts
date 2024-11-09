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
import { Rating } from '../model/rating.model';

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
  userHasUpvoted = false;
  userHasDownvoted= false;
  ratings: Rating[];
  existingRating : Rating | null;
  
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
          this.ratings=this.postDetails.ratings;
          this.existingRating=this.ratings.find(r=>r.userId===this.currentUser.id) ?? null;
          this.checkVote();
        },
      
      });
    }

  checkVote(){
    if (this.existingRating) {
      this.userHasUpvoted = this.existingRating.value === 1;
      this.userHasDownvoted = this.existingRating.value === -1;
    } else {
      this.userHasUpvoted = false;
      this.userHasDownvoted = false;
    }
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

downvotePost() {
  if (this.existingRating) {
    if (this.existingRating.value === -1) {
      return;
    } else {
      this.updateRating(-1);
    }
  } else {
    this.addNewRating(-1);
  }
}

upvotePost(){
  if(this.existingRating){
    if(this.existingRating.value === 1){
      return;
    }
    else{
     this.updateRating(1);
    }
  }
  else{
    this.addNewRating(1)
  }
}
updateRating(value: number){
  const rating: Rating={
    userId:this.currentUser.id,
    value: value
  }
  this.existingRating=rating;
  this.ratings=[...this.ratings,rating];
  this.postDetails.ratingSum+=value;
  this.postService.updateRating(this.postId,rating).subscribe({
    next: ()=>{
      this.getPostDetails(this.postId);
    },
    error:(error)=>{
      console.log('failed to add rating');
    }
  })
}
addNewRating(value: number){
  const rating: Rating={
    userId: this.currentUser.id,
    value: value
  }
  this.existingRating=rating;
  this.ratings=[...this.ratings,rating];
  this.postDetails.ratingSum+=value;
  console.log(this.postId)
  this.postService.addRating(this.postId,rating).subscribe({
    next: ()=>{
      this.getPostDetails(this.postId);
    },
    error:(error)=>{
      console.log('failed to add rating');
    }
  })
}



}
