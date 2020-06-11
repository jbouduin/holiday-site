import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, OnChanges, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IHierarchy } from '@jbouduin/holidays-lib';

@Component({
  selector: 'app-hierarchy-tree',
  templateUrl: './hierarchy-tree.component.html',
  styleUrls: ['./hierarchy-tree.component.scss']
})
export class HierarchyTreeComponent implements OnChanges, OnInit {

  // <editor-fold desc='@Input/@Output'>
  @Input() public hierarchyTree: Array<IHierarchy>;
  @Output() public nodeSelected: EventEmitter<IHierarchy>;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public selectedNode: IHierarchy | undefined;
  public treeControl: NestedTreeControl<IHierarchy>;
  public treeDataSource: MatTreeNestedDataSource<IHierarchy>;
  // </editor-fold>

  // <editor-fold desc='Constructor'>
  public constructor() {
    this.treeControl = new NestedTreeControl<IHierarchy>(node => node.children);
    this.treeDataSource = new MatTreeNestedDataSource<IHierarchy>();
    this.nodeSelected = new EventEmitter<IHierarchy>();
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'hierarchyTree': {
            const newValue = changes[propName].currentValue;
            this.treeDataSource.data = newValue;
          }
        }
      }
    }
  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered methods'>
  public hasChild(_: number, node: IHierarchy): boolean {
    return !!node.children && node.children.length > 0;
  }

  public clickNode(node: IHierarchy) {
    this.selectedNode = node;
    console.log(node);
    this.nodeSelected.emit(node);
  }
  // </editor-fold>
}
