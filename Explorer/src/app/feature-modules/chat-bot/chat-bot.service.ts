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
    //question = "tours";
  //  alert(environment.apiHost + 'chatbot/message/' + userId + '?message=' + encodeURIComponent(question));
    return this.http.get<string>(
      environment.apiHost + 'chatbot/message/' + userId + '?message=' + encodeURIComponent(question));
  }
}
