import React from "react";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";

const RichTextEditor = ({ initialContent }) => {
  const contentState = initialContent
    ? convertFromRaw(initialContent)
    : EditorState.createEmpty().getCurrentContent();

  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(contentState)
  );

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleSave = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const jsonContent = JSON.stringify(rawContentState);
    // Use `jsonContent` to save the JSON representation to your backend or wherever you need it.
  };

  const htmlContent = stateToHTML(editorState.getCurrentContent());

  return (
    <div>
      <Editor editorState={editorState} onChange={handleEditorChange} />
      <button onClick={handleSave}>Save Content</button>

      {/* Render the rich text content as HTML */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default RichTextEditor;
