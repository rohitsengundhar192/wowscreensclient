import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";

import { DateSetup } from "../../types/date-setup";
import {
  getCachedDateTimeFormat,
  getLocalDayOfWeek,
  getLocaleMonth,
} from "src/helpers/date-helper";

function App() {
  const getData = (data:any) => {
    console.log('data',data)
  };
  return (
    <div>
      <form onSubmit={getData}/>
    </div>
  );
}

export default App;
export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
}) => {
  // const getCalendarValuesForHour = () => {
  //   const topValues: ReactChild[] = [];
  //   const bottomValues: ReactChild[] = [];
  //   const topDefaultHeight = headerHeight * 0.2;
  //   const dates = dateSetup.dates;

  //   const timeFormat = new Intl.DateTimeFormat(locale, {
  //     hour: "numeric",
  //     minute: "numeric",
  //   });

  //   const dateFormat = new Intl.DateTimeFormat(locale, {
  //     day: "2-digit",
  //     month: "long",
  //     year: "numeric",
  //   });

  //   for (let i = 0; i < dates.length; i++) {
  //     const date = dates[i];
  //     const startHour = timeFormat?.format(date);
  //     const endHour = timeFormat?.format(
  //       new Date(date.getTime() + 60 * 60 * 1000)
  //     ); // Add 1 hour to the date

  //     const bottomValue = (
  //       <g key={date.getTime()}>
  //         <text
  //           y={headerHeight * 0.5}
  //           x={columnWidth * (i + +rtl)}
  //           className="calendarBottomText"
  //           fontFamily={fontFamily}
  //         >
  //           {startHour}
  //         </text>
  //         <text
  //           y={headerHeight * 0.6}
  //           x={columnWidth * (i + +rtl)}
  //           dy=".5em"
  //           className="calendarBottomText"
  //           fontFamily={fontFamily}
  //         >
  //           to
  //         </text>
  //         <text
  //           y={headerHeight * 0.7}
  //           x={columnWidth * (i + +rtl)}
  //           dy="1em"
  //           className="calendarBottomText"
  //           fontFamily={fontFamily}
  //         >
  //           {endHour}
  //         </text>
  //       </g>
  //     );

  //     bottomValues.push(bottomValue);

  //     const topValue = dateFormat.format(date);
  //     const topPosition = (date.getHours() - 24) / 2;
  //     topValues.push(
  //       <TopPartOfCalendar
  //         key={topValue + date.getFullYear()}
  //         value={topValue}
  //         x1Line={columnWidth * i}
  //         y1Line={0}
  //         y2Line={topDefaultHeight}
  //         xText={columnWidth * (i + topPosition)}
  //         yText={topDefaultHeight * 0.9}
  //       />
  //     );
  //   }

  //   return [topValues, bottomValues];
  // };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;

    // Create a DateTimeFormat instance for time formatting
    const timeFormat = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: true,
    });

    // Create a DateTimeFormat instance for date formatting
    const dateFormat = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = timeFormat.format(date);
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className="calendarBottomText"
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );

      // Check if it's a new date
      if (i > 0 && dates[i - 1].getDate() !== date.getDate()) {
        const topValue = dateFormat.format(date);
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };



  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }

  return (
    <g
      className="calendar"
      fontSize={fontSize}
      fontFamily={fontFamily}
      height={headerHeight}
    >
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className="calendarHeader"
      />
      {bottomValues} {topValues}
    </g>
  );
};
