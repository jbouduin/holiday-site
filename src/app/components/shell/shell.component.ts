import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IHierarchy } from '@jbouduin/holidays-lib';
import { versionInfo } from 'src/environments/version-info';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  //#region public properties -------------------------------------------------
  public readonly title: string;
  public readonly isHandset$: Observable<boolean>;
  public selectedHierarchy: IHierarchy | undefined;
  public selectedYear: number | undefined;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  constructor(breakpointObserver: BreakpointObserver) {
    this.selectedHierarchy = undefined;
    this.selectedYear = undefined;
    this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
    this.title = `Holiday calculator (v${versionInfo.version})`;
  }
  //#endregion

  //#region UI triggered methods ----------------------------------------------
  public nodeSelected(node: IHierarchy): void {
    this.selectedHierarchy = node;
  }

  public yearChanged(year: number): void {
    this.selectedYear = year;
  }
  //#endregion
}
