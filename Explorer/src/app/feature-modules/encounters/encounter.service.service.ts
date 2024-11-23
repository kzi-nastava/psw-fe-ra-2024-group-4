import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Encounter } from './model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class EncounterServiceService {

  constructor(private http:HttpClient) { }
}
