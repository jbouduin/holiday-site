import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFileProvider, IHierarchy } from '@jbouduin/holidays-lib';

@Injectable({
  providedIn: 'root'
})
export class FileProvider implements IFileProvider {

  private httpClient: HttpClient;
  private assetsPath: string;
  private httpOptions: any;

  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.assetsPath = 'assets/holidays';
    this.httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      responseType: "json"
    };
  }

  // <editor-fold desc='IFileProvider interface methods'>
  public async loadConfiguration(rootHierarchy: string): Promise<string> {
    const fileName = `${this.assetsPath}/configurations/${rootHierarchy}.json`;
    const res = await this.httpClient.get<string>(fileName).toPromise();
    return JSON.stringify(res);
  }

  public async loadHierarchies(): Promise<string> {
    const fileName = `${this.assetsPath}/configurations.json`;
    // this.httpClient.get(fileName, this.httpOptions).subscribe(s => console.log(s));
    const res = await this.httpClient.get<string>(fileName).toPromise();
    return JSON.stringify(res);
  }

  public async loadHierarchyTranslations(language?: string): Promise<string> {
    const fileName = language ?
      `${this.assetsPath}/translations/hierarchy.${language}.json` :
      `${this.assetsPath}/translations/hierarchy.json`;
    const res = await this.httpClient
      .get<any>(fileName).toPromise();
    return JSON.stringify(res);
  }

  public async loadLanguages(): Promise<string> {
    const fileName = `${this.assetsPath}/languages.json`;
    const res = await this.httpClient.get<string>(fileName).toPromise();
    return JSON.stringify(res);
  }

  public async loadHolidayTranslations(language?: string): Promise<string> {
    const fileName = language ?
      `${this.assetsPath}/translations/holiday.${language}.json` :
      `${this.assetsPath}/translations/holiday.json`;
    const res = await this.httpClient.get<string>(fileName).toPromise();
    return JSON.stringify(res);
  }
  // </editor-fold>
}
