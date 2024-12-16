import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PostService } from '../post.service';
import { Post } from '../model/post.model'
import { environment } from 'src/env/environment';
import { Rating } from '../model/rating.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
  editingStates: Map<number, boolean> = new Map();
  commentForm: FormGroup;
  
  constructor( private service: CommentService,private postService: PostService, private route: ActivatedRoute,private authService: AuthService){}

  ngOnInit(): void {
      
      this.route.params.subscribe(params => {
      this.postId = +params['postId']; 
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      });
      this.getPostDetails(this.postId);
    });

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required, Validators.minLength(2)]),
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
  onEditClicked(comment: Comment): void {
    if (comment.id !== undefined) {
      this.startEditing(comment.id);
      this.selectedComment = comment;
  
      this.commentForm.setValue({
        text: comment.text || '',
      });
    } else {
      console.error('Comment ID is undefined.');
    }
  }
  

 onAddClicked(): void{
  this.shouldRenderCommentForm=true;
  this.shouldEdit=false;
  this.commentForm.reset();

 }
 cancelAdd(): void {
  this.shouldRenderCommentForm = false;
}

addComment(): void {
  if (this.commentForm.invalid) return;

  const newComment: Comment = {
    text: this.commentForm.value.text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: this.currentUser.id,
    postId: this.postId,
    username: this.currentUser.username,
  };

  this.service.addCommentToPost(this.postId, newComment).subscribe({
    next: () => {
      console.log(newComment.createdAt);
      console.log(newComment.updatedAt);
      this.getPostDetails(this.postId);
      this.shouldRenderCommentForm = false;
    },
    error: () => {
      console.error('Failed to add comment');
    },
  });
}


  deleteComment(comment: Comment): void{
    Swal.fire({
          title: 'Are you sure?',
          text: "Do you really want to delete this comment? This action cannot be undone.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.deleteCommentFromPost(comment.postId,comment.id!).subscribe({
            next: (_) =>{
               Swal.fire(
                            'Deleted!',
                            'Your comment has been deleted.',
                            'success'
                          );
               this.getPostDetails(this.postId);
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
    });
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
startEditing(commentId: number): void {
  this.editingStates.set(commentId, true);
}
stopEditing(commentId: number | undefined): void {
  if (commentId === undefined) {
    console.warn('Comment ID is undefined.');
    return;
  }
  this.editingStates.delete(commentId);
}

saveComment(comment: Comment): void {
  const updatedComment = {
    ...comment,
    text: this.commentForm.value.text || comment.text,
    updatedAt: new Date().toISOString(),
  };

  this.service.updateCommentInPost(comment.postId, updatedComment).subscribe({
    next: () => {
      this.getPostDetails(this.postId);
      this.stopEditing(comment.id!);
    },
    error: () => {
      console.error('Failed to save comment');
    },
  });
}

getImageProfile(profilePicture: string): string {
  return environment.webroot + profilePicture; 
}

}
