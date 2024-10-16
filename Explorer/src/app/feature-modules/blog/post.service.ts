import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Post } from './model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPosts() : Observable<PagedResults<Post>>{
     return this.http.get<PagedResults<Post>>(environment.apiHost+ 'postmanagement/post')
  }
  addPost(post: Post): Observable<Post>{
   return this.http.post<Post>(environment.apiHost+'postmanagement/post',post);
 }
  updatePost(post:Post):Observable<Post>{
  return this.http.put<Post>(environment.apiHost+'postmanagement/post/'+post.id,post)
 }
  deletePost(id: number):Observable<Post>{
    return this.http.delete<Post>(environment.apiHost+ 'postmanagement/post/'+id)
  }
}
