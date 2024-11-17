import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly prefix = 'E-valuateur_';

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private removePrefixFromKey(prefixedKey: string): string {
    console.log('removePrefixFromKey', prefixedKey);
    return prefixedKey.slice(this.prefix.length);
  }

  getAllItems(): { [key: string]: any } {
    try {
      const items: { [key: string]: any } = {};
      const prefixedKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix));

      for (const prefixedKey of prefixedKeys) {
        const key = this.removePrefixFromKey(prefixedKey);
        items[key] = this.getItem(key);
      }
      return items;
    } catch (error) {
      console.error('Error getting all items:', this.getErrorMessage(error));
      return {};
    }
  }

  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => this.removePrefixFromKey(key));
    } catch (error) {
      console.error('Error getting all keys:', this.getErrorMessage(error));
      return [];
    }
  }

  setItem(key: string, value: any): void {
    console.log('setItem', key, value);
    try {
      localStorage.setItem(
        this.getPrefixedKey(key),
        JSON.stringify(value)
      );
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error('Error setting item:', errorMessage);
      throw new Error(`Failed to set item ${key}: ${errorMessage}`);
    }
  }

  getItem(key: string): any {
    try {
      const value = localStorage.getItem(this.getPrefixedKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting item:', this.getErrorMessage(error));
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getPrefixedKey(key));
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error('Error removing item:', errorMessage);
      throw new Error(`Failed to remove item ${key}: ${errorMessage}`);
    }
  }

  clear(): void {
    try {
      const prefixedKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix));

      prefixedKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error('Error clearing storage:', errorMessage);
      throw new Error(`Failed to clear storage: ${errorMessage}`);
    }
  }

  setLanguage(language: string): void {
    this.setItem('language', language);
  }

  getLanguage(): string {
    return this.getItem('language') || 'fr';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
