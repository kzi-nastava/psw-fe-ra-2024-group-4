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
  
  
   getPosts():Observable<PagedResults<Post>>{
    return this.http.get<PagedResults<Post>>(`https://localhost:44333/api/blogfeedback/comment/posts/`);
   }
   
   getCommentByPost(postId: number,page: number = 0, pageSize: number = 0): Observable<PagedResults<Comment>>{
    return this.http.get<PagedResults<Comment>>(environment.apiHost+ `blogfeedback/comment?id=${postId}&page=${page}&pageSize=${pageSize}`);
  }
  addCommentToPost(postId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`https://localhost:44333/api/blogfeedback/comment/${postId}`, comment);
  }
  
  updateCommentInPost(postId: number, comment: Comment): Observable<Comment> {
    const url = `https://localhost:44333/api/blogfeedback/comment/${postId}`;
    return this.http.put<Comment>(url, comment);
  }
  
  deleteCommentFromPost(postId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:44333/api/blogfeedback/comment/${postId}/${commentId}`);
  }
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`https://localhost:44333/api/blogfeedback/comment/post/${id}`);
  }
  
}
