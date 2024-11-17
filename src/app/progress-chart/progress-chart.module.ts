import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressChartComponent} from '../components/progress-chart/progress-chart.component';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableModule
} from '@angular/material/table';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatSlideToggle, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCard} from '@angular/material/card';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';


@NgModule({
  declarations: [ProgressChartComponent],
  imports: [
    CommonModule,
    MatFormField,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatInput,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatSlideToggleModule,
    MatCard,
    MatIconButton,
    MatIcon,
  ],
  exports: [
    ProgressChartComponent
  ]
})
export class ProgressChartModule {
}
