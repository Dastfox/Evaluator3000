import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Student} from '../../models/student';
import {LocalStorageService} from '../../services/local-storage.service';
import {ImportExportService} from '../../services/import-export.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-student-list',
  templateUrl: "students-table.component.html",
  styleUrls: ["students-table.component.scss"]
})
export class StudentTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  dialogData: { isNew: boolean; student?: Student } = {isNew: true};

  displayedColumns: string[] = ['name', 'notesCount', 'latestActivity', 'actions'];
  dataSource: MatTableDataSource<Student>;
  studentForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _localStorageService: LocalStorageService,
    private _importExportService: ImportExportService
  ) {
    this.dataSource = new MatTableDataSource<Student>([]);

    // Add custom filterPredicate
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const searchStr = filter.toLowerCase();
      const fullName = `${data.name.first} ${data.name.last}`.toLowerCase();
      return fullName.includes(searchStr);
    };

    this.studentForm = this.createStudentForm();
  }

  ngOnInit() {
    // Initialize with sample data or fetch from service
    this.loadStudents();

    // Subscribe to reload trigger
    this._importExportService.reloadData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadStudents();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createStudentForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getLatestActivity(student: Student): Date | null {
    if (!student.notes || student.notes.length === 0) return null;

    return student.notes
      .map(note => note.updated_at)
      .reduce((latest, current) =>
        current > latest ? current : latest
      );
  }

  openAddDialog() {
    this.studentForm.reset();
    this.dialogData = {isNew: true};
    this.dialog.open(this.editDialog, {
      width: '500px'
    });
  }

  editStudent(student: Student) {
    this.studentForm.patchValue({
      firstName: student.name.first,
      lastName: student.name.last
    });

    this.dialogData = {isNew: false, student};
    this.dialog.open(this.editDialog, {
      width: '500px'
    });
  }

  saveStudent() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const uuid = this.dialogData.isNew ?
        crypto.randomUUID() : // Generate new UUID for new students
        this.dialogData.student!.id; // Use existing UUID for edits

      const studentData = {
        id: uuid,
        name: {
          first: formValue.firstName,
          last: formValue.lastName
        },
        notes: this.dialogData.student?.notes || []
      };

      if (this.dialogData.isNew) {
        // Implement create logic
        console.log('Creating student:', studentData);
        this.dataSource.data.push(studentData);
      } else {
        // Implement update logic
        const index = this.dataSource.data.findIndex(s => s.id === uuid);
        if (index !== -1) {
          this.dataSource.data[index] = studentData;
        }
        console.log('Updating student:', studentData);
      }

      // Save to local storage
      this._localStorageService.setItem('students', this.dataSource.data);
      this.dialog.closeAll();
      this.loadStudents(); // Reload the list
    }
  }

  deleteStudent(student: Student) {
    const index = this.dataSource.data.findIndex(s => s.id === student.id);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this._localStorageService.setItem('students', this.dataSource.data);
      this.loadStudents(); // Reload the list
    }
  }

  private loadStudents() {
    this.dataSource.data = this._localStorageService.getItem('students') || [];
  }
}
