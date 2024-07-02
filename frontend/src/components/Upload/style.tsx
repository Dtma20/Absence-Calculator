import styled, { css } from "styled-components";

const dragActive = css`
  border-color: #78e5d5;
`;

const dragReject = css`
  border-color: #e57878;
`;

interface DropContainerProps {
  isDragActive?: boolean;
  isDragReject?: boolean;
}

export const DropContainer = styled.div.attrs({
  className: "dropzone"
})<DropContainerProps>`
  border: 1px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  width: 42.5%;
  height: 120px;
  margin-bottom: 15px;

  transition: height 0.2s ease;

  ${props => props.isDragActive && dragActive};
  ${props => props.isDragReject && dragReject};
`;

interface UploadMessageProps {
  type?: "default" | "error" | "success";
}

const messageColors = {
  default: "#999",
  error: "#e57878",
  success: "#78e5d5"
};

export const UploadMessage = styled.p<UploadMessageProps>`
  display: flex;
  color: ${props => messageColors[props.type || "default"]};
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

export const CloseButton = styled.button`
  background: none;
  color: #000; 
  border: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  font-family: Arial, sans-serif;
  margin: 3px 0 0 10px;

  &:hover {
    background: #black;
  }
`;

