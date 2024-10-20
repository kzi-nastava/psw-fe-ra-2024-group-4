import { Component, OnInit } from '@angular/core';
import { Post } from '../../blog/model/post.model';
import { CommentService } from '../../blog/comment.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-landing-blog',
  templateUrl: './landing-blog.component.html',
  styleUrls: ['./landing-blog.component.css']
})
export class LandingBlogComponent implements OnInit {

  genericImage: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl6raU10dijlmB2SobtTOlXvlwOe55tE0LjQ&s"
  blogs: Post[];
  mainBlog: Post;
  user: User | undefined;

  constructor( private service: CommentService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(): void {
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
  }
}
