import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { DropContainer, UploadMessage, CloseButton } from "./style";
import { Container } from "@mui/joy";
import { FileNameContext } from './FileNameContext';

interface UploadProps {
  onUpload: (files: File[]) => void;
}

export default class Upload extends Component<UploadProps> {


  handleOnClose = () => {
      this.cleanData();
      this.setState({ fileName: '', fileSelected: false });
  }

  cleanData = () => {
    fetch('http://localhost:8000/clean_data', {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            this.setState({ fileName: 'Nenhum arquivo foi carregado', fileSelected: false });
        }
    })
    .catch(error => console.error('Erro:', error));
  };

  state = {
    fileName: '',
    fileSelected: false,
  };

  handleOnDrop = (files: File[]) => {
    this.setState({ fileName: files[0].name, fileSelected: true });
    this.props.onUpload(files);
  }

  renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) {
      return <UploadMessage>Arraste o arquivo ou click</UploadMessage>;
    }
    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado, somente arquivos .pdf</UploadMessage>;
    }
    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>;
  };

  render() {
    const { fileSelected, fileName } = this.state;
    return (
      <FileNameContext.Provider value={fileName}>
          {!fileSelected ? (
            <Dropzone accept={{ "application/pdf": [".pdf"] }} onDropAccepted={this.handleOnDrop}>
              {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                <DropContainer
                  {...getRootProps()}
                  isDragActive={isDragActive}
                  isDragReject={isDragReject}
                >
                  <input {...getInputProps()} />
                  {this.renderDragMessage(isDragActive, isDragReject)}
                </DropContainer>
              )}
            </Dropzone>
          ) : (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px'}}>
              <UploadMessage type="success">Arquivo selecionado: {fileName}</UploadMessage>
              <CloseButton onClick={this.handleOnClose}>X</CloseButton>
            </Container>
          )}
      </FileNameContext.Provider>
    );
  }
}
