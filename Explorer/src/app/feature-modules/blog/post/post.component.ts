import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { CommentService } from '../comment.service';
import { Post } from '../model/post.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  posts: Post[]=[];
  shouldRenderForm: boolean =false;
  shouldEdit: boolean=false;
  selectedPostId: number | null = null
  user:User | null=null;
  selectedPost: Post;
  shouldRenderCommentForm: boolean = false;

  constructor( private comService: CommentService,private service: PostService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }

  ngOnInit(): void {
    this.getPosts();
  }
  getPosts():void{
    this.service.getPosts().subscribe({
      next:(result:PagedResults<Post>)=>{
        this.posts=result.results;
        this.shouldRenderForm = false;
      },
      error(err:any){
        console.log(err);
      }
    })
  }

  onEditClicked(post:Post):void{
      this.selectedPost=post;
      this.shouldRenderForm=true;
      this.shouldEdit=true;
  }
  onAddClicked():void{
    this.shouldEdit=false;
    this.shouldRenderForm=true;
    console.log('kliknuto');
  }
  onDeletePostClicked(id: number):void{
    this.service.deletePost(id).subscribe({
      next:()=>{
        this.getPosts();
      }
    })
  }
  onCommentClicked(postId: number): void {
    this.selectedPostId = postId;  
    this.shouldRenderCommentForm = true;  
  }
}

