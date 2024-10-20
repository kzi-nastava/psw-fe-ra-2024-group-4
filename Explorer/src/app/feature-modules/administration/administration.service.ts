import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { AppReview } from './model/appreview.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Member } from './model/member.model';
import { ClubInvitation } from './model/club-invitation.model';
import { Club } from './model/club.model';
import { Account } from './model/account.model';


@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }


  getMembers(clubId: number): Observable<Member[]> {
    
    return this.http.get<Member[]>(`https://localhost:44333/api/club/active-users/${clubId}`);

  }
  getMembersForInvite(clubId: number): Observable<Member[]> {
   
   return this.http.get<Member[]>(`https://localhost:44333/api/club/${clubId}/eligible-users`);

  }
  sendClubInvitation(invitation: ClubInvitation): Observable<void> {
    return this.http.post<void>(`https://localhost:44333/api/clubInvitation`, invitation);
  }
  getNextClubInvitationId(): Observable<number> {
    
    return this.http.get<number>(`https://localhost:44333/api/clubInvitation/next-id`);
  }
  getInvitationsByClubId(clubId: number): Observable<ClubInvitation[]> {
    return this.http.get<ClubInvitation[]>(`https://localhost:44333/api/clubInvitation/club/${clubId}/invitations`);
  }
  getClubById(clubId: number): Observable<Club> {
    return this.http.get<Club>(`https://localhost:44333/api/club/${clubId}`);
  }
  deleteMember(memberId: number, clubId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:44333/api/club/member/${memberId}/${clubId}/${userId}`);
  }


  getAllClubs():Observable<PagedResults<Club>>{
    return this.http.get<PagedResults<Club>>('https://localhost:44333/api/club');
  }

  addClub(club:Club):Observable<Club>{
    return this.http.post<Club>(environment.apiHost+'club',club)
  }
  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(environment.apiHost + 'club/' + club.id, club);
  }


  getAccount(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>(environment.apiHost + 'administration/account')
  }

  blockAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(environment.apiHost + 'administration/account/block',account);
  } 
  getAppReviews(): Observable<PagedResults<AppReview>> {
    return this.http.get<PagedResults<AppReview>>(environment.apiHost + 'administration/appReview')
  }


}

