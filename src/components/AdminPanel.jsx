// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, Eye, EyeOff, Lock, Calendar, Search } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(1);
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]); // ← Novo estado para busca
  const [searchTerm, setSearchTerm] = useState(''); // ← Novo estado para termo de busca
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const CORRECT_PASSWORD = 'spxadmin2024';

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/units');
      const result = await response.json();
      if (result.success) {
        const flatUnits = [];
        Object.values(result.data).forEach(state => {
          state.cities.forEach(city => {
            Object.values(city.units).flat().forEach(unit => {
              flatUnits.push(unit);
            });
          });
        });
        setUnits(flatUnits);
        setFilteredUnits(flatUnits); // ← Inicializa com todos
      }
    } catch (err) {
      console.error('Erro ao carregar unidades:', err);
    }
  };

  // Filtro em tempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUnits(units);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUnits(
        units.filter(unit =>
          unit.name.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, units]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnits();
    }
  }, [isAuthenticated]);

  const handleAddNew = () => {
    setIsEditing(false);
    setEditingUnit(null);
    setCurrentTab(1);
    setFormData({
      estado: '', cidade: '', tipo: 'hubs', name: '', endereco: '', cep: '', email: '',
      qtdPostosGr: '', qtdPostosVg: '',
      qtdCameras: '', empresaCameras: 'INTELBRAS',
      qtdSensores: '', empresaSensores: 'INTELBRAS',
      statusBotaoPanico: '', dentroCondominio: 'NÃO',
      siteLider: '', coordenadorT1: '', coordenadorT2: '',
      analistaTurno1: '', analistaTurno2: '',
      status: 'Operando',
      dataAbertura: new Date().toISOString().split('T')[0], dataFechamento: null
    });
    setShowModal(true);
  };

  const handleEdit = (unit) => {
    setIsEditing(true);
    setEditingUnit(unit);
    setCurrentTab(1);
    setFormData(unit);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      setUnits(units.filter(u => u.id !== id));
      setFilteredUnits(filteredUnits.filter(u => u.id !== id));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        alert('Unidade salva com sucesso na planilha!');
        setShowModal(false);
        fetchUnits();
      } else {
        alert('Erro ao salvar: ' + result.error);
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
        alert('Falha ao salvar a unidade.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    if (field === 'status' && value === 'Fechado' && !formData.dataFechamento) {
      newData.dataFechamento = new Date().toISOString().split('T')[0];
    }
    if (field === 'status' && value !== 'Fechado') {
      newData.dataFechamento = null;
    }
    setFormData(newData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
              <Lock className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel Administrativo</h1>
            <p className="text-gray-600">SPX Logística - Acesso Restrito</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha de Acesso</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Digite a senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">{error}</div>
            )}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Função para obter cor do tipo
  const getTipoColor = (tipo) => {
    // Normalizar para maiúsculas para comparação
    const tipoUpper = tipo?.toUpperCase() || '';
    
    if (tipoUpper === 'HUBS' || tipoUpper === 'HUB') return 'bg-blue-100 text-blue-800';
    if (tipoUpper === 'SOCS' || tipoUpper === 'SOC') return 'bg-green-100 text-green-800';
    if (tipoUpper === 'BIGHUBS' || tipoUpper === 'BIGHUB' || tipoUpper === 'BIG HUB' || tipoUpper === 'BIG HUBS') return 'bg-purple-100 text-purple-800';
    if (tipoUpper === 'FULFILLMENTS' || tipoUpper === 'FULFILLMENT' || tipoUpper === 'FF') return 'bg-orange-100 text-orange-800';
    if (tipoUpper.includes('PUDO')) return 'bg-pink-100 text-pink-800'; // ← Rosa
    if (tipoUpper.includes('OWNFLEET')) return 'bg-teal-100 text-teal-800'; // ← Teal (verde-azulado como no print)
    
    return 'bg-gray-100 text-gray-800';
  };

  const getTipoLabel = (tipo) => {
    const tipoUpper = tipo?.toUpperCase() || '';
    
    const labels = {
      'HUBS': 'Hub',
      'HUB': 'Hub',
      'SOCS': 'SOC',
      'SOC': 'SOC',
      'BIGHUBS': 'Big Hub',
      'BIG HUB': 'Big Hub',
      'FULFILLMENTS': 'Fulfillment',
      'FULFILLMENT': 'Fulfillment',
      'FF': 'Fulfillment', // ← FF vira Fulfillment
      'HUBPUDO': 'PUDO',
      'HUB PUDO': 'PUDO',
      'PUDO': 'PUDO',
      'HUB - PUDO': 'PUDO',
      'HUBOWNFLEET': 'OWNFLEET',
      'HUB OWNFLEET': 'OWNFLEET',
      'OWNFLEET': 'OWNFLEET',
      'HUB - OWNFLEET': 'OWNFLEET'
    };
    
    return labels[tipoUpper] || tipo;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operando': return 'bg-green-100 text-green-800';
      case 'Fechado': return 'bg-red-100 text-red-800';
      case 'Em Abertura': return 'bg-blue-100 text-blue-800';
      case 'Em Mudança': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🚚 Painel Administrativo</h1>
              <p className="text-orange-100">Gerenciar Unidades Logísticas</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-white font-bold">{units.length} unidades</p>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-50 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 mb-6"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Nova Unidade</span>
        </button>

        {/* Campo de busca por nome */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-white mb-2">🔍 Buscar unidade por nome</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome da unidade..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow placeholder-gray-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {filteredUnits.length === 0 ? (
            <p className="text-gray-600 text-center py-8 px-4">Nenhuma unidade encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-100 to-red-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Cidade</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Site Líder</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Data Abertura</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTipoColor(unit.tipoExibicao || unit.tipo)}`}>
                          {getTipoLabel(unit.tipoExibicao || unit.tipo)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{unit.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{unit.estado}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{unit.cidade}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(unit.status)}`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{unit.siteLider}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(unit.dataAbertura)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handleEdit(unit)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(unit.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
              <div className="bg-orange-500 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{isEditing ? 'Editar' : 'Nova'} Unidade</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="flex space-x-2 mb-6 border-b-2">
                  {[
                    {id: 1, label: '📍 Localização'},
                    {id: 2, label: '👥 Responsáveis'},
                    {id: 3, label: '📞 Contatos'},
                    {id: 4, label: '⚙️ Operação'}
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`px-6 py-3 font-bold ${currentTab === tab.id ? 'border-b-4 border-orange-500 text-orange-600' : 'text-gray-500'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ABA 1: LOCALIZAÇÃO */}
                {currentTab === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Estado</label>
                      <input type="text" value={formData.estado || ''} onChange={(e) => handleInputChange('estado', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="SP" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Cidade</label>
                      <input type="text" value={formData.cidade || ''} onChange={(e) => handleInputChange('cidade', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Tipo</label>
                      <select value={formData.tipo || 'hubs'} onChange={(e) => handleInputChange('tipo', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                        <option value="hubs">Hub</option>
                        <option value="bigHubs">Big Hub</option>
                        <option value="socs">SOC</option>
                        <option value="fulfillments">Fulfillment</option>
                        <option value="hubPudo">Hub PUDO</option>
                        <option value="hubOwnfleet">Hub OWNFLEET</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Nome</label>
                      <input type="text" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">CEP</label>
                      <input type="text" value={formData.cep || ''} onChange={(e) => handleInputChange('cep', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="00000-000" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Endereço</label>
                      <input type="text" value={formData.endereco || ''} onChange={(e) => handleInputChange('endereco', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Rua, número, bairro" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Data Abertura</label>
                      <input type="date" value={formData.dataAbertura || ''} onChange={(e) => handleInputChange('dataAbertura', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Status</label>
                      <select value={formData.status || 'Operando'} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                        <option value="Operando">🟢 Operando</option>
                        <option value="Fechado">🔴 Fechado</option>
                        <option value="Em Abertura">🔵 Em Abertura</option>
                        <option value="Em Mudança">🟡 Em Mudança</option>
                      </select>
                    </div>
                    {formData.status === 'Fechado' && (
                      <div className="col-span-2">
                        <label className="block text-sm font-bold mb-2 text-red-700">Data Fechamento</label>
                        <input type="date" value={formData.dataFechamento || ''} onChange={(e) => handleInputChange('dataFechamento', e.target.value)} className="w-full px-4 py-2 border border-red-300 bg-red-50 rounded-lg" />
                      </div>
                    )}
                  </div>
                )}

                {/* ABA 2: RESPONSÁVEIS */}
                {currentTab === 2 && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Site Líder</label>
                      <input type="text" value={formData.siteLider || ''} onChange={(e) => handleInputChange('siteLider', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-bold mb-2">Coordenador T1</label><input type="text" value={formData.coordenadorT1 || ''} onChange={(e) => handleInputChange('coordenadorT1', e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                      <div><label className="block text-sm font-bold mb-2">Coordenador T2</label><input type="text" value={formData.coordenadorT2 || ''} onChange={(e) => handleInputChange('coordenadorT2', e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                      <div><label className="block text-sm font-bold mb-2">Analista T1</label><input type="text" value={formData.analistaTurno1 || ''} onChange={(e) => handleInputChange('analistaTurno1', e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                      <div><label className="block text-sm font-bold mb-2">Analista T2</label><input type="text" value={formData.analistaTurno2 || ''} onChange={(e) => handleInputChange('analistaTurno2', e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                    </div>
                  </div>
                )}

                {/* ABA 3: CONTATOS */}
                {currentTab === 3 && (
                  <div className="grid grid-cols-2 gap-4">
                    {(formData.tipo === 'hubs' || formData.tipo === 'bigHubs' || formData.tipo === 'fulfillments' || formData.tipo === 'hubPudo' || formData.tipo === 'hubOwnfleet') && (
                      <>
                        <div><label className="block text-sm font-bold mb-2">Telefone Corporativo</label><input type="text" value={formData.telefoneCorporativo || ''} onChange={(e) => handleInputChange('telefoneCorporativo', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="(11) 99999-0000" /></div>
                        <div><label className="block text-sm font-bold mb-2">Marcador Vigilante/GR</label><input type="text" value={formData.marcadorVigilanteGr || ''} onChange={(e) => handleInputChange('marcadorVigilanteGr', e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                      </>
                    )}
                    {formData.tipo === 'socs' && (
                      <>
                        <div><label className="block text-sm font-bold mb-2">Número Corporativo</label><input type="text" value={formData.telefoneCorporativo || ''} onChange={(e) => handleInputChange('telefoneCorporativo', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="(11) 99999-0000" /></div>
                        <div><label className="block text-sm font-bold mb-2">Vigilante Líder</label><input type="text" value={formData.vigilanteLider || ''} onChange={(e) => handleInputChange('vigilanteLider', e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                      </>
                    )}
                    <div className="col-span-2"><label className="block text-sm font-bold mb-2">Email</label><input type="email" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="email@spx.com.br" /></div>
                  </div>
                )}

                {/* ABA 4: OPERAÇÃO */}
                {currentTab === 4 && (
                  <div className="grid grid-cols-2 gap-4">
                    {(formData.tipo === 'hubs' || formData.tipo === 'bigHubs' || formData.tipo === 'fulfillments' || formData.tipo === 'hubPudo' || formData.tipo === 'hubOwnfleet') && (
                      <>
                        <div><label className="block text-sm font-bold mb-2">Qtd Postos GR</label><input type="number" value={formData.qtdPostosGr || ''} onChange={(e) => handleInputChange('qtdPostosGr', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Qtd Postos VG</label><input type="number" value={formData.qtdPostosVg || ''} onChange={(e) => handleInputChange('qtdPostosVg', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Qtd Câmeras</label><input type="number" value={formData.qtdCameras || ''} onChange={(e) => handleInputChange('qtdCameras', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Empresa Câmeras</label><select value={formData.empresaCameras || 'INTELBRAS'} onChange={(e) => handleInputChange('empresaCameras', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          <option value="INTELBRAS">Intelbras</option>
                          <option value="DSS">DSS</option>
                        </select></div>
                        <div><label className="block text-sm font-bold mb-2">Qtd Sensores</label><input type="number" value={formData.qtdSensores || ''} onChange={(e) => handleInputChange('qtdSensores', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Empresa Sensores</label><select value={formData.empresaSensores || 'INTELBRAS'} onChange={(e) => handleInputChange('empresaSensores', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          <option value="INTELBRAS">Intelbras</option>
                          <option value="DSS">DSS</option>
                        </select></div>
                        <div className="col-span-2"><label className="block text-sm font-bold mb-2">Status Botão de Pânico</label><select value={formData.statusBotaoPanico || ''} onChange={(e) => handleInputChange('statusBotaoPanico', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          <option value="">Selecione...</option>
                          <option value="Operante">Operante</option>
                          <option value="Inoperante">Inoperante</option>
                          <option value="Sem Bateria">Sem Bateria</option>
                          <option value="Sem Botão">Sem Botão</option>
                        </select></div>
                      </>
                    )}
                    {formData.tipo === 'socs' && (
                      <>
                        <div><label className="block text-sm font-bold mb-2">Qtd Postos VIG</label><input type="number" value={formData.qtdPostosVig || ''} onChange={(e) => handleInputChange('qtdPostosVig', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Qtd Câmeras</label><input type="number" value={formData.qtdCameras || ''} onChange={(e) => handleInputChange('qtdCameras', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Empresa Câmeras</label><select value={formData.empresaCameras || 'INTELBRAS'} onChange={(e) => handleInputChange('empresaCameras', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          <option value="INTELBRAS">Intelbras</option>
                          <option value="DSS">DSS</option>
                        </select></div>
                        <div><label className="block text-sm font-bold mb-2">Qtd Sensores</label><input type="number" value={formData.qtdSensores || ''} onChange={(e) => handleInputChange('qtdSensores', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
                        <div><label className="block text-sm font-bold mb-2">Empresa Sensores</label><select value={formData.empresaSensores || 'INTELBRAS'} onChange={(e) => handleInputChange('empresaSensores', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          <option value="INTELBRAS">Intelbras</option>
                          <option value="DSS">DSS</option>
                        </select></div>
                      </>
                    )}
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-2">Dentro de Condomínio</label>
                      <select value={formData.dentroCondominio || 'NÃO'} onChange={(e) => handleInputChange('dentroCondominio', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                        <option value="SIM">SIM</option>
                        <option value="NÃO">NÃO</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 border-t">
                <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancelar</button>
                <button onClick={handleSave} disabled={loading} className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600">
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;