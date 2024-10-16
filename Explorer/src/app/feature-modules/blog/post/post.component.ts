import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Post } from '../model/post.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  posts: Post[]=[];
  shouldRenderForm: boolean =false;
  shouldEdit: boolean=false;

  constructor(private service: BlogService){}

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
}

