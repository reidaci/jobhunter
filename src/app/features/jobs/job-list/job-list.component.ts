import { Component } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { JobsService } from '../../../core/services/jobs.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterLink],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent {

  jobList: Job[] = [];

  totalItems = 0; 
  pageSize = 10; 
  currentPage = 1; 

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: JobsService,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.currentPage = +params['current_page'] || 1;
      this.getList();
    });
  }

  getList() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        const response = data['jobs'];
        this.jobList = response.data;
        this.currentPage = response.current_page;
        this.totalItems = response.total;
        //  console.log(this.totalItems)
      },
    });
  }

  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex + 1; 

    this.router.navigate([], {
      queryParams: { current_page: pageIndex },
      queryParamsHandling: 'merge',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
