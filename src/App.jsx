import { useState, useEffect } from "react";

import { Button } from "./components/ui/button";

import HeartRateChart from "./HeartRateChart";
import ActivityData from "./ActivityData";
import {
  getTrackPoints,
  removeTrackPoints,
  transformJsonToTcx,
} from "./utils/utils";

import TcxFileReader from "./TcxFileReader";
function App() {
  const [jsonData, setJsonData] = useState(null);
  const [croppedData, setCroppedData] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleCropClick = (timeStamp) => {
    setCroppedData(
      removeTrackPoints(JSON.parse(JSON.stringify(jsonData)), timeStamp)
    );
  };

  useEffect(() => {
    setCroppedData(null);
  }, [fileName]);

  return (
    <div className="w-full p-5">
      <h1 className="text-left text-2xl font-extrabold">
        Tcx File Cropper V0.2
      </h1>
      <div className="p-5">
        <ol className="list-outside list-decimal">
          <li>
            Export your polar flow data in TCX format and upload this file here.
          </li>
          <li>Then click on the graph to crop the data</li>
          <li>Click on the save button to save the cropped data to TCX</li>
        </ol>
      </div>
      <TcxFileReader setJsonData={setJsonData} setFileName={setFileName} />
      <br />
      {jsonData && (
        <>
          <HeartRateChart
            data={getTrackPoints(jsonData)}
            changeCrop={handleCropClick}
          />
          <ActivityData data={jsonData} />
          {croppedData && (
            <>
              <HeartRateChart data={getTrackPoints(croppedData)} />
              <ActivityData data={croppedData} />
              <Button
                type="button"
                className="m-4 border-2 border-black"
                onClick={() => transformJsonToTcx(croppedData, fileName)}
              >
                Save cropped results to TCX
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
