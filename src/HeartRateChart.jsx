/* eslint-disable react/prop-types */
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  formatTimeHHMM,
  secondsBetweenTimestamps,
  secondsToHHMMSS,
} from "./utils/timeUtils";

function formatXAxis(tickItem) {
  return formatTimeHHMM(tickItem);
}

function CustomTooltip({ payload, active, startTime }) {
  if (active) {
    return (
      <div className="flex flex-col items-start">
        <div>Distance: {payload[0]?.payload?.DistanceMeters?.toFixed(1)}m</div>
        <div>HeartRate: {payload[0]?.payload?.HeartRateBpm?.Value}bpm</div>
        <div>Time of Day: {formatTimeHHMM(payload[0]?.payload?.Time)}</div>
        <div>
          Activity Time:{" "}
          {secondsToHHMMSS(
            secondsBetweenTimestamps(startTime, payload[0]?.payload?.Time)
          )}
        </div>
      </div>
    );
  }
}

function HeartRateChart({ data, changeCrop }) {
  const [startTime] = React.useState(data[0]?.Time);

  function handleClick(data) {
    if (typeof changeCrop === "function")
      changeCrop(data?.activePayload[0]?.payload?.Time);
  }

  return (
    <>
      {data && (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              width={800}
              height={230}
              data={data}
              onClick={handleClick}
            >
              <XAxis
                dataKey="Time"
                includeHidden
                domain={["dataMin", "dataMax"]}
                interval="preserveStart"
                tickFormatter={formatXAxis}
              />
              <YAxis
                label={{
                  value: "Heart Rate",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip startTime={startTime} />} />
              <Line
                type="monotone"
                dataKey="HeartRateBpm.Value"
                stroke="#ff073a"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
}

export default HeartRateChart;
