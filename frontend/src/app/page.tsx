"use client"
import Container from "@mui/joy/Container";
import Tabela from "./main/page";
import Upload from "@/components/Upload";
import { FileNameContext } from "@/components/Upload/FileNameContext";
import { useState } from "react";

export default function Home() {

    const [fileName, setFileName] = useState('');

    const handleUpload = (acceptedFiles: File[]) => {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        setFileName(acceptedFiles[0].name);

        fetch('http://localhost:8000/upload_file', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .catch(error => console.error('Erro:', error));
    };

    
    return (
    <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <FileNameContext.Provider value={fileName}>
            <h1>Calcular Faltas</h1>
            <Upload onUpload={handleUpload}/>
            <Tabela />
        </FileNameContext.Provider>
    </Container>
    );
}