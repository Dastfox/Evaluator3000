import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  getAllItems(): any {
    const items: {[key: string] : {}} = {};
    for(const key of this.getAllKeys()){
      items[key] = this.getItem(key);
    }
    return items;
  }

  getAllKeys(): string[] {
    return Object.keys(localStorage);
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
