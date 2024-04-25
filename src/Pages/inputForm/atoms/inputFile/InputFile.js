import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FileInput, Label } from "flowbite-react";

// Lodash
import _noop from "lodash/noop";

// Constants
import { EMPTY_FILE } from "../../../../constants";

function InputFile(props) {
  const { onChange, selectedFile } = props;

  const inputRef = useRef(null);
  const [change,setChange] = useState(false);

  useEffect(() => {
    if (selectedFile.name) {
        const dataTransfer = new DataTransfer();
     dataTransfer.items.add(selectedFile);
     inputRef.current.files = dataTransfer.files;
    }
  }, [selectedFile, change]);

  const handleInputChange = (event) => {
    const selectedFile = event?.target?.files[0];
    setChange(!change);
    if (selectedFile) {
        onChange(selectedFile);;
    }
  };

  return (
    <div className="flex">
      <Label
        htmlFor="file-upload"
        value="File Input:"
        className="mr-2 block self-center text-base"
      />
      <FileInput
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        placeholder="No file chosen"
        accept=".txt"
        id="file-upload"
        required
      />
    </div>
  );
}

InputFile.propTypes = {
  onChange: PropTypes.func,
  selectedFile : PropTypes.instanceOf(File)
};

InputFile.defaultProps = {
  onChange: _noop,
  selectedFile: EMPTY_FILE,
};

export default InputFile;
