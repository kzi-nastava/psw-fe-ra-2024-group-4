import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { BadgeDto } from '../model/badge.model';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private readonly baseUrl = `${environment.apiHost}/api/badges`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PagedResult<BadgeDto>> {
    return this.http.get<PagedResult<BadgeDto>>(this.baseUrl);
  }

  getAllNotRead(): Observable<PagedResult<BadgeDto>> {
    return this.http.get<PagedResult<BadgeDto>>(`${this.baseUrl}/getNotRead`);
  }

  readBadge(badgeId: number): Observable<BadgeDto> {
    return this.http.post<BadgeDto>(`${this.baseUrl}/read/${badgeId}`, {});
  }
}
