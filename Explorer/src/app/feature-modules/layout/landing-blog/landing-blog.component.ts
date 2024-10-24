import { Component, OnInit } from '@angular/core';
import { Post, BlogStatus } from '../../blog/model/post.model';
import { CommentService } from '../../blog/comment.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-landing-blog',
  templateUrl: './landing-blog.component.html',
  styleUrls: ['./landing-blog.component.css']
})
export class LandingBlogComponent implements OnInit {

  
  genericImage: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl6raU10dijlmB2SobtTOlXvlwOe55tE0LjQ&s"
  blogs: Post[] = [];
  mainBlog: Post | undefined;
  user: User | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  /*
  constructor( private service: CommentService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }
    */

  ngOnInit(): void {
    this.getBlogs();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getBlogs(): void {
    /*
    this.service.getPosts().subscribe({
      next: (result: PagedResults<Post>) => {
        this.blogs = result.results.slice(0, 20);
        this.blogs.forEach(b => {
          b.imageUrl = b.imageUrl != undefined ? b.imageUrl : this.genericImage
        })
        if (this.blogs.length > 0) {
          this.mainBlog = this.blogs[0];
        }
      },
      error: (err: any) => {
        alert(1);
        console.log(err);
      }
    });
    */
   try{
    for(let i = 0; i < 20; i++) {
      const blog: Post = {
        id: i + 1,
        title: `Title ${i + 1}`,
        description: `Description for blog post ${i + 1}`,
        createdAt: new Date(),
        imageUrl: this.genericImage,
        status: BlogStatus.Published,  // Assuming Published status
        userId: 1,
        imageBase64:''
      };
      
      this.blogs.push(blog);
     }
  
     if (this.blogs.length > 0) {
        this.mainBlog = this.blogs[0];
        this.blogs.shift();
        this.mainBlog.imageUrl = "https://cdn.shopify.com/s/files/1/1083/2612/files/cr2_480x480.png?v=1721726734";
      }

   }catch{
    alert("Error");
   }
  }
}
