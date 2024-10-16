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
}
