"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { px } from "framer-motion";

export default function HtmlEditor({ onSubmit }) {
  // Accept onSubmit as a prop
  const [code, setCode] = useState("<h1>Hello World</h1>");

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Code Editor */}
      <div className="w-1/3 border rounded-lg overflow-hidden shadow">
          <Editor
            height={"400px"}
            defaultLanguage="html"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
          />
        <div className="flex justify-center">
          <button
            onClick={() => onSubmit(code)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-2"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="w-2/3 border rounded-lg shadow bg-white">
        <iframe
          title="Live Preview"
          className="w-full h-[400px] p-2"
          srcDoc={code}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
