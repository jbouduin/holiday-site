import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() public sidenav!: MatSidenav;

  public constructor(private titleService: Title) { }

  public ngOnInit() { }

  public get title(): string {
    return this.titleService.getTitle();
  }

}
