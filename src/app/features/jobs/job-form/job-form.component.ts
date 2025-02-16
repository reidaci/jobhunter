
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css'
})
export class JobFormComponent {
  title: string = ''
  job!: any;

  selectedFileName: string | null = null;
  selectedFileSizeInBytes!: number;
  selectedFileFinalSize!: number;
  kbFile!: boolean;

  selectedCVName: string | null = null;
  selectedCVSizeInBytes!: number;
  selectedCVFinalSize!: number;
  kbCV!: boolean;

  applicationForm: FormGroup = new FormGroup('');
  savedEducations: any[] = [];
  savedxperience: any[] = [];
  minDateEdcList: Date[] = [];
  minDateExpList: Date[] = [];
  formData: FormData = new FormData();
  success: boolean = false;
  errorCustom: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.title = this.route.snapshot.params['name'] as string;
  }

  ngOnInit() {
    this.applicationForm = this.formBuilder.group({
      // id: [null],
      personalDetail: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        residenza: [null],
        phone: [null, [Validators.required, Validators.pattern('[0-9+]+')],],
      }),
      education: this.formBuilder.array([]),
      experience: this.formBuilder.array([]),
      cvFile: [null, Validators.required],
      message: [null],
      extraFile: [null],
      job: this.job,
      dataInserimento: new Date(),
    });
  }

  get f() { return this.applicationForm.controls; }

  get educationForms() {
    return (this.applicationForm.get('education') as FormArray).controls;
  }

  get experienceForms() {
    return (this.applicationForm.get('experience') as FormArray).controls;
  }

  addEducationGroup() {
    const educationGroup = this.formBuilder.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      fromEdc: ['', Validators.required],
      toEdc: [''],
      attendanceEdc: [false]
    });

    (this.applicationForm.get('education') as FormArray).push(educationGroup);
    /*  this.savedEducations = [...this.applicationForm.get('education')?.value]
     console.log("onAddEducation: "  , this.applicationForm.get('education')?.value);
     console.log("onAddEducation: "  , this.savedEducations); */
  }

  removeEducationGroup(index: number) {
    (this.applicationForm.get('education') as FormArray).removeAt(index);
    this.minDateEdcList.splice(index, 1);
  }

  addExperienceGroup() {
    const experienceGroup = this.formBuilder.group({
      title: ['', Validators.required],
      companyLocation: [''],
      company: ['', Validators.required],
      description: [''],
      fromExp: ['', Validators.required],
      toExp: [''],
      attendanceExp: [false]
    });
    (this.applicationForm.get('experience') as FormArray).push(experienceGroup);
  }

  removeExperienceGroup(index: number) {
    (this.applicationForm.get('experience') as FormArray).removeAt(index);
    this.minDateExpList.splice(index, 1);
  }

  attendEducation(event: any, index: number) {
    const toEdcControl = this.educationForms[index].get('toEdc');

    if (event.target.checked) {
      toEdcControl?.setValue('');
      toEdcControl?.disable();
    } else {
      toEdcControl?.enable();
    }
  }

  attendExp(event: any, index: number) {
    const toExpControl = this.experienceForms[index].get('toExp');

    if (event.target.checked) {
      toExpControl?.setValue('');
      toExpControl?.disable();
    } else {
      toExpControl?.enable();
    }
  }

  onDalEdcChange(e: any, idx: number): void {
    this.minDateEdcList[idx] = this.educationForms[idx].get('fromEdc')?.value;
   
  }

  onDalExpChange(e: any, idx: number): void {
    this.minDateExpList[idx] = this.experienceForms[idx].get('fromExp')?.value;
    // console.log(this.minDateExpList)
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFileName = file.name;


    
      this.selectedFileSizeInBytes = file.size;
      let selectedFileSize = file.size / 1024; 
      this.kbFile = true;
      if (selectedFileSize > 1000) {
        this.kbFile = false;
        selectedFileSize = selectedFileSize / 1024; 
      }
      this.selectedFileFinalSize = selectedFileSize;


      //this.applicationForm.get('extraFile')?.setValue(file); ??
      this.formData.append('extra', file, this.selectedFileName);
    }
    else {
      this.selectedFileName = null;
    }
  }

  onCvSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedCVName = file.name;


     
      this.selectedCVSizeInBytes = file.size;
      let selectedCVSize = file.size / 1024; 
      this.kbCV = true;
      if (selectedCVSize > 1000) {
        this.kbCV = false;
        selectedCVSize = selectedCVSize / 1024; 
      }
      this.selectedCVFinalSize = selectedCVSize;


     
      this.formData.append('cv', file, this.selectedCVName);
    }
    else {
      this.selectedCVName = null;
    }

  }

  onSubmit() {

    if (this.applicationForm.invalid) { return; }
    else {
      /* //format data inserimento
      const formattedDate = this.datePipe.transform(this.applicationForm.value.dataInserimento, 'dd/MM/yyyy');
      this.applicationForm.patchValue({
        dataInserimento: formattedDate
      });

      // application Content-Type
      const applicationJson = JSON.stringify(this.applicationForm.getRawValue());
      this.formData.append('application', new Blob([applicationJson], { type: 'application/json' }));

      this.appService.postApplicationWithAttachments(this.formData).subscribe(() => {
        //console.log('onSubmit', this.applicationForm.getRawValue());
        this.success = true;
        this.applicationForm.reset();
        this.selectedCVName = null;
        this.selectedFileName = null;
      },
        (error: Error) => { //error.error.status === 400
          console.log('onError', error);
          this.errorCustom = true;
        }).add(() => {
          setTimeout(() => {
            this.success = false;
            this.errorCustom = false;
          }, 3000);
        })*/
    }
  }

  redirectBtn() {
    this.router.navigate(['/jobs'])
  }



}
