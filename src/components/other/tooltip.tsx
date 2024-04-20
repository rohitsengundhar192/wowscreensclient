import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  container: React.RefObject<HTMLDivElement>;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
  container,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let scrollX = 0;
      let scrollY = 0;
      if (container.current && container.current.children.length) {
        scrollX = container.current.children[0].scrollLeft;
        scrollY = container.current.children[0].scrollTop;
      }

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;

      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent * 1.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        relatedX ? "tooltipDetailsContainer" : "tooltipDetailsContainerHidden"
      }
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };
  return (
    <div className="tooltipDefaultContainer" style={style}>
      {" "}
      <b style={{ fontSize: fontSize + 6 }}>{`Screen ID: ${task.name}`}</b>
      <br />
      <b style={{ fontSize: fontSize + 6 }}>
        {`
       Date: ${task.start.getDate()}-${
          task.start.getMonth() + 1
        }-${task.start.getFullYear()} - ${task.end.getDate()}-${
          task.end.getMonth() + 1
        }-${task.end.getFullYear()}`}
      </b>
       <br />
      <b style={{ fontSize: fontSize + 6 }}>{`
       Time: ${task.start.getHours()}.${task.start.getMinutes().toString().padStart(2, '0')}- ${task.end.getHours()}.${task.end.getMinutes().toString().padStart(2, '0')}`}</b>
         {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className="tooltipDefaultContainerParagraph">{`Duration: ${task.duration} Hour(s)`}</p>
      )}
      {/* <p className="tooltipDefaultContainerParagraph">
        {!!task.progress && `Progress: ${task.progress} %`}
      </p> */}

<b style={{ fontSize: fontSize + 6 }}>{`Name: ${task.first_name} ${task.last_name}`}</b>
    </div>
  );
};
