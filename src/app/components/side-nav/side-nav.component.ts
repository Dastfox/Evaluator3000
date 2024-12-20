import {Component, ElementRef, HostListener} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ImportExportService} from '../../services/import-export.service';
import {MatSelectChange} from '@angular/material/select';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('hidden', style({
        transform: 'translateX(-200px)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('hidden => visible', animate('200ms ease-in')),
      transition('visible => hidden', animate('200ms ease-out'))
    ])
  ]
})
export class SideNavComponent {
  isMenuVisible = false;
  isMenuPinned = false;
  selectedLanguage = 'en';
  languages = [
    {value: 'en', label: 'English'},
    {value: 'fr', label: 'Français'}
  ];
  private hideTimeout: any;

  constructor(
    private _localStorageService: LocalStorageService,
    private _importExportService: ImportExportService,
    private elementRef: ElementRef
  ) {

    this.selectedLanguage = this._localStorageService.getItem('language') || 'fr';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && (this.isMenuVisible || this.isMenuPinned)) {
      this.isMenuVisible = false;
      this.isMenuPinned = false;
      clearTimeout(this.hideTimeout);
    }
  }

  onExport() {
    this._importExportService.exportData();
  }

  onImport() {
    this.openFileInput();
  }

  openFileInput(): void {
    const fileInput = this.elementRef.nativeElement.querySelector('input[type="file"]');
    fileInput.click();

  }

onJsonFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    this._importExportService.importDataFromFile(file);
  }
}

  onMenuEnter() {
    clearTimeout(this.hideTimeout);
    if (!this.isMenuPinned) {
      this.isMenuVisible = true;
    }
  }

  onMenuLeave() {
    if (!this.isMenuPinned) {
      this.hideTimeout = setTimeout(() => {
        this.isMenuVisible = false;
      }, 300);
    }
  }

  toggleMenu() {
    this.isMenuPinned = !this.isMenuPinned;
    this.isMenuVisible = this.isMenuPinned;
  }

  onLanguageChange(event: MatSelectChange) {
    this._localStorageService.setItem('language', event.value);
    this.selectedLanguage = event.value;
  }
}
