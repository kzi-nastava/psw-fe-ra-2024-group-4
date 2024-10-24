import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Post } from './model/post.model';
import { Comment } from './model/comment.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }
  
   addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>('https://localhost:44333/api/comments/comment',comment);
   }

   updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>('https://localhost:44333/api/comments/comment/'+ comment.id,comment);
   }
    deleteComment(comment: Comment): Observable<Comment>{
      return this.http.delete<Comment>('https://localhost:44333/api/comments/comment/'+ comment.id);
    }
    getCommentByPost(postId: number,page: number = 0, pageSize: number = 0): Observable<PagedResults<Comment>> {
      return this.http.get<PagedResults<Comment>>(`https://localhost:44333/api/comments/comment?id=${postId}&page=${page}&pageSize=${pageSize}`);
    }
  
   getPosts():Observable<PagedResults<Post>>{
    return this.http.get<PagedResults<Post>>(`https://localhost:44333/api/comments/comment/posts/`);
   }
}
