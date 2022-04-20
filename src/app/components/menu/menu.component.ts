import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { files } from './example-data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

/** File node data with possible child nodes. */
export interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit {

  @Output() public nodeSelected: EventEmitter<FileNode>;
  @Output() public yearChanged: EventEmitter<number>;

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = files;
    this.formGroup = formBuilder.group(
      { year: new FormControl(2023, Validators.required) }
    );
    this.nodeSelected = new EventEmitter<FileNode>();
    this.yearChanged = new EventEmitter<number>();
  }

  public ngAfterViewInit(): void {
    this.yearChanged.emit(this.formGroup.controls['year'].value)
  }
  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number): FlatTreeNode {
    return {
      name: node.name,
      type: node.type,
      level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }

  clickNode(node: FileNode): void {
    console.log(`clicked ${JSON.stringify(node, null, 2)}`)
    this.nodeSelected.emit(node);
  }

  yearUp(): void {
    this.formGroup.controls['year'].patchValue(Number.parseInt(this.formGroup.value.year) + 1);
    this.yearChanged.emit(this.formGroup.controls['year'].value)
  }

  yearDown(): void {
    this.formGroup.controls['year'].patchValue(Number.parseInt(this.formGroup.value.year) - 1);
    this.yearChanged.emit(this.formGroup.controls['year'].value)
  }
}
