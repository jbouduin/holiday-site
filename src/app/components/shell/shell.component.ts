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

  public selectedNode: IHierarchy | undefined;
  public selectedYear: number | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {
    this.selectedNode = undefined;
    this.selectedYear = undefined;
  }

  nodeSelected(node: IHierarchy): void {
    this.selectedNode = node;
  }

  yearChanged(year: number): void {
    this.selectedYear = year;
  }
}
