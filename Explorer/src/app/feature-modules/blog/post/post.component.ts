import { Component, OnInit, NgModule } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CommentService } from '../comment.service';
import { environment } from 'src/env/environment';
import { BlogStatus } from '../model/post.model';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgControl } from '@angular/forms';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  posts: Post[]=[];
  allPosts: Post[]=[];
  shouldRenderForm: boolean =false;
  shouldEdit: boolean=false;
  selectedPostId: number | null = null
  user:User | null=null;
  selectedPost: Post;
  shouldRenderCommentForm: boolean = false;
  //status za filter
  public BlogStatus = BlogStatus; // Omogućava pristup `BlogStatus` u HTML-u
  selectedStatus: BlogStatus | null = null;
  isMouseDownWithinForm: boolean=false;
  isMouseUpWithinForm: boolean = false;
  isMouseDownWithinOverlay: boolean=false;
  isMouseUpWithinOverlay: boolean =false;

  constructor(private service: PostService,private comService: CommentService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }

  ngOnInit(): void {
    this.getPosts();
  }
  getPosts(): void {
    const serviceToUse = this.user?.role === 'author' ? this.service : this.comService;
  
    serviceToUse.getPosts().subscribe({
      next: (result: PagedResults<Post>) => {
        this.posts = result.results;
        if(this.user?.role === 'tourist'){
          this.posts = this.posts.filter(p => p.status!== 0);
        }
        this.allPosts = this.posts;
        this.shouldRenderForm = false;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
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
  getImage(imageUrl: string | undefined): string {
    return imageUrl ? environment.webroot + imageUrl : 'assets/images/placeholder.png'; // Provide a fallback image or empty string
  }

  //filtriranje blogova

  getFilteredBlogs() {
    if (this.selectedStatus === null) {
      return this.allPosts;
    }
    this.posts.forEach((post) => {
      console.log('Status posta:', post.status);
    });
    return this.allPosts.filter(post => post.status === this.selectedStatus);
  }

  async onStatusChange(event: any) {
    console.log(this.selectedStatus);
    /*if(this.selectedStatus === null){
      this.getPosts();
    }
    else{

      this.getPosts();
      await new Promise(resolve => setTimeout(resolve, 100));
      this.posts = this.getFilteredBlogs();
    }*/
    this.posts = this.getFilteredBlogs();
  }

  closeForm(){
    console.log("overlay click");
    if(!this.isMouseDownWithinForm){
      this.shouldRenderForm=false;
    }
  }

  mouseDownForm(event: MouseEvent){
    event.stopPropagation();
    this.isMouseDownWithinForm = true;
    console.log('mousedownform');
    this.isMouseDownWithinOverlay = false;
  }
  mouseUpForm(){

  }
  mouseDownOverlay(){
    this.isMouseDownWithinForm=false;
  }
  mouseUpOverlay(){

    console.log(this.isMouseDownWithinForm);
  }
  onMenuButtonClick(event: MouseEvent){
    event.preventDefault();  // Sprečava akciju linka
    event.stopPropagation(); // Sprečava širenje događaja na roditelja

  }
}

