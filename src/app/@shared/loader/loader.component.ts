import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() public isLoading = false;
  @Input() public size = 1;
  @Input() public message: string | undefined;

  public constructor() { }

  public ngOnInit() { }

}
