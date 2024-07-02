from datetime import datetime
import pandas as pd
import numpy as np
import PyPDF2
import re

class Processamento_faltas:
    def __init__(self):
        self.file = 'base.pdf'

    def set_file(self, file):
        self.file = file
    
    def clean_df(self, df):
        df = None
        return df

    def write_in_txt(self, df, fileName):
        with open(fileName, 'w') as f:
            for i in df:
                f.write(str(i) + '\n')

    def limit_date_repetition(self, dates, limit):
        date_count = {}
        limited_dates = []
        for date in dates:
            if date not in date_count:
                date_count[date] = 0
            if date_count[date] < limit:
                limited_dates.append(date)
                date_count[date] += 1
        return limited_dates

    def count_for_month(self, df, month, year):
        df.columns = pd.to_datetime(df.columns, format="%d/%m/%Y")
        mask = (df.columns.month == month) & (df.columns.year == year)
        df_month = df.loc[:, mask]
        contagem_F = df_month.apply(lambda row: row.str.count('F'), axis=1)
        lista_contagem_F = contagem_F.values.tolist()
        lista_final = []
        for i in lista_contagem_F:
            lista_final.append(sum(i))
        df.columns = pd.to_datetime(df.columns).strftime(f'%d/%m/%Y')
        df_month.columns = pd.to_datetime(df_month.columns).strftime(f'%d/%m/%Y')
        df_month['Faltas'] = lista_final
        df_month['Faltas'] = df_month['Faltas'].astype(int)

        return df_month.to_dict(orient="list")
    
    def get_dates(self, df):
        date_pattern = r'\b(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/((19|20)\d\d)\b'
        dates = df.iloc[:, 0].str.extractall(date_pattern)
        dates = dates[0] + '/' + dates[1] + '/' + dates[2]
        dates = dates.reset_index(level=1, drop=True)

        return dates
    
    def remove_from_line(self, df, keyword):
        indices = df[df[0].str.contains(keyword)].index
        df.drop(df.index[indices[0]:], inplace=True)
        return df
    
    def remove_lines(self, df, keyword, quantidade):
        indices = df[df[0].str.contains(keyword)].index
        for i in indices:
            df.drop(list(range(i, i + quantidade)), inplace=True, errors='ignore')
        df.reset_index(drop=True, inplace=True)

        return df
    
    def extract_text_from_pdf(self, file):
        pdf_reader = PyPDF2.PdfReader(file)
        texto = ""
        for page in pdf_reader.pages:
            texto += page.extract_text()

        return texto
    
    def create_dataframe_from_text(self, texto):
        linhas = texto.split('\n')
        df = pd.DataFrame(linhas)

        return df
    
    def process_registro(self, df):
        registro = re.findall(r'\b[A|E][P|F|-]*\b', df.to_string())
        registro = [item.replace('A', '').replace('E', '') for item in registro]

        return registro
    
    def process_datas(self, df, n):
        df = df.iloc[2:57]
        datas = self.get_dates(df)
        datas = self.limit_date_repetition(datas, n)
        datas = [datetime.strptime(data, f'%d/%m/%Y') for data in datas]
        datas.sort()
        datas = [data.strftime(f'%d/%m/%Y') for data in datas]

        return datas
    
    def create_final_dataframe(self, registro):
        df_final = pd.DataFrame()
        for string in registro:
            char_dict = {i: char for i, char in enumerate(string)}
            df_final = pd.concat([df_final, pd.DataFrame(char_dict, index=[0])], ignore_index=True)
        return df_final
    
    def check_duplicate_columns(self, df):
        df = df.loc[:, ~df.columns.duplicated()]
        return df
    
    def processar_dados_faltas(self):
        texto = self.extract_text_from_pdf(self.file)
        df = self.create_dataframe_from_text(texto)
        df = self.remove_lines(df, 'Legenda', 19)
        df = self.remove_lines(df, 'ESTADO DE ALAGOAS', 17)
        df = self.remove_from_line(df,'Observações')
        registro = self.process_registro(df)
        datas = self.process_datas(df, 2)
        df_final = self.create_final_dataframe(registro)
        df_final = df_final.replace(np.nan, '-', regex=True)
        df_final.columns = datas

        return df_final

