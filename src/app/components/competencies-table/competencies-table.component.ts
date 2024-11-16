import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, takeUntil} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {LocalStorageService} from '../../services/local-storage.service';
import {Competency} from '../../models/competency';
import {ImportExportService} from '../../services/import-export.service';

@Component({
  selector: 'app-competencies-table',
  templateUrl: './competencies-table.component.html',
  styleUrls: ['./competencies-table.component.scss'],
  standalone: false
})
export class CompetenciesTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  dialogData: { isNew: boolean; competency?: Competency } = {isNew: true};
  displayedColumns: string[] = ['name', 'description', 'category', 'phase', 'actions'];
  dataSource: MatTableDataSource<Competency>;
  competencyForm: FormGroup;

  // For category autocomplete
  filteredCategories: Observable<string[]>;

  allPhases: string[] = [];
  allCategories: string[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _localStorageService: LocalStorageService,
    private _importExportService: ImportExportService
  ) {
    this.dataSource = new MatTableDataSource<Competency>([]);
    this.competencyForm = this.createCompetencyForm();

    this.filteredCategories = this.competencyForm.get('category')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCategories(value || ''))
    );
  }

  ngOnInit() {
    this.loadCompetencies();
    this.updateAvailableOptions();
    // Subscribe to reload trigger
    this._importExportService.reloadData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCompetencies();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get phasesFormArray() {
    return this.competencyForm.get('phases') as FormArray;
  }

  private createCompetencyForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      phases: this.fb.array([
        this.createPhaseControl()
      ])
    });
  }

  private createPhaseControl() {
    return this.fb.group({
      phase: ['', Validators.required]
    });
  }

  getFilteredPhases(index: number): Observable<string[]> {
    return this.phasesFormArray.at(index).get('phase')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPhases(value || '', index))
    );
  }

  private _filterPhases(value: string, currentIndex: number): string[] {
    const filterValue = value.toLowerCase();

    // Get currently selected phases excluding the current input
    const selectedPhases = this.phasesFormArray.controls
      .map((control, index) => index !== currentIndex ? control.get('phase')?.value : null)
      .filter(phase => phase !== null && phase !== '');

    // Filter phases that aren't already selected
    return this.allPhases.filter(phase =>
      phase.toLowerCase().includes(filterValue) &&
      !selectedPhases.includes(phase)
    );
  }

  addPhase() {
    this.phasesFormArray.push(this.createPhaseControl());
  }

  removePhase(index: number) {
    this.phasesFormArray.removeAt(index);
  }

  private updateAvailableOptions() {
    // Get unique categories from existing competencies
    const existingCategories = new Set(this.dataSource.data.map(comp => comp.category));
    this.allCategories = Array.from(existingCategories);

    // Get unique phases from existing competencies
    const existingPhases = new Set(this.dataSource.data.flatMap(comp => comp.phases));
    this.allPhases = Array.from(existingPhases);
  }

  private _filterCategories(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCategories.filter(category =>
      category.toLowerCase().includes(filterValue)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    this.competencyForm.reset();
    // Reset phases FormArray to have one empty phase
    while (this.phasesFormArray.length > 0) {
      this.phasesFormArray.removeAt(0);
    }
    this.phasesFormArray.push(this.createPhaseControl());

    this.dialogData = {isNew: true};
    this.dialog.open(this.editDialog, {
      width: '500px'
    });
  }

  editCompetency(competency: Competency) {
    // Reset form and phases
    while (this.phasesFormArray.length > 0) {
      this.phasesFormArray.removeAt(0);
    }

    // Add form controls for each existing phase
    competency.phases.forEach(phase => {
      this.phasesFormArray.push(this.fb.group({
        phase: [phase, Validators.required]
      }));
    });

    this.competencyForm.patchValue({
      name: competency.name,
      description: competency.description,
      category: competency.category
    });

    this.dialogData = {isNew: false, competency};
    this.dialog.open(this.editDialog, {
      width: '500px'
    });
  }

  saveCompetency() {
    if (this.competencyForm.valid) {
      const formValue = this.competencyForm.value;
      const uuid = this.dialogData.isNew ?
        crypto.randomUUID() :
        this.dialogData.competency!.id;

      const competencyData: Competency = {
        id: uuid,
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        phases: formValue.phases.map((p: any) => p.phase)
      };

      if (this.dialogData.isNew) {
        this.dataSource.data = [...this.dataSource.data, competencyData];
      } else {
        const index = this.dataSource.data.findIndex(c => c.id === uuid);
        if (index !== -1) {
          const updatedData = [...this.dataSource.data];
          updatedData[index] = competencyData;
          this.dataSource.data = updatedData;
        }
      }

      this._localStorageService.setItem('competencies', this.dataSource.data);
      this.updateAvailableOptions();
      this.dialog.closeAll();
    }
  }

  deleteCompetency(competency: Competency) {
    const index = this.dataSource.data.findIndex(c => c.id === competency.id);
    if (index !== -1) {
      const updatedData = [...this.dataSource.data];
      updatedData.splice(index, 1);
      this.dataSource.data = updatedData;
      this._localStorageService.setItem('competencies', this.dataSource.data);
      this.updateAvailableOptions();
    }
  }

  private loadCompetencies() {
    this.dataSource.data = this._localStorageService.getItem('competencies') || [];
    this.updateAvailableOptions();
  }
}
