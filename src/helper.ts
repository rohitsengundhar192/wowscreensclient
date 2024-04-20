import { Task } from "./types/public-types";

export function getNestedChildren(arr: any[], parent?: string | number) {
  var out = []
  for(var i in arr) {
      if(arr[i].parent == parent) {
          var children = getNestedChildren(arr, arr[i].id)

          if(children.length) {
            arr[i].children = children;
            arr[i].expandable = true;
          } else {
            delete arr[i].children;
            delete arr[i].expandable;
          }
          out.push(arr[i])
      }
  }
  return out
}

export function getStartEndDateForParent(tasks: Task[], projectId: string) {
  const childTasks = tasks.filter(t => t.parent === projectId);
  const parentTask = tasks.find(t => t.id === projectId);
  let start = childTasks[0] ? childTasks[0].start : (parentTask?.start || new Date());
  let end = childTasks[0] ? childTasks[0].end : (parentTask?.end || new Date());

  for (let i = 0; i < childTasks.length; i++) {
    const task = childTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }

  return [start, end];
}

export function getProgressForParent(tasks: Task[], projectId: string) {
  const childTasks = tasks.filter(t => t.parent === projectId && t.type !== 'milestone');
  let progress = 0;

  for (let i = 0; i < childTasks.length; i++) {
    const task = childTasks[i];
    progress += task.progress || 0
  }
  
  return childTasks.length ? Math.floor(progress / childTasks.length) : 0;
}
