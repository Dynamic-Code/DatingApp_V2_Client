import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return this.getPaginatedResults<Member[]>(this.baseUrl + 'AppUsers', params);
  }

  
  getMember(username: string) {
    const member = this.members.find(x => x.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'AppUsers/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'AppUsers', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'AppUsers/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'AppUsers/delete-photo/' + photoId);
  }


  private getPaginatedResults<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(res => {
        paginatedResult.results = res.body;
        if (res.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(res.headers.get('Pagination'));
        }
        return paginatedResult;
      })

    );
  }

  private getPaginationHeaders(pageNumer: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumer.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }

}
