import PropType from "prop-types";
import { XMLParser } from "fast-xml-parser";
import { Input } from "@/components/ui/input";

function TcxFileReader({ setJsonData, setFileName }) {
  const options = { ignoreAttributes: false };
  const parser = new XMLParser(options);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const tcxData = event.target.result;
      try {
        const parsedData = parser.parse(tcxData, true);
        setJsonData(parsedData);
      } catch (err) {
        setJsonData(null);
        console.error(err);
      }
    };

    setFileName(file.name);
    reader.readAsText(file);
  };

  return <Input type="file" onChange={handleFileChange} />;
}

TcxFileReader.propTypes = {
  setJsonData: PropType.func.required,
  setFileName: PropType.func.required,
};

export default TcxFileReader;
