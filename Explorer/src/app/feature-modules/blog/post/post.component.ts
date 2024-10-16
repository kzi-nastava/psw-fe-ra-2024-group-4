import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
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
  shouldRenderCommentForm: boolean = false;

  constructor(private service: BlogService,private authService: AuthService){
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
      },
      error(err:any){
        console.log(err);
      }
    })
  }

  onAddClicked():void{
    this.shouldEdit=false;
    this.shouldRenderForm=true;
    console.log('kliknuto');
  }
  onCommentClicked(postId: number): void {
    this.selectedPostId = postId;  // Sačuvaj ID odabranog posta
    this.shouldRenderCommentForm = true;  // Prikaži formu za komentare
  }
}

