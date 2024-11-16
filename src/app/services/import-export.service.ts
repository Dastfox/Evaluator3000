import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  private reloadDataSubject = new Subject<void>();
  reloadData$ = this.reloadDataSubject.asObservable();

  constructor(private _localStorageService: LocalStorageService) {

  }

  public exportData(): void {
    console.log('Exporting data', this._localStorageService.getAllItems());
    const data = this._localStorageService.getAllItems();
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  public importDataFromFile(file: File): void {
    console.log(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e?.target?.result) {
        console.error('Error reading file');
        return;
      }
      this.importData(e?.target?.result as string);
    };
    reader.readAsText(file);
  }

  public importData(data: string): void {
    this._localStorageService.clear();
    const dataObj = JSON.parse(data);
    for (const key in dataObj) {
      this._localStorageService.setItem(key, dataObj[key]);
    }
    this.reloadDataSubject.next();
  }
}
