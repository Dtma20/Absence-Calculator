'use client'
import React, { useEffect, useState } from 'react';
import {Table, Container, Button, Input} from '@mui/joy';
import { FileNameContext } from '@/components/Upload/FileNameContext';

function Tabela() {

    const [dados, setDados] = useState({});
    const [mes, setMes] = useState('');

    const get_month_number = (mes : string) => {
        switch(mes) {
            case 'Janeiro': return 1;
            case 'Fevereiro': return 2;
            case 'Mar\u00E7o': return 3;
            case 'Abril': return 4;
            case 'Maio': return 5;
            case 'Junho': return 6;
            case 'Julho': return 7;
            case 'Agosto': return 8;
            case 'Setembro': return 9;
            case 'Outubro': return 10;
            case 'Novembro': return 11;
            case 'Dezembro': return 12;
            default: return 0;
        }
    }
    const fileName = React.useContext(FileNameContext);
    const fetchData = () => {
        const mes_num = get_month_number(mes);
        fetch(`http://localhost:8000/count_for_month/${mes_num}/2024`)
            .then(response => response.json())
            .then(data => {
                setDados(data);
            })
            .catch(error => console.error('Erro:', error));
    };
    useEffect(() => {
        fetchData();
    }, [mes]);

    const maxLinhas = Math.max(...(Object.values(dados) as any[]).map((arr: any[]) => arr.length));

    return (
        <Container sx={{ maxWidth: '200%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Input onChange={(event : any) => setMes(event.target.value)} label="Mês" placeholder="Mês" sx={{width: '45%', mb: 2}}/>
            <Button onClick={() => window.open(`http://localhost:8000/download_faltas/${fileName?.split('.')[0] + ' ' + mes + '.txt'}`)} sx={{width: '45%', mb: 2}}>
                Baixar lista de faltas
            </Button>
            <Table aria-label="basic table">
                <thead>
                    <tr>
                        {Object.keys(dados).map((data, index) => (
                            <th key={index}>{data}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: maxLinhas }, (_, i) => (
                        <tr key={i}>
                            {Object.values(dados).map((value : any, index) => (
                                <td key={index}>{value[i] || 0}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Tabela;
