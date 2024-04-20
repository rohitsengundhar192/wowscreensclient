import React, { useRef, useEffect } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  rowHeight: number;
  columnWidth: number;
  svgWidth: number;
  ganttFullHeight: number;
  treeRef: any;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  rowHeight,
  columnWidth,
  svgWidth,
  ganttFullHeight,
  treeRef
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  const handleWheel = (event: WheelEvent) => {
    if(!scrollRef || !scrollRef.current) {
      return;
    }
    let scrollX = scrollRef.current.scrollLeft;
    let scrollY = scrollRef.current.scrollTop;
    if (event.shiftKey || event.deltaX) {
      const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
      let newScrollX = scrollX + scrollMove;
      if (newScrollX < 0) {
        newScrollX = 0;
      }
      handleScroll(event as any, undefined, newScrollX);
      event.preventDefault();
    } else if (event.deltaY) {
      let newScrollY = scrollY + event.deltaY;
      if (newScrollY < 0) {
        newScrollY = 0;
      }
      if (newScrollY !== scrollY) {
        handleScroll(event as any, newScrollY)
        event.preventDefault();
      }
    }
  }

  const handleScroll = (event: React.UIEvent<HTMLElement>, scrollTop?: number, scrollLeft?: number) => {
    if(scrollTop !== undefined) {
      if(scrollRef && scrollRef.current) {
        scrollRef.current.scrollTop = scrollTop;
      }
      return;
    }
    if(scrollLeft !== undefined) {
      if(scrollRef && scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft;
      }
      return;
    }

    if(treeRef && treeRef.nativeElement && treeRef.nativeElement.children.length) {
      treeRef.nativeElement.children[0].scrollTop = event.currentTarget.scrollTop;
    }
  }

  useEffect(() => {
    let fn = (event: WheelEvent) => {
      handleWheel(event);
    };

    if(treeRef && treeRef.nativeElement && treeRef.nativeElement.children.length) {
      treeRef.nativeElement.children[0].addEventListener('wheel', fn);
    }

    return () => {
      if(treeRef && treeRef.nativeElement && treeRef.nativeElement.children.length) {
        treeRef.nativeElement.children[0].addEventListener('wheel', fn)
      }
    }
  }, [])

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    if(!scrollRef || !scrollRef.current) {
      return;
    }
    let newScrollY = scrollRef.current.scrollTop;
    let newScrollX = scrollRef.current.scrollLeft;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      scrollRef.current.scrollLeft = newScrollX;
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      scrollRef.current.scrollTop = newScrollY;
    }
  };

  return (
    <div
      className="ganttVerticalContainer"
      dir="ltr"
      tabIndex={0}
      ref={scrollRef}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
    >
      <svg
        className="calendarContainer"
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div 
        className="horizontalContainer"
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
