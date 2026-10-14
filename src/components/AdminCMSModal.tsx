import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { X, Lock, Unlock, Image, Plus, Trash2, Save, RotateCcw, Upload, Check, Eye, EyeOff } from 'lucide-react';
import { JPXLogo } from './JPXLogo';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSaveProjects: (newProjects: Project[]) => void;
  onResetProjects: () => void;
  customFooterLogoUrl: string;
  onSaveFooterLogo: (url: string) => void;
  onShowToast: (message: string) => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSaveProjects,
  onResetProjects,
  customFooterLogoUrl,
  onSaveFooterLogo,
  onShowToast,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // CMS Tabs: 'projects' | 'footer-logo'
  const [activeTab, setActiveTab] = useState<'projects' | 'footer-logo'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

  // Local editing project copy
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Local editing state for the active project
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [logoUrlInput, setLogoUrlInput] = useState(customFooterLogoUrl);

  // Sync edit form whenever selected project changes
  React.useEffect(() => {
    if (selectedProject) {
      setEditForm({ ...selectedProject });
    }
  }, [selectedProjectId, projects]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'jpx00') {
      setIsAuthenticated(true);
      setAuthError(false);
      onShowToast('Acesso de administrador liberado!');
    } else {
      setAuthError(true);
      onShowToast('Senha incorreta.');
    }
  };

  const handleSaveCurrentProject = () => {
    if (!editForm.id || !editForm.title) {
      onShowToast('O projeto precisa ter um título.');
      return;
    }

    const updatedProjects = projects.map((p) =>
      p.id === editForm.id ? ({ ...p, ...editForm } as Project) : p
    );

    onSaveProjects(updatedProjects);
    onShowToast(`Projeto "${editForm.title}" salvo com sucesso!`);
  };

  const handleAddNewProject = () => {
    const newId = `projeto-${Date.now()}`;
    const newProj: Project = {
      id: newId,
      title: 'NOVO PROJETO',
      client: 'Nome do Cliente',
      year: new Date().getFullYear().toString(),
      category: 'Identidade Visual',
      tagline: 'Descrição curta e marcante do projeto.',
      description: 'Descrição completa detalhando o conceito e a execução visual.',
      challenge: 'Descreva o principal desafio encontrado no projeto.',
      solution: 'Descreva a solução de design implementada para o cliente.',
      deliverables: ['Identidade Visual', 'Manual de Marca', 'Aplicações'],
      palette: ['#050505', '#18181B', '#E4E4E7', '#FFFFFF'],
      typography: 'Syne + Plus Jakarta Sans',
      aspectRatio: '4:3',
      featured: false,
      themeColor: '#FFFFFF',
    };

    const newArr = [newProj, ...projects];
    onSaveProjects(newArr);
    setSelectedProjectId(newId);
    onShowToast('Novo projeto criado!');
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      onShowToast('Você precisa manter pelo menos 1 projeto no site.');
      return;
    }
    const remaining = projects.filter((p) => p.id !== id);
    onSaveProjects(remaining);
    setSelectedProjectId(remaining[0].id);
    onShowToast('Projeto removido.');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setEditForm((prev) => ({ ...prev, customImageUrl: result }));
      onShowToast('Imagem carregada!');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoUrlInput(result);
      onSaveFooterLogo(result);
      onShowToast('Nova logo do rodapé salva!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogoUrl = () => {
    onSaveFooterLogo(logoUrlInput);
    onShowToast('Logo do rodapé atualizada!');
  };

  const handleResetLogoToDefault = () => {
    setLogoUrlInput('');
    onSaveFooterLogo('');
    onShowToast('Logo do rodapé restaurada para o padrão oficial.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#0A0A0C] border border-[#27272A] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] flex items-center justify-center text-zinc-400">
              {isAuthenticated ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-white">
                Painel Administrativo JPXSTUDIO
              </h2>
              <p className="text-[10px] font-mono text-[#A1A1AA]">
                {isAuthenticated ? 'Gerenciador de Projetos & Identidade' : 'Acesso Restrito'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTHENTICATION SCREEN */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-zinc-400 shadow-inner">
              <Lock className="w-8 h-8 text-zinc-300" />
            </div>

            <div>
              <h3 className="font-display font-bold text-2xl text-white">
                Digite a Senha de Acesso
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1.5 font-sans">
                Para editar os projetos, imagens, textos e a logo do rodapé, informe a chave de segurança.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  placeholder="Senha (jpx00)"
                  autoFocus
                  className={`w-full px-4 py-3 bg-[#121215] border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors ${
                    authError ? 'border-red-500' : 'border-[#27272A] focus:border-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="text-xs font-mono text-red-400">
                  Senha incorreta. Tente novamente.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs rounded-lg transition-all"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED CMS INTERFACE */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Sub-tabs */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-[#0f0f12] border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'projects' ? 'bg-white text-black' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Editar Projetos ({projects.length})
                </button>
                <button
                  onClick={() => setActiveTab('footer-logo')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'footer-logo' ? 'bg-white text-black' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Editar Logo do Rodapé
                </button>
              </div>

              <button
                onClick={onResetProjects}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-red-400 transition-colors"
                title="Restaurar projetos padrão"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar Originais</span>
              </button>
            </div>

            {/* TAB 1: PROJECTS EDITOR */}
            {activeTab === 'projects' && (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                {/* Project Selector Sidebar */}
                <div className="md:col-span-4 border-r border-[#27272A] bg-[#0c0c0f] overflow-y-auto p-4 space-y-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#27272A]">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Selecione para Editar
                    </span>
                    <button
                      onClick={handleAddNewProject}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white text-black rounded text-[10px] font-bold hover:bg-zinc-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Novo</span>
                    </button>
                  </div>

                  {projects.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`p-3 rounded-lg cursor-pointer border transition-all text-left flex items-center justify-between ${
                        selectedProjectId === p.id
                          ? 'bg-[#18181B] border-white text-white'
                          : 'bg-[#121215] border-transparent text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="text-xs font-bold truncate">{p.title}</div>
                        <div className="text-[10px] font-mono text-zinc-500 truncate">
                          {p.year} · {p.category}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-600 shrink-0">#{idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Main Project Edit Form */}
                <div className="md:col-span-8 overflow-y-auto p-6 space-y-6 bg-[#0A0A0C]">
                  {selectedProject && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                        <div>
                          <h3 className="font-display font-bold text-lg text-white">
                            Editando: {editForm.title}
                          </h3>
                          <p className="text-xs text-zinc-400">ID: {editForm.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteProject(selectedProject.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-950/20 transition-colors"
                            title="Excluir projeto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveCurrentProject}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Salvar Projeto</span>
                          </button>
                        </div>
                      </div>

                      {/* Image Preview & Upload Row */}
                      <div className="p-4 bg-[#121215] border border-[#27272A] rounded-xl space-y-3">
                        <label className="block text-xs font-mono text-zinc-400 uppercase">
                          Imagem de Capa do Projeto
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-32 h-24 rounded-lg bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {editForm.customImageUrl ? (
                              <img
                                src={editForm.customImageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-2 text-zinc-600 text-[10px] font-mono">
                                Arte Vetorial Padrão
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <input
                              type="text"
                              value={editForm.customImageUrl || ''}
                              onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, customImageUrl: e.target.value }))
                              }
                              placeholder="URL da imagem (ex: https://...)"
                              className="w-full px-3 py-2 bg-black border border-[#27272A] rounded text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                            />

                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs rounded border border-[#27272A] cursor-pointer transition-colors">
                                <Upload className="w-3 h-3" />
                                <span>Subir Imagem do Computador</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageFileUpload}
                                />
                              </label>

                              {editForm.customImageUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditForm((prev) => ({ ...prev, customImageUrl: undefined }))
                                  }
                                  className="text-[11px] text-zinc-400 hover:text-red-400"
                                >
                                  Restaurar arte padrão
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Title & Client */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            Título do Projeto
                          </label>
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            Cliente
                          </label>
                          <input
                            type="text"
                            value={editForm.client || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, client: e.target.value }))}
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
                          />
                        </div>
                      </div>

                      {/* Year & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            Ano
                          </label>
                          <input
                            type="text"
                            value={editForm.year || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            Categoria
                          </label>
                          <select
                            value={editForm.category || 'Identidade Visual'}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                category: e.target.value as ProjectCategory,
                              }))
                            }
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
                          >
                            <option value="Identidade Visual">Identidade Visual</option>
                            <option value="Embalagens">Embalagens</option>
                            <option value="Design Digital">Design Digital</option>
                            <option value="Branding">Branding</option>
                            <option value="Design Editorial">Design Editorial</option>
                            <option value="Direção de Arte">Direção de Arte</option>
                          </select>
                        </div>
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                          Frase de Destaque / Tagline
                        </label>
                        <input
                          type="text"
                          value={editForm.tagline || ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, tagline: e.target.value }))}
                          className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
                        />
                      </div>

                      {/* Challenge & Solution (Images 3 & 4) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            O Desafio
                          </label>
                          <textarea
                            rows={3}
                            value={editForm.challenge || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, challenge: e.target.value }))}
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:border-white resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            A Abordagem & Solução
                          </label>
                          <textarea
                            rows={3}
                            value={editForm.solution || ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, solution: e.target.value }))}
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:border-white resize-none"
                          />
                        </div>
                      </div>

                      {/* Deliverables (1 per line) */}
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                          Entregáveis do Projeto (um por linha)
                        </label>
                        <textarea
                          rows={3}
                          value={editForm.deliverables?.join('\n') || ''}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              deliverables: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:border-white resize-none font-sans"
                        />
                      </div>

                      {/* Typography & Palette */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            Tipografia Empregada
                          </label>
                          <input
                            type="text"
                            value={editForm.typography || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, typography: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                            Paleta Cromática (HEX separados por vírgula)
                          </label>
                          <input
                            type="text"
                            value={editForm.palette?.join(', ') || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                palette: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }))
                            }
                            className="w-full px-3 py-2 bg-[#121215] border border-[#27272A] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: FOOTER LOGO EDITOR */}
            {activeTab === 'footer-logo' && (
              <div className="p-8 max-w-xl mx-auto space-y-6 my-auto text-center">
                <div className="p-6 bg-[#121215] border border-[#27272A] rounded-xl space-y-4">
                  <div className="text-xs font-mono text-zinc-400 uppercase">
                    Visualização Atual da Logo no Rodapé
                  </div>

                  <div className="h-20 bg-black border border-white/10 rounded-lg flex items-center justify-center p-4">
                    {logoUrlInput ? (
                      <img src={logoUrlInput} alt="Custom Logo" className="max-h-12 w-auto object-contain" />
                    ) : (
                      <JPXLogo height={36} className="text-white" />
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 font-sans">
                    {logoUrlInput ? 'Usando imagem personalizada' : 'Usando vetor oficial padrão JPXSTUDIO'}
                  </p>
                </div>

                {/* Upload or Link Input */}
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                      URL da Logo (ou envie arquivo abaixo)
                    </label>
                    <input
                      type="text"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      placeholder="https://sua-imagem-logo.png"
                      className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-medium rounded-lg border border-[#27272A] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Imagem do Dispositivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoFileUpload}
                      />
                    </label>

                    <button
                      onClick={handleSaveLogoUrl}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Salvar Logo
                    </button>
                  </div>

                  {logoUrlInput && (
                    <button
                      type="button"
                      onClick={handleResetLogoToDefault}
                      className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      Restaurar para a logo padrão oficial
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
