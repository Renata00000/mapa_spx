// spx-backend/server.js
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Carregar credenciais de variável de ambiente OU arquivo local
let CREDENTIALS;
if (process.env.GOOGLE_CREDENTIALS) {
  // Em produção (Vercel, Netlify, etc) - usa variável de ambiente
  console.log('✅ Usando credenciais da variável de ambiente');
  CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} else {
  // Em desenvolvimento local - usa arquivo
  console.log('✅ Usando credenciais do arquivo local');
  const CREDENTIALS_PATH = path.join(__dirname, 'mapa-476018.json');
  try {
    const credentialsData = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    CREDENTIALS = JSON.parse(credentialsData);
  } catch (err) {
    console.error('❌ Erro: Não encontrou credenciais!');
    console.error('   Configure a variável GOOGLE_CREDENTIALS ou adicione mapa-476018.json');
    process.exit(1);
  }
}

const SPREADSHEET_ID = '1D7TEU52PmyCJB6oSlxX_Jrmt8iavvC62afGuaUZKYKY';
const SHEET_NAME = 'STATUS';

const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

function mapTipo(tipo) {
  if (!tipo) return 'hubs';
  const t = tipo.toUpperCase().trim();
  
  let resultado;
  if (t === 'FF' || t.includes('FULFILL') || t.includes('FUL')) {
    resultado = 'fulfillments';
  } else if (t.includes('BIG')) {
    resultado = 'bigHubs';
  } else if (t.includes('SOC') || t === 'SCG') {
    resultado = 'socs';
  } else if (t.includes('PUDO')) {
    resultado = 'hubPudo';
  } else if (t.includes('OWNFLEET')) {
    resultado = 'hubOwnfleet';
  } else if (t.includes('HUB')) {
    resultado = 'hubs';
  } else {
    console.log('⚠️ Tipo desconhecido:', tipo);
    resultado = 'hubs';
  }
  
  if (resultado === 'fulfillments') {
    console.log(`✅ FF encontrado: "${tipo}" → ${resultado}`);
  }
  
  return resultado;
}

// Função para identificar se é um hub especial
function getSubtipo(tipo) {
  if (!tipo) return null;
  const t = tipo.toUpperCase().trim();
  
  if (t.includes('PUDO')) return 'pudo';
  if (t.includes('OWNFLEET')) return 'ownfleet';
  return null;
}

function mapStatus(status) {
  if (!status) return 'Operando';
  const s = status.toUpperCase();
  if (s.includes('FECHADO')) return 'Fechado';
  if (s.includes('ABERTURA')) return 'Em Abertura';
  if (s.includes('MUDANÇA')) return 'Em Mudança';
  return 'Operando';
}

// GET
app.get('/api/units', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:AK`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return res.json({ success: true, data: {} });
    }

    const headers = rows[0];
    const colMap = {};
    headers.forEach((header, i) => {
      colMap[header] = i;
    });

    const units = rows.slice(1)
      .map((row, i) => {
        if (!row[colMap['SORT CODE']]) return null;
        
        const tipoOriginal = row[colMap['TIPO']] || '';
        const tipo = mapTipo(tipoOriginal);
        const subtipo = getSubtipo(tipoOriginal);
        
        return {
          id: `row-${i + 2}`,
          name: row[colMap['SORT CODE']] || '',
          tipo: tipo === 'hubPudo' || tipo === 'hubOwnfleet' ? 'hubs' : tipo, // Para o mapa
          tipoExibicao: tipoOriginal, // Para o admin mostrar o original da planilha
          subtipo: subtipo, // 'pudo', 'ownfleet' ou null
          estado: row[colMap['UF']] || '',
          cidade: row[colMap['HUB | SOC']] || '',
          endereco: row[colMap['ENDEREÇO']] || '',
          cep: row[colMap['CEP']] || '',
          status: mapStatus(row[colMap['STATUS']] || ''),
          siteLider: row[colMap['SITE LÍDER']] || '',
          siteLeaderLm: row[colMap['SITE LEADER LM']] || '',
          grTurno1: row[colMap['GR TURNO 1']] || '',
          grTurno2: row[colMap['GR TURNO 2']] || '',
          analistaTurno1: row[colMap['ANALISTA TURNO 1']] || '',
          analistaTurno2: row[colMap['ANALISTA TURNO 2']] || '',
          telefone: row[colMap['TELEFONE']] || '',
          telefone2: row[colMap['TELEFONE 2']] || '',
          horarioFuncionamento: row[colMap['HORÁRIO DE FUNCIONAMENTO']] || '',
          horarioAxGrVig: row[colMap['HORÁRIO COM AX GR/VIG']] || '',
          dentroCondominio: (row[colMap['DENTRO DE CONDOMÍNIO']] || 'NÃO').toUpperCase(),
          grupoWhatsapp: (row[colMap['GRUPO NO WHATSAPP']] || 'NÃO').toUpperCase(),
          dataAbertura: row[colMap['DATA ABERTURA']] || null,
          dataFechamento: row[colMap['DATA FECHAMENTO']] || null,
          qtdPostosGr: row[colMap['QTD POSTOS GR']] || '',
          qtdPostosVig: row[colMap['QTD POSTOS VIG']] || '',
          coordenadorT1: row[colMap['COORDENADOR T1']] || '',
          coordenadorT2: row[colMap['COORDENADOR T2']] || '',
          telefoneCorporativo: row[colMap['TELEFONE CORPORATIVO']] || '',
          marcadorVigilanteGr: row[colMap['MARCADOR VIGILANTE/GR']] || '',
          vigilanteLider: row[colMap['VIGILANTE LÍDER']] || '',
          qtdCamerasIntelbras: row[colMap['QTD CÂMERAS INTELBRAS']] || '',
          qtdCamerasDss: row[colMap['QTD CÂMERAS DSS']] || '',
          qtdSensores: row[colMap['QTD SENSORES']] || '',
          statusBotaoPanico: row[colMap['STATUS BOTÃO DE PÂNICO']] || '',
          cp: row[colMap['CP']] || '',
          email: row[colMap['EMAIL']] || ''
        };
      })
      .filter(Boolean);

    // Log para debug - mostra quantos de cada tipo foram encontrados
    const tipoCount = {};
    units.forEach(u => {
      tipoCount[u.tipo] = (tipoCount[u.tipo] || 0) + 1;
    });
    console.log('📊 Totais por tipo:', tipoCount);

    const grouped = {};
    units.forEach(u => {
      if (!grouped[u.estado]) grouped[u.estado] = { cities: [] };
      let city = grouped[u.estado].cities.find(c => c.name === u.cidade);
      if (!city) {
        city = {
          id: u.cidade.toLowerCase().replace(/\s+/g, '-'),
          name: u.cidade,
          units: { hubs: [], socs: [], bigHubs: [], fulfillments: [] }
        };
        grouped[u.estado].cities.push(city);
      }
      
      if (u.tipo in city.units) {
        city.units[u.tipo].push(u);
      } else {
        console.log('⚠️ Tipo não encontrado nas units:', u.tipo, 'para unidade:', u.name);
        city.units.hubs.push(u);
      }
    });

    res.json({ success: true, data: grouped });
  } catch (error) {
    console.error('Erro no backend (GET):', error);
    res.status(500).json({ success: false, error: 'Falha ao carregar dados' });
  }
});

// POST
app.post('/api/units', async (req, res) => {
  try {
    const unit = req.body;

    const tipoPlanilha = 
      unit.tipo === 'bigHubs' ? 'BIG HUB' :
      unit.tipo === 'socs' ? 'SOC' :
      unit.tipo === 'fulfillments' ? 'FULFILLMENT' :
      unit.tipo === 'ownfleet' ? 'OWNFLEET' :
      unit.tipo === 'pudo' ? 'PUDO' :
      'HUB';

    const newRow = [
      unit.status || 'Operando',
      tipoPlanilha,
      unit.name || '',
      unit.cp || '',
      unit.cidade || '',
      unit.estado || '',
      unit.endereco || '',
      unit.cep || '',
      unit.analistaTurno1 || unit.analista || '',
      unit.siteLeaderLm || '',
      unit.horarioFuncionamento || '',
      unit.dentroCondominio || 'NÃO',
      unit.grupoWhatsapp || 'NÃO',
      unit.horarioAxGrVig || '',
      unit.siteLider || '',
      unit.telefone || '',
      unit.telefone2 || '',
      unit.dataAbertura || '',
      unit.dataFechamento || '',
      unit.grTurno1 || '',
      unit.grTurno2 || '',
      unit.analistaTurno2 || '',
      unit.qtdPostosGr || '',
      unit.qtdPostosVig || '',
      unit.coordenadorT1 || '',
      unit.coordenadorT2 || '',
      unit.telefoneCorporativo || '',
      unit.marcadorVigilanteGr || '',
      unit.vigilanteLider || '',
      unit.qtdCamerasIntelbras || '',
      unit.qtdCamerasDss || '',
      unit.qtdSensores || '',
      unit.statusBotaoPanico || '',
      unit.email || ''
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:AK`,
      valueInputOption: 'RAW',
      resource: { values: [newRow] }
    });

    res.json({ success: true, message: 'Unidade adicionada com sucesso!' });
  } catch (error) {
    console.error('Erro no backend (POST):', error);
    res.status(500).json({ success: false, error: 'Falha ao adicionar unidade' });
  }
});

// DELETE
app.delete('/api/units/:rowIndex', async (req, res) => {
  try {
    const rowIndex = parseInt(req.params.rowIndex);
    if (isNaN(rowIndex) || rowIndex < 2) {
      return res.status(400).json({ success: false, error: 'Índice inválido' });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex
            }
          }
        }]
      }
    });

    res.json({ success: true, message: 'Unidade excluída com sucesso!' });
  } catch (error) {
    console.error('Erro no backend (DELETE):', error);
    res.status(500).json({ success: false, error: 'Falha ao excluir unidade' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api/units`);
});