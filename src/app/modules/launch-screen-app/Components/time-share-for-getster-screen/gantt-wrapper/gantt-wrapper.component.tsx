import {
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { ViewMode, Task } from "src/types/public-types";

import { Gantt } from "src/components/gantt/gantt";
// import { getNestedChildren, getProgressForParent, getStartEndDateForParent } from "../../helper";
import {
  getNestedChildren,
  getProgressForParent,
  getStartEndDateForParent,
} from "src/helper";
import { Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { removeHiddenTasks } from "src/helpers/other-helper";
import { useState } from "react";
import { Bar } from "src/components/task-item/bar/bar";
import { take } from "rxjs/operators";

export interface TaskNode {
  id: string; // - task id generated from client side,
  parent: string; // - parent id generated from client side based on the parent's task id, if the task is the newly created one and have no parent then the value can be set as 'null',
  name: string; // - task name
  start: Date; // - task start date
  end: Date; // - task end date
  type: string; // - task display type (task,milestone,project)
  status: number; // - (use enum in typescript) 0 - Suspended, 1 - Hidden
  progress: number; // - progress percentage
  isDisabled: boolean; // - disables the current task from all actions.
  hideChildren: boolean;
  displayOrder: number;
  dependencies?: string[];
  children?: TaskNode[];
}
export const myData = "eoloor";

const Form = (props: any) => {
  const [name, setName] = useState("");
  const handleChange = (e: any) => {
    setName(e.target.value);

    let handleSubmit = (e: any) => {
      e.preventDefault();
      props.onSubmit(name);
    };
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={handleChange} />
          <button type="submit">submit</button>
        </form>
      </div>
    );
  };
};
export default Form;

interface FlatNode extends TaskNode {
  expandable: boolean;
  level: number;
}

@Component({
  selector: "app-gantt-integration",
  templateUrl: "./gantt-wrapper.component.html",
  styleUrls: ["./gantt-wrapper.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GanttWrapperComponent implements OnInit {
  @ViewChild("ganttcontainer", { static: true }) containerRef!: ElementRef;

  @ViewChild("tasktree", { static: true }) taskTree!: ElementRef;

  @Input("tasks") taskList!: any[];

  tasks: Task[] = [];

  viewMode = ViewMode;

  view = ViewMode.Hour;

  isChecked = true;

  maxHeight: number = 500;

  isMobile: boolean = false;

  root: any;

  start_date: any;

  viewControl: FormControl = new FormControl();

  private _transformer = (node: TaskNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      ...node,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(public dialog: MatDialog) {}

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit(): void {
    this.viewControl.setValue(ViewMode.Hour);
    this.init();

    window.addEventListener("resize", () => {
      this.onResize();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let change = changes["taskList"];
    if (
      change &&
      !change.firstChange &&
      change.currentValue !== change.previousValue
    ) {
      this.init();
    }
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    this.containerRef &&
      ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }
  taken: any;
  abc: any;
  init() {
    if (!this.taskList || !this.taskList.length) {
      return;
    }

    this.onResize();
    setTimeout(() => {
      this.onResize();
      this.render();
    });
    // let taskss = this.taskList.map((t, i) => ({
    //   ...t,

    //   start: new Date(t.start),
    //   end: new Date(t.end),
    //   displayOrder: i + 1,
    // }));

    // this.taken = taskss;
    // this.abc = [this.taken][0];

    // console.log(this.abc, "  this.abc");
    // for (let k = 0; k < this.abc.length; k++) {
    //   const element = this.abc[k];
    //   console.log(element.screenData, "element");
    //   this.tasks = element.screenData;
    //   this.updateTree(taskss);
    //   this.treeControl.expandAll();
    // }

    let tasks = this.taskList.map((t, i) => ({
      ...t,

      start: new Date(t.start),
      end: new Date(t.end),
      displayOrder: i + 1,
    }));
    console.log(tasks, "tt");

    this.tasks = tasks;
    this.updateTree(tasks);
    this.treeControl.expandAll();
  }

  onResize() {
    this.maxHeight = window.innerHeight - 146;
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isChecked = false;
    }
  }

  bounceTimeout: any = undefined;

  updateTree(tasks: Task[], keepExpanded?: boolean) {
    let array: FlatNode[] = [];
    this.treeControl.dataNodes &&
      this.treeControl.dataNodes.forEach((t) => {
        if (keepExpanded) {
          this.treeControl.isExpanded(t) &&
            this.treeControl.isExpandable(t) &&
            array.push(t);
        }
      });

    this.dataSource.data = getNestedChildren(tasks);
    if (this.treeControl.dataNodes) {
      this.treeControl.dataNodes.forEach((n, i) => {
        let oriTask = this.tasks.find((t) => t.id === n.id);
        if (oriTask) {
          oriTask.displayOrder = i + 1;
        }
      });
    }

    array.forEach((at) => {
      let treeNode = this.treeControl.dataNodes.find((t) => t.id === at.id);
      this.treeControl.expand(treeNode as FlatNode);
    });
  }

  onViewModeChange(viewMode: ViewMode) {
    this.view = viewMode;
    this.render();
  }

  onViewListChange(isChecked: boolean) {
    this.isChecked = isChecked;
    this.render();
  }

  private render() {
    if (!this.containerRef) {
      return;
    }

    let hideTooltip = false;
    let columnWidth = 65;
    console.log(this.view, "vie");

    if (this.view === ViewMode.Year) {
      columnWidth = 350;
    } else if (this.view === ViewMode.Month) {
      columnWidth = 300;
    } else if (this.view === ViewMode.Week) {
      columnWidth = 250;
    }

    let ganttHeight = Math.min(
      removeHiddenTasks(this.tasks).length * 40,
      this.maxHeight
    );

    if (!this.root) {
      this.root = createRoot(this.containerRef.nativeElement);
    }
    // Preprocess tasks data to format time values
    const formattedTasks = this.tasks.map((task) => {
      const formattedStart = new Date(task.start);
      const formattedEnd = new Date(task.end);

      return {
        ...task,
        start: formattedStart,
        end: formattedEnd,
      };
    });

    this.root.render(
      <React.StrictMode>
        <div>
          <Gantt
            start_date={this.start_date}
            tasks={formattedTasks}
            viewMode={this.view}
            listCellWidth={this.isChecked && !this.isMobile ? "155px" : ""}
            columnWidth={columnWidth}
            ganttHeight={ganttHeight}
            hideTooltip={hideTooltip}
            treeRef={this.taskTree}
          />
        </div>
      </React.StrictMode>
    );
  }
}
