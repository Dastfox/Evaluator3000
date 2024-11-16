import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  constructor(private _localStorageService: LocalStorageService) {

  }

  public exportData(): void {
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
  }
}
