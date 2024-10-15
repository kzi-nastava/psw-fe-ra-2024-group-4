import { Component, OnInit } from '@angular/core';
import { Comment } from '../model/comment.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comment: Comment[] = [];
  constructor(private service: BlogService ){}

  ngOnInit(): void {
    this.service.getComment().subscribe({
      next: (result: PagedResults<Comment>) => {
        //console.log(result);
       this.comment = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  //comment: Comment[] = [{id:0, text: "tekst"}, {id:1, text: "tekst2"}]
}
