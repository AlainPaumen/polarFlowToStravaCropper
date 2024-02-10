import { objectMaxValue } from "./utils/arrayUtils";
import { getTrackPoints } from "./utils/utils";
import { secondsBetweenTimestamps, secondsToHHMMSS } from "./utils/timeUtils";
function ActivityData(tcxData) {
  if (!tcxData.data) {
    return null;
  }

  const trackPoints = getTrackPoints(tcxData.data);

  function totalHeartRate(total, currentValue) {
    if (isNaN(currentValue?.HeartRateBpm?.Value)) {
      return total;
    }
    return total + currentValue?.HeartRateBpm?.Value;
  }

  const avgHeartRateBpm =
    trackPoints.reduce(totalHeartRate, 0) / trackPoints.length;

  const maxHeartRateBpm = objectMaxValue(trackPoints, "HeartRateBpm.Value");

  const totalTimeSeconds = secondsBetweenTimestamps(
    trackPoints[0].Time,
    trackPoints[trackPoints.length - 1].Time
  );

  const distanceMeters = objectMaxValue(trackPoints, "DistanceMeters");

  return (
    <>
      <h1>Activity data</h1>
      <div className="flex flex-row">
        <div className="flex flex-col p-5">
          <div>Average Heart rate: {avgHeartRateBpm.toFixed(0)} bpm</div>
          <div>Max. Heart rate: {maxHeartRateBpm} bpm</div>
          <div>Distance: {distanceMeters.toFixed(2)} m</div>
          <div>
            Total workout Time: {secondsToHHMMSS(totalTimeSeconds)} (hh:mm:ss)
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityData;
