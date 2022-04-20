import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IHierarchy } from '@jbouduin/holidays-lib';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  public selectedHierarchy: IHierarchy | undefined;
  public selectedYear: number | undefined;

  public readonly isHandset$: Observable<boolean>;

  constructor(breakpointObserver: BreakpointObserver) {
    this.selectedHierarchy = undefined;
    this.selectedYear = undefined;
    this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  public nodeSelected(node: IHierarchy): void {
    this.selectedHierarchy = node;
  }

  public yearChanged(year: number): void {
    this.selectedYear = year;
  }
}
