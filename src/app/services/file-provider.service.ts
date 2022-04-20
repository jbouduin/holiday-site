import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFileProvider } from '@jbouduin/holidays-lib';
import { lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileProviderService implements IFileProvider {

  private readonly httpClient: HttpClient;
  private readonly assetsPath: string;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.assetsPath = 'assets/holidays';
  }

  public async loadConfiguration(rootHierarchy: string): Promise<string> {
    const fileName = `${this.assetsPath}/configurations/${rootHierarchy}.json`;
    const res = await lastValueFrom(this.httpClient.get<string>(fileName));
    return JSON.stringify(res);
  }

  public async loadHierarchies(): Promise<string> {
    const fileName = `${this.assetsPath}/configurations.json`;
    const res = await lastValueFrom(this.httpClient.get<any>(fileName));
    return JSON.stringify(res);
  }

  public async loadHierarchyTranslations(language?: string): Promise<string> {
    const fileName = language ?
      `${this.assetsPath}/translations/hierarchy.${language}.json` :
      `${this.assetsPath}/translations/hierarchy.json`;
    const res = await lastValueFrom(this.httpClient.get<any>(fileName));
    return JSON.stringify(res);
  }

  public async loadLanguages(): Promise<string> {
    const fileName = `${this.assetsPath}/languages.json`;
    const res = await lastValueFrom(this.httpClient.get<any>(fileName));
    return JSON.stringify(res);
  }

  public async loadHolidayTranslations(language?: string): Promise<string> {
    const fileName = language ?
      `${this.assetsPath}/translations/holiday.${language}.json` :
      `${this.assetsPath}/translations/holiday.json`;
    const res = await lastValueFrom(this.httpClient.get<any>(fileName));
    return JSON.stringify(res);
  }
}
