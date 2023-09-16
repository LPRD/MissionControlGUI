import React from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

const GraphBlock = ({ type, data, width, height }) => {
  switch (type) {
    case "pie":
      return (
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="time"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#9cc3f0"
            stroke="#dddddd"
            isAnimationActive={false}
          />
        </PieChart>
      );
    case "line":
      return (
        <LineChart
          width={width}
          height={height}
          data={data}
          margin={{ left: 10, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="time" />
          <YAxis dataKey="value" mirror />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#dddddd"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      );
    case "bar":
      return (
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={{ left: 10, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="time" />
          <YAxis dataKey="value" mirror />
          <Bar dataKey="value" fill="#9cc3f0" stroke="#dddddd" isAnimationActive={false} />
        </BarChart>
      );
    case "area":
      return (
        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ left: 10, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="time" />
          <YAxis dataKey="value" mirror />
          <Area
            // type="monotone"  //smooth graph
            dataKey="value"
            fill="#9cc3f0"
            fillOpacity={1.0} 
            stroke="#dddddd"
            // strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      );
    default:
      return null;
  }
};

GraphBlock.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default GraphBlock;
