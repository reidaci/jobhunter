import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient, @Inject('paginatedJobsUrl') private url: string,) { }


  getAllJobs(page: number): Observable<any> {
    let params = new HttpParams()
      .set('current_page', page || 1)
    return this.http.get<any>(this.url, { params });
  }
}
