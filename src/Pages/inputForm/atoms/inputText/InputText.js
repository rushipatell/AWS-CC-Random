import React from "react";
import PropTypes from "prop-types";
import { TextInput, Label } from "flowbite-react";


// Lodash
import _noop from "lodash/noop";

function InputText(props) {
  const { onChange, value, className } = props;

  const handleInputChange = (event) => {
    const text = event?.target?.value;
    onChange(text);
  };

  return (
    <div className={`${className} flex`}>
      <Label htmlFor="text-input" value="Text Input:" className="mr-2 block self-center text-base"/>
      <TextInput
        type="text"
        id="text-input"
        onChange={handleInputChange}
        value={value}
        required
      />
    </div>
  );
}

InputText.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

InputText.defaultProps = {
  onChange: _noop,
  value: "",
};

export default InputText;
