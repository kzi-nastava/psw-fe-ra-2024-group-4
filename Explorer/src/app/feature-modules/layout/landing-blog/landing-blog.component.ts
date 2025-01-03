import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Post, BlogStatus } from '../../blog/model/post.model';
import { CommentService } from '../../blog/comment.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { AppReviewComponent } from '../app-review/app-review.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TourTags } from '../../tour-authoring/create-tour/create-tour.component';
import { TourOverview } from '../../tour-authoring/model/touroverview.model';
import { TourOverviewService } from '../../tour-authoring/tour-overview.service';
import { LayoutService } from '../layout.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-landing-blog',
  templateUrl: './landing-blog.component.html',
  styleUrls: ['./landing-blog.component.css']
})
export class LandingBlogComponent implements OnInit, AfterViewInit {

  
  genericImage: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl6raU10dijlmB2SobtTOlXvlwOe55tE0LjQ&s"
  blogs: Post[] = [];
  mainBlog: Post;
  tours: TourOverview[] = [];
  mainTour: TourOverview;
  user: User;

  tourTagMap: { [key: number]: string } = {
    0: 'Cycling',
    1: 'Culture',
    2: 'Adventure',
    3: 'FamilyFriendly',
    4: 'Nature',
    5: 'CityTour',
    6: 'Historical',
    7: 'Relaxation',
    8: 'Wildlife',
    9: 'NightTour',
    10: 'Beach',
    11: 'Mountains',
    12: 'Photography',
    13: 'Guided',
    14: 'SelfGuided'
  };

  constructor(private authService: AuthService, private router: Router, private el: ElementRef, private renderer: Renderer2, private service: LayoutService) {}

  /*
  constructor( private service: CommentService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }
    */

  ngAfterViewInit() {
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Dodaj klasu "show" kad je element vidljiv
          this.renderer.addClass(entry.target, 'show');
          observer.unobserve(entry.target); // Opcionalno: prestani da posmatraš element
        }
      });
    });

    // Pronađi sve kartice u DOM-u
    const cardContainers = this.el.nativeElement.querySelectorAll('.card-container');
    cardContainers.forEach((card: HTMLElement) => {
      observer.observe(card);
    });
  }

  ngOnInit(): void {
    this.getTours();
    this.getBlogs();

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getTours(): void {
      this.service.getAllWithoutReviews().subscribe({
        next: (data: PagedResults<TourOverview>) => {
          console.log('Tours loaded:', data);
          this.tours = data.results;
          this.mainTour = this.tours[0];
          
        },
        error: (err) => {
          console.error('Error loading tours:', err);
        }
      });

  }


  

  getBlogs(): void {

    this.service.getPosts().subscribe({
      next: (result: PagedResults<Post>) => {
        this.blogs = result.results;
        this.blogs = this.blogs.filter(p => p.status!== 0);
        this.mainBlog = this.blogs[0];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  //  try{
  //   for(let i = 0; i < 20; i++) {
  //     const blog: Post = {
  //       id: i + 1,
  //       title: `Title ${i + 1}`,
  //       description: `Description for blog post ${i + 1}`,
  //       createdAt: new Date(),
  //       imageUrl: this.genericImage,
  //       status: BlogStatus.Published,  // Assuming Published status
  //       userId: 1,
  //       ratingSum: 0,
  //       imageBase64:'',
  //       comments: [],
  //       ratings:[]
  //     };
      
  //     this.blogs.push(blog);
  //    }
  
  //    if (this.blogs.length > 0) {
  //       this.mainBlog = this.blogs[0];
  //       this.blogs.shift();
  //       this.mainBlog.imageUrl = "https://cdn.shopify.com/s/files/1/1083/2612/files/cr2_480x480.png?v=1721726734";
  //     }

  //  }catch{
  //   Swal.fire('Error', 'Error.', 'error');
  //  }
  }

  getImage(imageUrl: string | undefined): string {
      return imageUrl ? environment.webroot + imageUrl : 'assets/images/placeholder.png'; // Provide a fallback image or empty string
  }





  getTagNumber(word: string): number { //daj broj od tada
    for (const [key, value] of Object.entries(this.tourTagMap)) {
      if (value === word) {
        return +key; // Convert the key back to a number
      }
    }
    return -1; // Return -1 or any default value if the word is not found
  }

  setMainTour(tour: TourOverview) {
    this.mainTour = tour;
  }
  setMainBlog(blog: Post) {
    this.mainBlog = blog;
  }

  openBrowseTours() {
    if (this.user?.id !== 0) { 
      if(this.user.role === 'author'){
        this.router.navigate(['author-tours']);
      } else {        
        this.router.navigate(['tour-overview']); 
      }
    } else {
      this.router.navigate(['login']); 
    }

  }

  openBlogs() {
    if (this.user?.id !== 0) {      
      this.router.navigate(['blogPost']); 
    } else {
      this.router.navigate(['login']); 
    }
  }
}
