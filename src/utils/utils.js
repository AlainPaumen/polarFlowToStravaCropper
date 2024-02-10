function combineTrackPoints(trackPoints, track) {
  if (Array.isArray(track)) {
    for (let i = 0; i < track.length; i++) {
      trackPoints = trackPoints.concat(track[i].Trackpoint);
    }
  } else {
    trackPoints = trackPoints.concat(track.Trackpoint);
  }

  return trackPoints
}

export function getTrackPoints(tcxData) {
  let trackPoints = [];
  const laps = tcxData.TrainingCenterDatabase.Activities.Activity.Lap;

  if (tcxData) {
    if (Array.isArray(laps)) {
      for (let i = 0; i < laps.length; i++) {
        trackPoints = combineTrackPoints(trackPoints, laps[i].Track);
      }
    } else {
      trackPoints = combineTrackPoints(trackPoints, laps.Track);
    }
  }

  return trackPoints;
}


function findIndexCropTimeStamp(trackPoints, cropTimeStamp) {
  return trackPoints.findIndex((point) => point.Time > cropTimeStamp);
}


export function removeTrackPoints(tcxData, cropTimeStamp) {
  const laps = tcxData.TrainingCenterDatabase.Activities.Activity.Lap;
  
  if (Array.isArray(laps)) {
    for (let i=0; i < laps.length; i++) {
      if (removeTrackPointsFromLap(laps[i], cropTimeStamp)) {
        laps.splice(i);
        break;
      }
    }
  } else {
    removeTrackPointsFromLap(laps, cropTimeStamp);
  }

  return tcxData;
}

function removeTrackPointsFromLap(lapData, cropTimeStamp) {
  const tracks = lapData.Track;
  let removeLap = true;

  if (Array.isArray(tracks)) {
    let trackIdx = -1;
    let trackPointIdx = -1;

    for (let i = 0; i < tracks.length; i++) {
      let idx = findIndexCropTimeStamp(tracks[i].Trackpoint, cropTimeStamp);
      if (idx > -1) {
        trackIdx = i;
        trackPointIdx = idx;
        removeLap = false;
        break;
      } 
    }

    // take only those tracks that contain the cropTimeStamp or lower value
    tracks.splice(trackIdx + 1);

    // take only those trackpoints from last track that contain the cropTimeStamp or lower value
    tracks[trackIdx].Trackpoint.splice(trackPointIdx+1);
  } else {
    let idx = -1;
    if (Array.isArray(tracks.Trackpoint)) {
      idx = findIndexCropTimeStamp(tracks.Trackpoint, cropTimeStamp);
      if (idx > -1) {
        tracks.Trackpoint.splice(idx+1);
        removeLap = false;
      }
    } else {
      if (tracks.Trackpoint.Time > cropTimeStamp) {
        delete tracks.Trackpoint;
      } else {
        removeLap = false;
      }
    }
  }

  return removeLap;
}



export function downloadBlob(blobString, fileType, fileName) {
  const blob = new Blob([blobString], {type: fileType});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export function getFileNameWithoutExtension(filename) {
  return filename.split('.').slice(0, -1).join('.');
}



import { CopyIcon } from "@radix-ui/react-icons";
import { XMLBuilder } from "fast-xml-parser";
export function transformJsonToTcx(jsonData, fileName) {
  const outputFileName = getFileNameWithoutExtension(fileName) + "_cropped.tcx";

  const options = { ignoreAttributes: false, format: true };
  const builder = new XMLBuilder(options);
  const tcxData = builder.build(jsonData);

  downloadBlob(tcxData, "text/xml", outputFileName);
  alert("File saved: " + outputFileName);
}