import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Student} from '../../models/student';
import {Competency} from '../../models/competency';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-competency-matrix',
// Update the template section in progress-chart.component.ts
  template: `
    <div class="container">
      <mat-card>
        <!-- View Mode Toggle -->
        <div class="mb-4">
          <mat-slide-toggle [formControl]="viewModeControl" class="mb-2">
            {{ viewModeControl.value ? 'Individual View' : 'General View' }}
          </mat-slide-toggle>
        </div>

        <!-- Filters -->
        <div class="flex gap-4">
          <ng-container *ngIf="viewModeControl.value">
            <mat-form-field class="w-1/3">
              <mat-label>Student</mat-label>
              <mat-select [formControl]="selectedStudentControl">
                <mat-option *ngFor="let student of students" [value]="student.id">
                  {{ student.name.first }} {{ student.name.last }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </ng-container>

          <mat-form-field [class]="viewModeControl.value ? 'w-1/3' : 'w-1/2'">
            <mat-label>Categories</mat-label>
            <mat-select [formControl]="categoriesControl" multiple>
              <mat-option *ngFor="let category of availableCategories" [value]="category">
                {{ category }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field [class]="viewModeControl.value ? 'w-1/3' : 'w-1/2'">
            <mat-label>Phases</mat-label>
            <mat-select [formControl]="phasesControl" multiple>
              <mat-option *ngFor="let phase of availablePhases" [value]="phase">
                {{ phase }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Matrix Table -->
        <div class="table-container">
          <!-- General View -->
          <table mat-table [dataSource]="tableData" class="w-full" *ngIf="!viewModeControl.value">
            <!-- Student Name Column -->
            <ng-container matColumnDef="student">
              <th mat-header-cell *matHeaderCellDef>Student</th>
              <td mat-cell *matCellDef="let student">
                {{ student.name.first }} {{ student.name.last }}
              </td>
            </ng-container>

            <!-- Dynamic Competency Columns -->
            <ng-container *ngFor="let comp of filteredCompetencies" [matColumnDef]="comp.id">
              <th mat-header-cell *matHeaderCellDef>
                <div class="header-content">
                  <div class="font-bold">{{ comp.description }}</div>
                </div>
              </th>
              <td mat-cell *matCellDef="let student">
                <!-- Edit mode -->
                <mat-form-field class="grade-input">
                  <input matInput
                         type="number"
                         min="0"
                         max="100"
                         [value]="getGrade(student, comp)"
                         (change)="updateGrade($event, student, comp)">
                </mat-form-field>

              </td>
            </ng-container>


            <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <!-- Individual View -->
          <table mat-table [dataSource]="filteredCompetencies" class="w-full" *ngIf="viewModeControl.value">
            <!-- Competency Name Column -->
            <ng-container matColumnDef="competency">
              <th mat-header-cell *matHeaderCellDef>Competency</th>
              <td mat-cell *matCellDef="let competency">
                {{ competency.description }}
              </td>
            </ng-container>

            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let competency">
                {{ competency.category }}
              </td>
            </ng-container>

            <!-- Grade Column -->
            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Grade</th>
              <td mat-cell *matCellDef="let competency">
                <mat-form-field class="grade-input" *ngIf="editMode">
                  <input matInput
                         type="number"
                         min="0"
                         max="100"
                         [value]="getGradeForSelectedStudent(competency)"
                         (change)="updateGradeForSelectedStudent($event, competency)">
                  <button mat-icon-button (click)="editMode = false">
                    <mat-icon>edit</mat-icon>
                  </button>
                </mat-form-field>
                <!-- Display mode -->
                <ng-container *ngIf="!editMode">
                  <span class="grade-status" [ngClass]="{
                    'non-evalue': getGradeForSelectedStudent(competency) === 0,
                    'atteind': getGradeForSelectedStudent(competency) === 100,
                    'non-atteind': getGradeForSelectedStudent(competency) > 0 && getGradeForSelectedStudent(competency) <= 60,
                    'partiellement': getGradeForSelectedStudent(competency) > 60 && getGradeForSelectedStudent(competency) < 100
                  }">
                    {{ getGradeDisplayText(getGradeForSelectedStudent(competency)) }}
                  </span>
                  <button mat-icon-button (click)="editMode = true">
                    <mat-icon>edit</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="individualDisplayedColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: individualDisplayedColumns;"></tr>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  editMode = false;

  students: Student[] = [];
  competencies: Competency[] = [];
  filteredCompetencies: Competency[] = [];
  tableData: Student[] = [];

  availableCategories: string[] = [];
  availablePhases: string[] = [];

  displayedColumns: string[] = ['student'];
  individualDisplayedColumns: string[] = ['competency', 'category', 'grade'];

  viewModeControl = new FormControl(false, {nonNullable: true});
  selectedStudentControl = new FormControl('', {nonNullable: true});
  categoriesControl = new FormControl<string[]>([], {nonNullable: true});
  phasesControl = new FormControl<string[]>([], {nonNullable: true});

  filters: FormGroup<{
    categories: FormControl<string[]>;
    phases: FormControl<string[]>;
  }>;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.filters = this.fb.group<{
      categories: FormControl<string[]>;
      phases: FormControl<string[]>;
    }>({
      categories: this.categoriesControl,
      phases: this.phasesControl
    });
  }

  ngOnInit() {
    this.loadData();

    // Subscribe to filter changes
    this.filters.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateFilteredCompetencies();
      });

    // Subscribe to view mode changes
    this.viewModeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isIndividual) => {
        if (isIndividual && this.students.length > 0) {
          this.selectedStudentControl.setValue(this.students[0].id);
        }
        this.updateFilteredCompetencies();
      });

    // Subscribe to selected student changes
    this.selectedStudentControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateFilteredCompetencies();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    // Load students and competencies from local storage
    this.students = this.localStorageService.getItem('students') || [];
    this.competencies = this.localStorageService.getItem('competencies') || [];

    // Extract unique categories and phases
    this.availableCategories = [...new Set(this.competencies.map(c => c.category))];
    this.availablePhases = [...new Set(this.competencies.flatMap(c => c.phases))];

    // Set initial selected student if in individual mode
    if (this.viewModeControl.value && this.students.length > 0) {
      this.selectedStudentControl.setValue(this.students[0].id);
    }

    this.updateFilteredCompetencies();
  }

  private updateFilteredCompetencies() {
    const selectedCategories = this.filters.get('categories')?.value || [];
    const selectedPhases = this.filters.get('phases')?.value || [];

    this.filteredCompetencies = this.competencies.filter(comp => {
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(comp.category);
      const matchesPhase = selectedPhases.length === 0 ||
        comp.phases.some(phase => selectedPhases.includes(phase));

      return matchesCategory && matchesPhase;
    });

    // Update displayed columns for general view
    this.displayedColumns = ['student', ...this.filteredCompetencies.map(c => c.id)];

    // Update table data
    this.tableData = this.viewModeControl.value ? [] : this.students;
  }

  getGrade(student: Student, competency: Competency): number {
    const note = student.notes?.find(n => n.competency_id === competency.id);
    return note?.value || 0;
  }

  getGradeForSelectedStudent(competency: Competency): number {
    const selectedStudent = this.students.find(s => s.id === this.selectedStudentControl.value);
    return selectedStudent ? this.getGrade(selectedStudent, competency) : 0;
  }

  updateGrade(event: Event, student: Student, competency: Competency) {
    const value = Number((event.target as HTMLInputElement).value);
    this.saveGrade(student.id, competency, value);
  }

  updateGradeForSelectedStudent(event: Event, competency: Competency) {
    const value = Number((event.target as HTMLInputElement).value);
    this.saveGrade(this.selectedStudentControl.value, competency, value);
    this.editMode = false;
  }

  private saveGrade(studentId: string, competency: Competency, value: number) {
    if (isNaN(value) || value < 0 || value > 100) {
      return;
    }

    // Find student index
    const studentIndex = this.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;

    // Create a copy of the students array and the target student
    const updatedStudents = [...this.students];
    const updatedStudent = {...updatedStudents[studentIndex]};

    // Initialize notes array if it doesn't exist
    if (!updatedStudent.notes) {
      updatedStudent.notes = [];
    }

    // Find existing note or create new one
    const noteIndex = updatedStudent.notes.findIndex(n => n.competency_id === competency.id);
    const now = new Date();

    if (noteIndex === -1) {
      // Create new note
      updatedStudent.notes.push({
        id: crypto.randomUUID(),
        competency_id: competency.id,
        value: value,
        created_at: now,
        updated_at: now
      });
    } else {
      // Update existing note
      updatedStudent.notes[noteIndex] = {
        ...updatedStudent.notes[noteIndex],
        value: value,
        updated_at: now
      };
    }

    // Update the students array
    updatedStudents[studentIndex] = updatedStudent;
    this.students = updatedStudents;
    this.tableData = this.students;

    // Save to local storage
    this.localStorageService.setItem('students', updatedStudents);
  }

  getGradeDisplayText(value: number): string {
    if (value === 0) return 'Non évalué';
    if (value === 100) return 'Atteind';
    if (value <= 60) return 'Non Atteinds';
    return 'Partiellement Atteinds';
  }
}
