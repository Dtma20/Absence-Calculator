from fastapi import APIRouter, UploadFile, File
from processamento_faltas import Processamento_faltas
from fastapi.responses import FileResponse

router = APIRouter()
processamento = Processamento_faltas()
df = None
df_month = None

@router.get("/init")
async def init():
    global df
    if df is not None:
        return df.to_dict(orient="list")
    else:
        return {"Nenhum arquivo foi carregado": ""}

@router.get("/count_for_month/{month}/{year}")
async def get_count_for_month(month: int, year: int):
    global df, df_month
    if df is not None:
        df_month = processamento.count_for_month(df, month, year)
        return df_month
    else:
        return {"Nenhum arquivo foi carregado": ""}

@router.post("/upload_file")
async def upload_file(File: UploadFile = File(...)):
    global df
    processamento.set_file(File.file)
    df = processamento.processar_dados_faltas()
    return df.to_dict(orient="list")

@router.post("/clean_data")
async def clean_data():
    global df
    df = processamento.clean_df(df)
    return {"Arquivo limpo com sucesso": ""}

@router.get("/download_faltas/{fileName}")
async def download_faltas(fileName: str):
    global df_month
    if df_month is not None:
        processamento.write_in_txt(df_month["Faltas"], fileName)
        return FileResponse(fileName, media_type='text/plain', filename=fileName)
    else:
        return {"Nenhum arquivo foi carregado": ""}
