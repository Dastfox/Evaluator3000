// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentTableComponent } from './components/students-table/students-table.component';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'students', component: StudentTableComponent },
  // { path: 'progress-chart', component: ProgressChartComponent },
  // { path: 'individual-chart', component: IndividualChartComponent },
  // { path: 'edit-competencies', component: EditCompetenciesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
