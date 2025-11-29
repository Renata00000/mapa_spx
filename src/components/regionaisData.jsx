// src/components/RegionaisData.jsx

export const regionaisData = {
  // Centro-Oeste
  'GO': [
    {
      id: 'go01',
      nome: 'GO 01 - Julio Neto',
      cidades: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde']
    }
  ],
  'DF': [
    {
      id: 'df01',
      nome: 'DF 01 - Flavio Fernandes',
      cidades: ['Brasília']
    }
  ],
  'MS': [
    {
      id: 'ms01',
      nome: 'MS 01 - Paulo Silvério',
      cidades: ['Campo Grande', 'Três Lagoas']
    }
  ],
  'MT': [
    {
      id: 'mt01',
      nome: 'MT 01 - Paulo Silvério',
      cidades: ['Ciuiabá']
    }
  ],

  // Norte
  'PA': [
    {
      id: 'pa01',
      nome: 'PA 01 - Paulo Silvério',
      cidades: ['Belém', 'Ananindeua']
    }
  ],
  'RO': [
    {
      id: 'ro01',
      nome: 'RO 01 - Paulo Silvério',
      cidades: ['Porto Velho']
    }
  ],
  'TO': [
    {
      id: 'to01',
      nome: 'TO 01 - Paulo Silvério',
      cidades: ['Palmas']
    }
  ],
  'AM': [
    {
      id: 'am01',
      nome: 'AM 01 - Julio Neto',
      cidades: ['Manaus']
    }
  ],

  // Minas Gerais
  'MG': [
    {
      id: 'mg01',
      nome: 'MG 01 - Flavio Fernandes',
      cidades: ['Barbacena', 'Divinópolis', 'Juiz de Fora', 'Lagoa da Prata', 'Muriaé', 'Ouro Branco', 'Sete Lagoas', 'São João Del Rei', 'São Lourenço', 'Ubá']
    },
    {
      id: 'mg02',
      nome: 'MG 02 - Marcos Vinicius',
      cidades: ['Extrema', 'Lavras', 'Paracatu', 'Passos', 'Patos de Minas', 'Poços de Caldas', 'Uberaba', 'Uberlândia', 'Varginha']
    },
    {
      id: 'mg03',
      nome: 'MG 03 - Paulo Silvério',
      cidades: ['Belo Horizonte', 'Betim', 'Contagem', 'Vespasiano']
    },
    {
      id: 'mg04',
      nome: 'MG 04 - Rogerio Siqueira',
      cidades: ['Curvelo', 'Governador Valadares', 'Ipatinga', 'Janaúba', 'João Monlevade', 'Manhuaçu', 'Montes Claros', 'Teófilo Otoni']
    }
  ],

  // Nordeste
  'BA': [
    {
      id: 'ba01',
      nome: 'BA 01 - Ailton Santos',
      cidades: ['Feira de Santana', 'Guanambi', 'Irecê', 'Juazeiro', 'Salvador', 'Santo Antônio de Jesus']
    },
    {
      id: 'ba02',
      nome: 'BA 02 - Tiago Amoedo',
      cidades: ['Alagoinhas', 'Barreiras', 'Camaçari', 'Itabuna', 'Salvador', 'Simões Filho', 'Vitória da Conquista']
    },
    {
      id: 'ba03',
      nome: 'BA 03 - Neucival Cardoso',
      cidades: ['Juazeiro']
    },
    {
      id: 'ba04',
      nome: 'BA 04 - Flavio Rodrigues',
      cidades: ['Eunápolis', 'Teixeira de Freitas']
    }
  ],
  'CE': [
    {
      id: 'ce01',
      nome: 'CE 01 - Alexandre Pinheiro',
      cidades: ['Caucaia', 'Fortaleza', 'Juazeiro do Norte', 'Sobral']
    }
  ],
  'PE': [
    {
      id: 'pe01',
      nome: 'PE 01 - Andre Carlos',
      cidades: ['Cabo de Santo Agostinho', 'Caruaru', 'Garanhuns', 'Jaboatão dos Guararapes', 'Muribeca', 'Recife']
    },
    {
      id: 'pe02',
      nome: 'PE 02 - Ricardo Alexandre',
      cidades: ['Carpina', 'Paulista', 'Recife']
    },
    {
      id: 'pe03',
      nome: 'PE 03 - Silvio Cesar/Bruna Paloma',
      cidades: ['Recife', 'Jaboatão dos Guararapes']
    }
  ],
  'PB': [
    {
      id: 'pb01',
      nome: 'PB 01 - Ricardo Alexandre',
      cidades: ['Campina Grande', 'João Pessoa']
    }
  ],
  'AL': [
    {
      id: 'al01',
      nome: 'AL 01 - Andre Carlos',
      cidades: ['Maceió', 'Arapraca']
    }
  ],
  'SE': [
    {
      id: 'se01',
      nome: 'SE 01 - Tiago Amoedo',
      cidades: ['Aracaju']
    }
  ],
  'MA': [
    {
      id: 'ma01',
      nome: 'MA 01 - Denysson Garcêz',
      cidades: ['São Luís']
    }
  ],
  'PI': [
    {
      id: 'pi01',
      nome: 'PI 01 - Denysson Garcêz',
      cidades: ['Teresina']
    }
  ],
  'RN': [
    {
      id: 'rn01',
      nome: 'RN 01 - Ricardo Alexandre',
      cidades: ['Natal']
    }
  ],

  // São Paulo - ESTRUTURA ESPECIAL COM INTERIOR E METROPOLITANA
  'SP': {
    // INTERIOR
    interior: [
      {
        id: 'spi1',
        nome: 'SPI 1 - Thiago Mina',
        cidades: ['Botucatu', 'Bragança Paulista', 'Campinas', 'Itapetininga', 'Itapeva', 'Jundiaí', 'Leme', 'Limeira', 'Mogi Mirim', 'Piracicaba', 'São João da Boa Vista', 'Sorocaba', 'Sumaré', 'Tatuí']
      },
      {
        id: 'spi2',
        nome: 'SPI 2 - Ana Priscila',
        cidades: ['Araraquara', 'Araçatuba', 'Assis', 'Barretos', 'Bauru', 'Franca', 'Ibitinga', 'Jales', 'Jaú', 'Marília', 'Presidente Prudente', 'Ribeirão Preto', 'São Carlos', 'São José do Rio Preto', 'Votuporanga']
      },
      {
        id: 'spi3',
        nome: 'SPI 3 - Vitor Vieira',
        cidades: ['Campinas', 'Louveira']
      },
      {
        id: 'spi4',
        nome: 'SPI 4 - Marcelo Rodrigues',
        cidades: ['Cravinhos']
      }
    ],
    // METROPOLITANA
    metropolitana: [
      {
        id: 'spm1',
        nome: 'SPM 1 - Giorgio Franchi',
        cidades: ['Caraguatatuba', 'Embu das Artes', 'Guaratinguetá', 'Guarujá', 'Guarulhos', 'Itapevi', 'Itaquaquecetuba', 'Mauá', 'Mogi das Cruzes', 'Osasco', 'Praia Grande', 'Registro', 'São Bernardo do Campo', 'São José Dos Campos', 'São Paulo', 'Taubaté']
      },
      {
        id: 'spm2',
        nome: 'SPM 2 - Vitor Vieira',
        cidades: ['Campinas']
      },
      {
        id: 'spm3',
        nome: 'SPM 3 - Caique Nascimento/Daiane Santos/Luiz Gustavo',
        cidades: ['Franco da Rocha']
      },
      {
        id: 'spm4',
        nome: 'SPM 4 - Enio Carlos/Reynaldo Fiamenghi',
        cidades: ['São Bernardo do Campo']
      },
      {
        id: 'spm5',
        nome: 'SPM 5 - Alessandra Assis/Samuel Vilaça',
        cidades: ['Santana de Parnaíba']
      },
      {
        id: 'spm6',
        nome: 'SPM 6 - Acilene Candido/Paulo Nunes',
        cidades: ['Guarulhos']
      }
    ]
  },

  // Sul
  'PR': [
    {
      id: 'pr01',
      nome: 'PR 01 - Ivan Matos',
      cidades: ['Campo Mourão', 'Cascavel', 'Curitiba', 'Foz do Iguaçu', 'Guarapuava', 'Londrina', 'Maringá', 'Paranaguá', 'Paravanai', 'Pato Branco', 'Pinhais', 'Ponta Grossa', 'Santo Antônio da Platina', 'Toledo', 'Umuarama']
    },
    {
      id: 'pr02',
      nome: 'PR 02 - Rafael Andreta',
      cidades: ['Curititba']
    }
  ],
  'SC': [
    {
      id: 'sc01',
      nome: 'SC 01 - Marcio Vargas',
      cidades: ['Blumenau', 'Chapecó', 'Criciúma', 'Florianópolis', 'Itajaí', 'Itapema', 'Joinville', 'Lages', 'Tubarão', 'Videira']
    }
  ],
  'RS': [
    {
      id: 'rs01',
      nome: 'RS 01 - Ederson Abreu',
      cidades: ['Bento Gonçalves', 'Campo Bom', 'Caxias do Sul', 'Gravataí', 'Lajeado', 'Osório', 'Passo Fundo', 'Pelotas', 'Porto Alegre', 'Santa Cruz do Sul', 'Santa Maria', 'Santa Rosa']
    },
    {
      id: 'rs02',
      nome: 'RS 02 - Daniela Souza',
      cidades: ['Gravataí']
    }
  ],

  // Rio de Janeiro e Espírito Santo
  'RJ': [
    {
      id: 'rj01',
      nome: 'RJ 01 - Geovane Oliveira',
      cidades: ['Angra dos Reis', 'Cabo Frio', 'Campos Dos Goytacazes', 'Duque de Caxias', 'Itaboraí', 'Itaguaí', 'Macae', 'Magé', 'Maricá', 'Nova Friburgo', 'Nova Iguaçu', 'Petrópolis', 'Resende', 'Rio de Janeiro', 'São Gonçalo', 'São João do Meriti', 'Teresópolis', 'Volta Redonda']
    },
    {
      id: 'rj02',
      nome: 'RJ 02 - Bruno Garcia',
      cidades: ['Duque de Caxias', 'São João do Meriti']
    }
  ],
  'ES': [
    {
      id: 'es01',
      nome: 'ES 01 - Eden Souza',
      cidades: ['Cachoeiro do Itapemirim', 'Cariacica', 'Colatina', 'Guarapari', 'Linhares', 'Serra', 'São Mateus', 'Vila Velha']
    }
  ]
};