import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Post } from './model/post.model';
import { Comment } from './model/comment.model';
import { environment } from 'src/env/environment';
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getPosts() : Observable<PagedResults<Post>>{
     return this.http.get<PagedResults<Post>>(environment.apiHost+ 'postmanagement/post')
  }
  
  addPost(post: Post): Observable<Post>{
    return this.http.post<Post>(environment.apiHost+'postmanagement/post',post);
  }

  getComment(): Observable<PagedResults<Comment>>{
    return this.http.get<PagedResults<Comment>>('https://localhost:44333/api/comments/comment');
   }

   addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>('https://localhost:44333/api/comments/comment',comment);
   }
}
