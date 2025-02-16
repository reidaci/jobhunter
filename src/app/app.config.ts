import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { JobsService } from './core/services/jobs.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), JobsService, { provide: 'paginatedJobsUrl', useValue: environment.paginatedJobsUrl }, provideAnimationsAsync()]
};
