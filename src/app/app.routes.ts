import { Routes } from '@angular/router';
import { JobListComponent } from './features/jobs/job-list/job-list.component';
import { jobsResolver } from './core/resolvers/jobs.resolver';
import { JobFormComponent } from './features/jobs/job-form/job-form.component';

export const routes: Routes = [{
    path: '', redirectTo: 'jobs', pathMatch: 'full',
},
{
    path: 'jobs', 

    children: [
        { path: '', component: JobListComponent, resolve: { jobs: jobsResolver } }, 
        {
            path: 'job-application/:name', component: JobFormComponent
        }
    ]
}];
