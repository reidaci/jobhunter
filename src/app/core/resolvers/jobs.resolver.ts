import { ResolveFn } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const jobsResolver: ResolveFn<any> = (route, state) => {
  const jobsService = inject(JobsService);

  const page = Number(route.queryParamMap.get('current_page')) || 1

  return jobsService.getAllJobs(page).pipe(
    catchError((error) => {
      return of([]);
    })
  );
};
