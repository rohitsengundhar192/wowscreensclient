export interface TreeData {
  category_id: string;
  parent_category_id?: string;
  category_name: string;
  ishidden: boolean | string | number;
  children: TreeData[];
  level?: number;
  expandable?: boolean;
}

export interface DialogData {
  category_name: string;
  Component: string;
  parent: TreeData;
  isTop: boolean;
}
