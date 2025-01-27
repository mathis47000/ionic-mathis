import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
  }

  async set(key: string, value: any) {
      await this.storage?.set(key, value);
  }

  async get(key: string): Promise<any> {
    const value = await this.storage?.get(key);
    return value;
  }
  
  async remove(key: string) {
      await this.storage?.remove(key);
  }
}
