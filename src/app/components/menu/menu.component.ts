import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from 'src/app/services/holiday.service';
import { IHierarchy } from '@jbouduin/holidays-lib';

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
  hierarchy: IHierarchy;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Output() public nodeSelected: EventEmitter<IHierarchy>;
  @Output() public yearChanged: EventEmitter<number>;

  private readonly holidayService: HolidayService;
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<IHierarchy, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<IHierarchy, FlatTreeNode>;

  public readonly formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, holidayService: HolidayService) {
    this.holidayService = holidayService;
    this.treeFlattener = new MatTreeFlattener(
      (hierarchy: IHierarchy, level: number) => this.transformer(hierarchy, level),
      (node: FlatTreeNode) => this.getLevel(node),
      (node: FlatTreeNode) => this.isExpandable(node),
      (hierarchy: IHierarchy) => this.getChildren(hierarchy)
    );

    this.treeControl = new FlatTreeControl(
      (node: FlatTreeNode) => this.getLevel(node),
      (node: FlatTreeNode) => this.isExpandable(node)
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.formGroup = formBuilder.group(
      /* eslint-disable-next-line @typescript-eslint/unbound-method */
      { year: new FormControl(2023, Validators.required) }
    );
    this.nodeSelected = new EventEmitter<IHierarchy>();
    this.yearChanged = new EventEmitter<number>();
  }

  public ngOnInit(): void {
    // TODO sort by description
    this.holidayService.getHierarchyTree().subscribe((tree: Array<IHierarchy>) => this.dataSource.data = tree);
    this.yearChanged.emit(this.formGroup.controls['year'].value as number);
  }

  /** Transform the data to something the tree can read. */
  private transformer(node: IHierarchy, level: number): FlatTreeNode {
    return {
      name: node.description,
      type: node.code,
      level,
      expandable: !!node.children,
      hierarchy: node
    };
  }

  /** Get the level of the node */
  private getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  private isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  public hasChild(_index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get the children for the node. */
  private getChildren(node: IHierarchy): Array<IHierarchy> | null | undefined {
    return node.children;
  }

  public clickNode(node: FlatTreeNode): void {
    this.nodeSelected.emit(node.hierarchy);
  }

  public yearUp(): void {
    this.formGroup.controls['year'].patchValue((this.formGroup.controls['year'].value as number) + 1);
    this.yearChanged.emit(this.formGroup.controls['year'].value as number)
  }

  public yearDown(): void {
    this.formGroup.controls['year'].patchValue((this.formGroup.controls['year'].value as number) - 1);
    this.yearChanged.emit(this.formGroup.controls['year'].value as number)
  }
}
