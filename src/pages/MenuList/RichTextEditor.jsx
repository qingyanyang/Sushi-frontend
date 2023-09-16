import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const RichTextEditor = forwardRef((props, ref) => {
    const { detail } = props
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    const getDetail = () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    useImperativeHandle(ref, () => ({
        getDetail,
    }));

    useEffect(() => {
        if (detail) {
            const contentBlock = htmlToDraft(detail)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
        }
    }, [detail])

    return (
        <div>
            <Editor
                editorState={editorState}
                editorStyle={{ border: '1px solid lightgrey', minHeight: '200px', paddingLeft: '10px' }}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
            />
        </div>
    )
});

export default RichTextEditor;
