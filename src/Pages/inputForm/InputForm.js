import React, { useState } from "react";

// Components
import InputText from "./atoms/inputText";
import InputFile from "./atoms/inputFile";
import { Button } from "flowbite-react";

// Constants
import {
  EMPTY_OBJECT,
  PRE_SIGNED_URL,
  PUT_TO_DYNAMO_DB_URL,
} from "../../constants";
import axios from "axios";

function InputForm() {
  const [form, setForm] = useState(EMPTY_OBJECT);
  const { textInput, fileInput } = form;

  const handleTextInputChange = (value) => {
    setForm({ ...form, textInput: value });
  };

  const handleFileInputChange = (selectedFile) => {
    setForm({ ...form, fileInput: selectedFile });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      bucketName: "rushitextbucket",
      fileKey: form.fileInput.name,
      fileType: form.fileInput.type,
    };

    fetch(PRE_SIGNED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON response
      })
      .then(async (data) => {
        const url = data?.body?.url;
        console.log(data, url);
        const response = await axios.put(url, form.fileInput, {
          headers: {
            "Content-Type": form.fileInput.type,
          },
        });
        return response;
      })
      .then(async () => {
        const requestData = {
          bucketName: "rushitextbucket",
          fileKey: form.fileInput.name,
          inputText: form.textInput,
        };
        const response = await axios.put(
          PUT_TO_DYNAMO_DB_URL,
          { body: JSON.stringify(requestData) },
          {
            headers: {
              "Content-Type": form.fileInput.type,
            },
          }
        );

        return response;
      })
      .catch((error) => {
        console.error("There was a problem with the request:", error);
      });
      alert("Request Submitted Successfully");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-max m-auto mt-16 border-gray-500 border-solid bg-gray-100 border-4 p-16"
      >
        <div className="mb-8">
          <InputText
            value={textInput}
            onChange={handleTextInputChange}
            className="mb-4"
          />
          <InputFile
            selectedFile={fileInput}
            onChange={handleFileInputChange}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default InputForm;
