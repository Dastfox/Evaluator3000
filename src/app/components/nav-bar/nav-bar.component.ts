// nav.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  template: `
    <mat-toolbar color="primary" class="nav-toolbar">
      <mat-toolbar-row>
        <!-- App Title -->
        <span>Student Management</span>

        <!-- Navigation Links -->
        <span class="nav-spacer"></span>

        <nav>
          <a mat-button routerLink="/students" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            Students
          </a>

          <a mat-button routerLink="/progress-chart" routerLinkActive="active">
            <mat-icon>trending_up</mat-icon>
            Progress Chart
          </a>

          <a mat-button routerLink="/individual-chart" routerLinkActive="active">
            <mat-icon>person</mat-icon>
            Individual Chart
          </a>

          <a mat-button routerLink="/edit-competencies" routerLinkActive="active">
            <mat-icon>edit</mat-icon>
            Edit Competencies
          </a>
        </nav>

        <!-- Action Buttons -->
        <span class="button-spacer"></span>

        <button mat-raised-button color="accent" (click)="onExport()">
          <mat-icon>upload</mat-icon>
          Export
        </button>

        <button mat-raised-button color="accent" (click)="onImport()">
          <mat-icon>download</mat-icon>
          Import
        </button>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [`
    .nav-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .nav-spacer {
      flex: 1 1 auto;
    }

    .button-spacer {
      margin: 0 8px;
    }

    nav {
      display: flex;
      align-items: center;
    }

    .active {
      background: rgba(255, 255, 255, 0.1);
    }

    button {
      margin-left: 8px;
    }

    mat-icon {
      margin-right: 4px;
    }
  `]
})
export class NavComponent {
  onExport() {
    // Implement export logic
    console.log('Export clicked');
  }

  onImport() {
    // Implement import logic
    console.log('Import clicked');
  }
}
