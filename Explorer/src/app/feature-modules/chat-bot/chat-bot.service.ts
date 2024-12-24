import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { HttpHeaders } from '@angular/common/http';
import { Message } from './model/Message.model';
@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  constructor(private http: HttpClient) { }

  getResponse(question:string, userId: number): Observable<any>
  {
   
    return this.http.get<string>(
      environment.apiHost + 'chatbot/message/' + userId + '?message=' + encodeURIComponent(question));
  }

  getQuestions(tag:string): Observable<any>
  {
   
    return this.http.get<string[]>(
      environment.apiHost + 'chatbot/questions/?tag=' + encodeURIComponent(tag));
  }

  getSearchedQuestions(query:string): Observable<any>
  {
   
    return this.http.get<string[]>(
      environment.apiHost + 'chatbot/search/?query=' + encodeURIComponent(query));
  }
}
