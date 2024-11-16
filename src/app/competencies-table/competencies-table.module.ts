import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CompetenciesTableComponent } from '../components/competencies-table/competencies-table.component';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatChip, MatChipGrid, MatChipInput, MatChipListbox, MatChipRow} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [CompetenciesTableComponent],
  imports: [
    MatSelectModule,
    MatSlideToggleModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatOption,
    MatChip,
    MatChipListbox,
    MatChipGrid,
    MatChipRow,
    MatChipInput,
    MatTableModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule
  ],
  exports: [CompetenciesTableComponent]
})
export class CompetenciesTableModule { }
