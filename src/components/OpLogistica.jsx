// src/components/OpLogistica.jsx
import React, { useState, useEffect } from 'react';
import { X, MapPin, Building2, Truck, Package, Users, ChevronRight, ExternalLink } from 'lucide-react';
import MapaBrasil from './MapaBrasil';
import { regionaisData } from './regionaisData';


// Cores das regiões
const regionColors = {
  "n-ne": "#75db7e",        // Verde - Norte/Nordeste
  "co-mg": "#e6a65d",       // Laranja - Centro-Oeste/MG
  "rj-es": "#db7575",       // Vermelho/Rosa - RJ/ES
  "sul": "#b875db",         // Roxo - Sul
  "sp": "#829fee"           // Azul - São Paulo
};

const regionLabels = {
  "n-ne": "N/NE - Adolfo",
  "co-mg": "CO/MG - Pamplona",
  "rj-es": "RJ/ES - Guaracy",
  "sul": "SUL - Guaracy",
  "sp": "SP- (SPM - Gustavo) - (SPI - Guaracy)"
};

// Lista de estados (para converter sigla em nome)
const states = [
  { id: 'AC', name: 'Acre' },
  { id: 'AL', name: 'Alagoas' },
  { id: 'AM', name: 'Amazonas' },
  { id: 'AP', name: 'Amapá' },
  { id: 'BA', name: 'Bahia' },
  { id: 'CE', name: 'Ceará' },
  { id: 'DF', name: 'Distrito Federal' },
  { id: 'ES', name: 'Espírito Santo' },
  { id: 'GO', name: 'Goiás' },
  { id: 'MA', name: 'Maranhão' },
  { id: 'MG', name: 'Minas Gerais' },
  { id: 'MS', name: 'Mato Grosso do Sul' },
  { id: 'MT', name: 'Mato Grosso' },
  { id: 'PA', name: 'Pará' },
  { id: 'PB', name: 'Paraíba' },
  { id: 'PE', name: 'Pernambuco' },
  { id: 'PI', name: 'Piauí' },
  { id: 'PR', name: 'Paraná' },
  { id: 'RJ', name: 'Rio de Janeiro' },
  { id: 'RN', name: 'Rio Grande do Norte' },
  { id: 'RO', name: 'Rondônia' },
  { id: 'RR', name: 'Roraima' },
  { id: 'RS', name: 'Rio Grande do Sul' },
  { id: 'SC', name: 'Santa Catarina' },
  { id: 'SE', name: 'Sergipe' },
  { id: 'SP', name: 'São Paulo' },
  { id: 'TO', name: 'Tocantins' }
];

const OpLogistica = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [rocketFollowing, setRocketFollowing] = useState(false);
  const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 0 });
  const [mockData, setMockData] = useState({});
  const [generalTotals, setGeneralTotals] = useState({ hubs: 0, socs: 0, bigHubs: 0, fulfillments: 0, pudo: 0, ownfleet: 0 });
  const [selectedRegional, setSelectedRegional] = useState('todas');
  const [selectedSPTab, setSelectedSPTab] = useState('todas');

  // Foguete
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rocketFollowing) {
        setRocketPosition({ x: e.clientX, y: e.clientY });
      }
    };
    if (rocketFollowing) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [rocketFollowing]);

  const toggleRocket = () => {
    setRocketFollowing(!rocketFollowing);
  };

  // Mapeamento: nome completo do estado → sigla
 const nomeParaSigla = {
  "Acre": "AC",
  "Alagoas": "AL",
  "Amazonas": "AM",
  "Amapá": "AP",
  "Bahia": "BA",
  "Ceará": "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  "Espirito Santo": "ES",        // ← sem acento
  "Espirito Santo ": "ES",       // ← com espaço no final (segurança extra)
  "Goiás": "GO",
  "Maranhão": "MA",
  "Minas Gerais": "MG",
  "Mato Grosso do Sul": "MS",
  "Mato Grosso": "MT",
  "Pará": "PA",
  "Paraíba": "PB",
  "Pernambuco": "PE",
  "Piauí": "PI",
  "Paraná": "PR",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rondônia": "RO",
  "Roraima": "RR",
  "Rio Grande do Sul": "RS",
  "Santa Catarina": "SC",
  "Sergipe": "SE",
  "São Paulo": "SP",
  "Tocantins": "TO"
};

  // Função para calcular totais gerais
  const calculateGeneralTotals = (data) => {
    const totals = { hubs: 0, socs: 0, bigHubs: 0, fulfillments: 0, pudo: 0, ownfleet: 0 };
    Object.values(data).forEach(state => {
      state.cities.forEach(city => {
        Object.entries(city.units).forEach(([type, units]) => {
          units.forEach(unit => {
            // Conta no tipo principal
            totals[type] = (totals[type] || 0) + 1;
            // Se tiver subtipo, conta também
            if (unit.subtipo === 'pudo') totals.pudo++;
            if (unit.subtipo === 'ownfleet') totals.ownfleet++;
          });
        });
      });
    });
    return totals;
  };

  // Carregar dados do backend
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/units');
        const result = await response.json();
        if (result.success) {
          setMockData(result.data);
          const totals = calculateGeneralTotals(result.data);
          setGeneralTotals(totals);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const results = [];
    const searchTerm = query.toLowerCase();
    Object.entries(mockData).forEach(([stateId, stateData]) => {
      stateData.cities.forEach(city => {
        Object.entries(city.units).forEach(([unitType, units]) => {
          units.forEach(unit => {
            if (unit.name.toLowerCase().includes(searchTerm)) {
              results.push({
                ...unit,
                stateId,
                stateName: getStateName(stateId),
                cityId: city.id,
                cityName: city.name,
                unitType
              });
            }
          });
        });
      });
    });
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleSearchResultClick = (result) => {
    setSelectedState(result.stateId);
    setSelectedCity(result.cityId);
    setSelectedUnit(result);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleStateClick = (stateId) => {
    setSelectedState(stateId === selectedState ? null : stateId);
    setSelectedCity(null);
    setSelectedUnit(null);
    setFilterType(null);
  };

  const handleCityClick = (city) => {
    if (selectedCity?.id === city.id) {
      setSelectedCity(null);
    } else {
      setSelectedCity(city);
      setModalSearchQuery(''); // Limpar busca ao abrir nova cidade
    }
    setSelectedUnit(null);
    setFilterType(null);
  };

  const handleUnitClick = (unit, unitType = null) => {
    setSelectedUnit({ ...unit, unitType });
  };

  const handleUnitTypeFilter = (unitType) => {
    setFilterType(unitType);
  };

  const closeModal = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedUnit(null);
    setFilterType(null);
    setModalSearchQuery('');
  };

  // Fechar modal ao clicar fora
  const handleModalOutsideClick = (e) => {
    if (e.target.classList.contains('fixed')) {
      closeModal();
    }
  };

  const getStateName = (stateId) => {
    return states.find(state => state.id === stateId)?.name || stateId;
  };

  const getUnitTypeInfo = (type) => {
    const info = {
      hubs: { 
        icon: <Building2 className="w-6 h-6" />, 
        name: 'Hub', 
        color: 'bg-blue-500', 
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-700'
      },
      hubPudo: { 
        icon: <Building2 className="w-6 h-6" />, 
        name: 'Hub', 
        color: 'bg-blue-500', 
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-700'
      },
      hubOwnfleet: { 
        icon: <Building2 className="w-6 h-6" />, 
        name: 'Hub', 
        color: 'bg-blue-500', 
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-700'
      },
      socs: { 
        icon: <Users className="w-6 h-6" />, 
        name: 'SOC', 
        color: 'bg-green-500',
        bgColor: 'bg-green-50 border-green-200',
        textColor: 'text-green-700'
      },
      bigHubs: { 
        icon: <Truck className="w-6 h-6" />, 
        name: 'Big Hub', 
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50 border-purple-200',
        textColor: 'text-purple-700'
      },
      fulfillments: { 
        icon: <Package className="w-6 h-6" />, 
        name: 'Fulfillment', 
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-700'
      }
    };
    return info[type] || { icon: <MapPin className="w-6 h-6" />, name: type, color: 'bg-gray-500' };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Operando': return 'bg-green-100 text-green-800';
      case 'Fechado': return 'bg-red-100 text-red-800';
      case 'Em Abertura': return 'bg-blue-100 text-blue-800';
      case 'Novo': return 'bg-purple-100 text-purple-800';
      case 'Em Mudança': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para normalizar nomes de cidades (remove acentos, espaços, underscores, etc)
  const normalizeCityName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[_\s-]+/g, ' ') // Normaliza separadores
      .trim();
  };

  // Função para filtrar cidades por regional
  const getFilteredCitiesByRegional = (cities, stateId, regionalId, spTab = 'todas') => {
    if (regionalId === 'todas' && spTab === 'todas') return cities;
    
    const stateRegionals = regionaisData[stateId];
    if (!stateRegionals) return cities;
    
    // CASO ESPECIAL: SÃO PAULO
    if (stateId === 'SP') {
      if (stateRegionals.interior || stateRegionals.metropolitana) {
        let regionalsToFilter = [];
        
        if (spTab === 'interior') {
          regionalsToFilter = stateRegionals.interior || [];
        } else if (spTab === 'metropolitana') {
          regionalsToFilter = stateRegionals.metropolitana || [];
        } else {
          regionalsToFilter = [
            ...(stateRegionals.interior || []),
            ...(stateRegionals.metropolitana || [])
          ];
        }
        
        if (regionalId !== 'todas') {
          const regional = regionalsToFilter.find(r => r.id === regionalId);
          if (!regional) return cities;
          
          return cities.filter(city => {
            const cityNameNormalized = normalizeCityName(city.name);
            return regional.cidades.some(regionalCity => {
              const regionalCityNormalized = normalizeCityName(regionalCity);
              return regionalCityNormalized === cityNameNormalized;
            });
          });
        }
        
        const allCitiesInTab = regionalsToFilter.flatMap(r => r.cidades);
        return cities.filter(city => {
          const cityNameNormalized = normalizeCityName(city.name);
          return allCitiesInTab.some(regionalCity => {
            const regionalCityNormalized = normalizeCityName(regionalCity);
            return regionalCityNormalized === cityNameNormalized;
          });
        });
      }
    }
    
    if (regionalId === 'todas') return cities;
    
    const regional = stateRegionals.find(r => r.id === regionalId);
    if (!regional) return cities;
    
    return cities.filter(city => {
      const cityNameNormalized = normalizeCityName(city.name);
      return regional.cidades.some(regionalCity => {
        const regionalCityNormalized = normalizeCityName(regionalCity);
        return regionalCityNormalized === cityNameNormalized;
      });
    });
  };

  // Resetar filtro de regional ao trocar de estado
  useEffect(() => {
    setSelectedRegional('todas');
  }, [selectedState]);

  // Resetar aba SP ao trocar de estado
  useEffect(() => {
    setSelectedSPTab('todas');
  }, [selectedState]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-orange-100 border-b-orange-400 rounded-full animate-spin mx-auto my-1 opacity-60"></div>
          </div>
          <p className="mt-6 text-xl font-bold text-orange-600 animate-pulse">Carregando Op Logisticas SPX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-black p-8">
      {/* Cabeçalho */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <h1 className="flex-1 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 animate-pulse">
            ✈️ Locations - Security SPX Brasil
          </h1>
          <div className="flex-1 flex justify-end">
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-6 py-2 rounded-xl border border-white/30 transition-all duration-300 hover:scale-105"
            >
              🔐 Admin
            </a>
          </div>
        </div>
        <p className="text-xl text-orange-200 font-medium mb-4">
          Mapa do Brasil que Centraliza todas as unidades logisticas do pais
        </p>
        {/* Totais */}
        <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-500/40 mb-4">
          <span className="text-sm font-medium text-orange-200">Brasil Total:</span>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-white font-bold min-w-[2ch] text-right">{generalTotals.hubs}</span>
            <span className="text-xs text-blue-200">Hubs</span>
            {generalTotals.pudo > 0 && (
              <>
                <span className="text-xs text-blue-200">,</span>
                <span className="text-sm text-white font-bold min-w-[1ch] ml-1">{generalTotals.pudo}</span>
                <span className="text-xs text-blue-200">Pudo</span>
              </>
            )}
            {generalTotals.ownfleet > 0 && (
              <>
                <span className="text-xs text-blue-200">,</span>
                <span className="text-sm text-white font-bold min-w-[1ch] ml-1">{generalTotals.ownfleet}</span>
                <span className="text-xs text-blue-200">Ownfleet</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-white font-bold min-w-[2ch] text-right">{generalTotals.socs}</span>
            <span className="text-xs text-green-200">SOCs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-white font-bold min-w-[2ch] text-right">{generalTotals.bigHubs}</span>
            <span className="text-xs text-purple-200">Big Hubs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-white font-bold min-w-[2ch] text-right">{generalTotals.fulfillments}</span>
            <span className="text-xs text-orange-200">Fulfillments</span>
          </div>
          
          <div className="w-px h-6 bg-orange-400/50"></div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-yellow-400">
              {generalTotals.hubs + generalTotals.socs + generalTotals.bigHubs + generalTotals.fulfillments}
            </span>
            <span className="text-sm text-orange-200">total</span>
          </div>
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-gradient-to-br from-orange-400/20 to-red-500/20 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/30 shadow-2xl">
          {/* CAMPO DE PESQUISA */}
          <div className="max-w-xl mx-auto mb-6 relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="🔍 Buscar unidade..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-orange-300/50 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200/50 bg-white/80 backdrop-blur-sm shadow placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* RESULTADOS DA PESQUISA */}
            {showSearchResults && (
              <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl border border-orange-200 max-h-80 overflow-y-auto z-50">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-800">
                      {searchResults.length} resultado(s)
                    </h3>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.map((result, index) => {
                      const typeInfo = getUnitTypeInfo(result.unitType);
                      return (
                        <div
                          key={`${result.stateId}-${result.cityId}-${result.id}-${index}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1.5">
                                <div className={`p-1.5 ${typeInfo.color} text-white rounded-md`}>
                                  {React.cloneElement(typeInfo.icon, { className: "w-4 h-4" })}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-orange-600">
                                    {result.name}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    {result.cityName} - {result.stateName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 text-xs ml-8">
                                <span className={`px-2 py-0.5 rounded-full ${typeInfo.bgColor} ${typeInfo.textColor} font-medium`}>
                                  {typeInfo.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full ${getStatusColor(result.status)}`}>
                                  {result.status}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* MAPA DO BRASIL */}
          <div className="flex justify-center my-8 relative">
            <MapaBrasil 
              onEstadoClick={(nomeDoEstado) => {
                const sigla = nomeParaSigla[nomeDoEstado] || null;
                if (sigla && mockData[sigla]) {
                  handleStateClick(sigla);
                }
              }}
            />
            {/* Legenda do Mapa */}
            <div
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-orange-200 shadow-lg z-10"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">Regionais</h3>
              <div className="space-y-2">
                {Object.entries(regionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-md"
                      style={{ backgroundColor: regionColors[key] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Painel de Info do Estado Selecionado */}
          {selectedState && (
            <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 border-4 border-yellow-400 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 rounded-full p-4">
                    <span className="text-4xl font-extrabold text-red-800">{selectedState}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-white drop-shadow-lg">
                      {getStateName(selectedState)}
                    </h3>
                    <p className="text-yellow-200 font-bold">SELECTED • READY TO EXPLORE</p>
                  </div>
                </div>
                <button
                  onClick={() => handleStateClick(selectedState)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-red-800 font-extrabold px-8 py-4 rounded-xl text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  EXPLORAR →
                </button>
              </div>
            </div>
          )}
        </div>
        {/* MODAL PRINCIPAL (estado → cidade → unidade) */}
        {selectedState && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleModalOutsideClick}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-orange-200 max-w-6xl w-full max-h-[85vh] overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6" />
                  <div>
                    <h2 className="text-2xl font-bold">{getStateName(selectedState)}</h2>
                    <p className="opacity-90">Estado: {selectedState}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto max-h-[70vh]">
                {!selectedCity && !selectedUnit && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Cidades Disponíveis</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={modalSearchQuery}
                            onChange={(e) => setModalSearchQuery(e.target.value)}
                            placeholder="🔍 Buscar cidade ou unidade..."
                            className="w-64 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white placeholder-gray-400"
                          />
                          {modalSearchQuery && (
                            <button
                              onClick={() => setModalSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* Dropdown de Regionais */}
                        {regionaisData[selectedState] && (
                          <div className="relative">
                            <select
                              value={selectedRegional}
                              onChange={(e) => setSelectedRegional(e.target.value)}
                              className="px-4 py-2 text-sm rounded-lg border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white text-gray-700 font-medium cursor-pointer hover:border-orange-300 transition-colors"
                            >
                              <option value="todas">📍 Todas as Regionais</option>
                              {selectedState === 'SP' ? (
                                <>
                                  {selectedSPTab === 'todas' && (
                                    <>
                                      <optgroup label="Interior">
                                        {(regionaisData['SP'].interior || []).map(regional => (
                                          <option key={regional.id} value={regional.id}>
                                            {regional.nome}
                                          </option>
                                        ))}
                                      </optgroup>
                                      <optgroup label="Metropolitana">
                                        {(regionaisData['SP'].metropolitana || []).map(regional => (
                                          <option key={regional.id} value={regional.id}>
                                            {regional.nome}
                                          </option>
                                        ))}
                                      </optgroup>
                                    </>
                                  )}
                                  {selectedSPTab === 'interior' && (
                                    (regionaisData['SP'].interior || []).map(regional => (
                                      <option key={regional.id} value={regional.id}>
                                        {regional.nome}
                                      </option>
                                    ))
                                  )}
                                  {selectedSPTab === 'metropolitana' && (
                                    (regionaisData['SP'].metropolitana || []).map(regional => (
                                      <option key={regional.id} value={regional.id}>
                                        {regional.nome}
                                      </option>
                                    ))
                                  )}
                                </>
                              ) : (
                                regionaisData[selectedState].map(regional => (
                                  <option key={regional.id} value={regional.id}>
                                    {regional.nome}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-xl border">
                          <span className="text-sm font-medium text-gray-600">Legenda:</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Hubs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">SOCs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Big Hubs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Fulfillments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Abas especiais para São Paulo */}
                    {selectedState === 'SP' && (
                      <div className="mb-6 flex justify-center">
                        <div className="inline-flex bg-gray-100 rounded-xl p-1 border border-gray-200">
                          <button
                            onClick={() => {
                              setSelectedSPTab('todas');
                              setSelectedRegional('todas');
                            }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                              selectedSPTab === 'todas'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                          >
                            📍 Todas SP
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSPTab('interior');
                              setSelectedRegional('todas');
                            }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                              selectedSPTab === 'interior'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                          >
                            🌳 Interior (SPI)
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSPTab('metropolitana');
                              setSelectedRegional('todas');
                            }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                              selectedSPTab === 'metropolitana'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                          >
                            🏙️ Metropolitana (SPM)
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredCitiesByRegional(
                        mockData[selectedState]?.cities || [],
                        selectedState,
                        selectedRegional,
                        selectedSPTab
                      )
                        .filter(city => {
                          if (!modalSearchQuery.trim()) return true;
                          const searchLower = modalSearchQuery.toLowerCase();
                          if (city.name.toLowerCase().includes(searchLower)) return true;
                          const hasMatchingUnit = Object.values(city.units).flat().some(unit => 
                            unit.name.toLowerCase().includes(searchLower)
                          );
                          return hasMatchingUnit;
                        })
                        .map((city) => {
                        const totalUnits = Object.values(city.units).flat().length;
                        return (
                          <div
                            key={city.id}
                            onClick={() => handleCityClick(city)}
                            className="group bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-orange-300"
                          >
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                                <MapPin className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-gray-800">{city.name}</h4>
                                <p className="text-sm text-gray-500">{totalUnits} unidades disponíveis</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                {Object.entries(city.units).map(([type, units]) => {
                                  if (units.length === 0) return null;
                                  const typeInfo = getUnitTypeInfo(type);
                                  return (
                                    <div 
                                      key={type} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCityClick(city);
                                        setFilterType(type);
                                      }}
                                      className={`px-3 py-2 rounded-full text-sm font-bold cursor-pointer transform hover:scale-110 hover:shadow-lg transition-all duration-300 ${typeInfo.bgColor} ${typeInfo.textColor} hover:z-10 relative`}
                                      title={`Ver apenas ${typeInfo.name}`}
                                    >
                                      {units.length}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400 group-hover:text-orange-600 transition-colors">
                                <span className="text-sm font-medium">Clique para explorar</span>
                                <ChevronRight className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedCity && !selectedUnit && (
                  <div>
                    <div className="flex items-center space-x-4 mb-8">
                      <button
                        onClick={() => {setSelectedCity(null); setFilterType(null); setModalSearchQuery('');}}
                        className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 font-medium"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        <span>Voltar</span>
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedCity?.name}
                      </h3>
                      <div className="flex-1 flex justify-end">
                        <div className="relative w-64">
                          <input
                            type="text"
                            value={modalSearchQuery}
                            onChange={(e) => setModalSearchQuery(e.target.value)}
                            placeholder="🔍 Buscar unidade..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white placeholder-gray-400"
                          />
                          {modalSearchQuery && (
                            <button
                              onClick={() => setModalSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {filterType && (
                        <>
                          <div className="w-px h-6 bg-gray-300"></div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-medium text-gray-600">Filtro:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getUnitTypeInfo(filterType).bgColor} ${getUnitTypeInfo(filterType).textColor}`}>
                              {getUnitTypeInfo(filterType).name}
                            </span>
                            <button
                              onClick={() => setFilterType(null)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Remover filtro"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="grid gap-8">
                      {Object.entries(mockData[selectedState]?.cities.find(c => c.id === selectedCity.id)?.units || {}).map(([unitType, units]) => {
                        if (units.length === 0 || (filterType && filterType !== unitType)) return null;
                        
                        const filteredUnits = units.filter(unit => {
                          if (!modalSearchQuery.trim()) return true;
                          return unit.name.toLowerCase().includes(modalSearchQuery.toLowerCase());
                        });
                        if (filteredUnits.length === 0) return null;
                        const typeInfo = getUnitTypeInfo(unitType);
                        return (
                          <div key={unitType} className={`p-6 rounded-2xl border-2 ${typeInfo.bgColor}`}>
                            <div className="flex items-center space-x-3 mb-6">
                              <div className={`p-3 ${typeInfo.color} text-white rounded-xl`}>
                                {typeInfo.icon}
                              </div>
                              <div>
                                <h4 className={`text-xl font-bold ${typeInfo.textColor}`}>{typeInfo.name}</h4>
                                <p className="text-sm text-gray-600">{filteredUnits.length} unidade(s)</p>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              {filteredUnits.map((unit) => (
                                <div
                                  key={unit.id}
                                  onClick={() => handleUnitClick(unit, unitType)}
                                  className={`p-5 rounded-xl border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group relative ${
                                    unit.subtipo === 'pudo' || unit.subtipo === 'ownfleet'
                                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-300 hover:border-amber-500 hover:shadow-amber-200'
                                      : 'bg-white border-gray-200 hover:border-orange-300'
                                  }`}
                                >
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-4 h-4 text-orange-500" />
                                  </div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                                        {unit.name}
                                      </h5>
                                      {unit.subtipo === 'pudo' && (
                                        <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-md">
                                          PUDO
                                        </span>
                                      )}
                                      {unit.subtipo === 'ownfleet' && (
                                        <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-md">
                                          OWNFLEET
                                        </span>
                                      )}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                                      {unit.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">Site Líder: {unit.siteLider}</p>
                                  <p className="text-xs text-gray-500">{unit.gr}</p>
                                  <div className="mt-3 text-xs text-gray-400 group-hover:text-orange-500 transition-colors">
                                    Clique para ver detalhes →
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedUnit && (
                  <div>
                    <div className="flex items-center space-x-4 mb-8">
                      <button
                        onClick={() => setSelectedUnit(null)}
                        className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 font-medium"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        <span>Voltar</span>
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-2xl font-bold text-gray-800">{selectedUnit.name}</h3>
                          {selectedUnit.unitType === 'hubPudo' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                              HUB + PUDO
                            </span>
                          )}
                          {selectedUnit.unitType === 'hubOwnfleet' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                              HUB + OWNFLEET
                            </span>
                          )}
                        </div>
                        {selectedUnit.endereco && (
                          <p className="text-sm text-gray-600 mt-1">{selectedUnit.endereco}</p>
                        )}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedUnit.status)}`}>
                        ● {selectedUnit.status}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200">
                      {/* Grid de 3 colunas para organizar melhor */}
                      <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* COLUNA 1: Operação */}
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-orange-300">⚙️ Operação</h4>
                          <div className="space-y-4">
                            {selectedUnit.qtdPostosGr && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Postos GR</p>
                                <p className="font-bold text-gray-800">{selectedUnit.qtdPostosGr}</p>
                              </div>
                            )}
                            {selectedUnit.qtdPostosVig && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Postos VIG</p>
                                <p className="font-bold text-gray-800">{selectedUnit.qtdPostosVig}</p>
                              </div>
                            )}
                            {selectedUnit.qtdCamerasIntelbras && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Câmeras Intelbras</p>
                                <p className="font-bold text-gray-800">{selectedUnit.qtdCamerasIntelbras}</p>
                              </div>
                            )}
                            {selectedUnit.qtdCamerasDss && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Câmeras DSS</p>
                                <p className="font-bold text-gray-800">{selectedUnit.qtdCamerasDss}</p>
                              </div>
                            )}
                            {selectedUnit.qtdSensores && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Sensores</p>
                                <p className="font-bold text-gray-800">{selectedUnit.qtdSensores}</p>
                              </div>
                            )}
                            {selectedUnit.statusBotaoPanico && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Botão de Pânico</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                  selectedUnit.statusBotaoPanico === 'Operante' ? 'bg-green-100 text-green-800' :
                                  selectedUnit.statusBotaoPanico === 'Inoperante' ? 'bg-red-100 text-red-800' :
                                  selectedUnit.statusBotaoPanico === 'Sem Bateria' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {selectedUnit.statusBotaoPanico}
                                </span>
                              </div>
                            )}
                            {selectedUnit.dentroCondominio && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Condomínio</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedUnit.dentroCondominio === 'SIM' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {selectedUnit.dentroCondominio}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* COLUNA 2: Responsáveis */}
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-orange-300">👥 Responsáveis</h4>
                          <div className="space-y-4">
                            {selectedUnit.siteLider && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Site Líder</p>
                                <p className="font-bold text-gray-800">{selectedUnit.siteLider}</p>
                              </div>
                            )}
                            {selectedUnit.coordenadorT1 && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Coordenador T1</p>
                                <p className="font-bold text-gray-800">{selectedUnit.coordenadorT1}</p>
                              </div>
                            )}
                            {selectedUnit.coordenadorT2 && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Coordenador T2</p>
                                <p className="font-bold text-gray-800">{selectedUnit.coordenadorT2}</p>
                              </div>
                            )}
                            {selectedUnit.analistaTurno1 && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Analista Turno 1</p>
                                <p className="font-bold text-gray-800">{selectedUnit.analistaTurno1}</p>
                              </div>
                            )}
                            {selectedUnit.analistaTurno2 && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Analista Turno 2</p>
                                <p className="font-bold text-gray-800">{selectedUnit.analistaTurno2}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* COLUNA 3: Contatos */}
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-orange-300">📞 Contatos</h4>
                          <div className="space-y-4">
                            {selectedUnit.telefoneCorporativo && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Package className="w-4 h-4 text-orange-600" />
                                  <p className="text-xs text-gray-500">Telefone Corporativo</p>
                                </div>
                                <p className="font-bold text-gray-800">{selectedUnit.telefoneCorporativo}</p>
                              </div>
                            )}
                            {selectedUnit.marcadorVigilanteGr && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Marcador Vigilante/GR</p>
                                <p className="font-bold text-gray-800">{selectedUnit.marcadorVigilanteGr}</p>
                              </div>
                            )}
                            {selectedUnit.vigilanteLider && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Vigilante Líder</p>
                                <p className="font-bold text-gray-800">{selectedUnit.vigilanteLider}</p>
                              </div>
                            )}
                            {selectedUnit.email && (
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Email</p>
                                <p className="font-bold text-gray-800">{selectedUnit.email}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Endereço completo */}
                      {selectedUnit.endereco && (
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl border-2 border-orange-300">
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-6 h-6 text-orange-600 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-sm font-bold text-gray-700">📍 Endereço Completo</p>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUnit.endereco)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                >
                                  <ExternalLink className="w-4 h-4 inline" /> Abrir no Google Maps
                                </a>
                              </div>
                              <p className="text-gray-800 leading-relaxed">{selectedUnit.endereco}</p>
                              {selectedUnit.cep && (
                                <p className="text-gray-600 mt-1">CEP: {selectedUnit.cep}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* FOGUETE INTERATIVO */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={toggleRocket}
          className={`w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 border-2 border-orange-400/50 ${!rocketFollowing ? 'animate-bounce' : ''}`}
        >
          {!rocketFollowing && <span className="text-2xl">🚀</span>}
        </button>
      </div>
      {rocketFollowing && (
        <>
          <div className="fixed pointer-events-none z-40" style={{ left: `${rocketPosition.x + 30}px`, top: `${rocketPosition.y + 15}px`, transform: 'translate(-50%, -50%)' }}>
            <div className="absolute w-12 h-12 bg-orange-400 rounded-full opacity-20 animate-ping"></div>
          </div>
          <div className="fixed pointer-events-none z-40" style={{ left: `${rocketPosition.x + 40}px`, top: `${rocketPosition.y + 10}px`, transform: 'translate(-50%, -50%)' }}>
            <div className="absolute w-8 h-8 bg-gray-500 rounded-full opacity-30 animate-pulse"></div>
          </div>
          <div className="fixed pointer-events-none z-40" style={{ left: `${rocketPosition.x + 25}px`, top: `${rocketPosition.y + 20}px`, transform: 'translate(-50%, -50%)' }}>
            <div className="absolute w-6 h-6 bg-yellow-400 rounded-full opacity-25 animate-ping" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="fixed pointer-events-none z-50" style={{ left: `${rocketPosition.x}px`, top: `${rocketPosition.y}px`, transform: 'translate(-50%, -50%) scaleX(-1) rotate(-45deg)' }}>
            <span className="text-4xl drop-shadow-2xl">🚀</span>
          </div>
        </>
      )}
    </div>
  );
};

export default OpLogistica;