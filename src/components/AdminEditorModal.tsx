import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectCategory } from '../types';
import { JPX_PROJECTS } from '../data/portfolioData';
import { JPXLogo } from './JPXLogo';
import { ProjectArtCanvas } from './ProjectArtCanvas';
import {
  Lock,
  Unlock,
  X,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Copy,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Loader2,
  CloudCheck,
} from 'lucide-react';
import { optimizeImageFile, optimizeLogoFile } from '../lib/imageOptimizer';

interface AdminEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSaveProjects: (projects: Project[]) => Promise<boolean> | void;
  footerLogo: string | null;
  footerLogoHeight: number;
  onSaveLogoConfig?: (logoUrl: string | null, height: number) => Promise<boolean> | void;
  onSaveFooterLogo?: (logoUrl: string | null) => Promise<boolean> | void;
  onSaveFooterLogoHeight?: (height: number) => Promise<boolean> | void;
  onShowToast: (message: string) => void;
  isCloudConnected?: boolean;
}

const CATEGORIES: ProjectCategory[] = [
  'Identidade Visual',
  'Branding',
  'Design Editorial',
  'Embalagens',
  'Direção de Arte',
];

export const AdminEditorModal: React.FC<AdminEditorModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSaveProjects,
  footerLogo,
  footerLogoHeight,
  onSaveLogoConfig,
  onSaveFooterLogo,
  onSaveFooterLogoHeight,
  onShowToast,
  isCloudConnected = true,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jpx_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Active tab: 'projects' | 'logo'
  const [activeTab, setActiveTab] = useState<'projects' | 'logo'>('projects');

  // Editing single project state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Async states
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);

  // Logo tab draft state
  const [draftLogoUrl, setDraftLogoUrl] = useState<string | null>(footerLogo);
  const [draftLogoHeight, setDraftLogoHeight] = useState<number>(footerLogoHeight);

  // New deliverable / color temp state
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FFFFFF');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Approximate cloud payload size for health verification
  const estimatedPayloadKb = Math.round(
    JSON.stringify({ projects, footerLogo, footerLogoHeight }).length / 1024
  );

  useEffect(() => {
    setDraftLogoUrl(footerLogo);
    setDraftLogoHeight(footerLogoHeight);
  }, [footerLogo, footerLogoHeight]);

  useEffect(() => {
    if (!isOpen) {
      setPasswordError(false);
      setPasswordInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle password submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'jpx00') {
      setIsAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem('jpx_admin_auth', 'true');
      onShowToast('Acesso concedido ao Painel Administrativo!');
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jpx_admin_auth');
    setPasswordInput('');
    setEditingProject(null);
    onShowToast('Sessão encerrada.');
  };

  // Upload and compress image file for project
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      try {
        setIsOptimizingImage(true);
        onShowToast('Otimizando imagem para sincronização em tempo real...');
        const optimized = await optimizeImageFile(file);
        const approxKb = Math.round(optimized.length / 1024);
        setEditingProject({
          ...editingProject,
          customImageUrl: optimized,
        });
        onShowToast(`Imagem otimizada com sucesso (~${approxKb} KB)!`);
      } catch (err) {
        console.error('Erro ao otimizar imagem:', err);
        onShowToast('Erro ao processar imagem.');
      } finally {
        setIsOptimizingImage(false);
        e.target.value = '';
      }
    }
  };

  // Upload and compress image file for footer logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsOptimizingImage(true);
        onShowToast('Otimizando logo para sincronização...');
        const optimized = await optimizeLogoFile(file);
        setDraftLogoUrl(optimized);
        onShowToast('Logo otimizada e pronta para salvar!');
      } catch (err) {
        console.error('Erro ao otimizar logo:', err);
        onShowToast('Erro ao processar arquivo de logo.');
      } finally {
        setIsOptimizingImage(false);
        e.target.value = '';
      }
    }
  };

  // Save current editing project
  const handleSaveProjectForm = async () => {
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      onShowToast('O título do projeto é obrigatório.');
      return;
    }

    let updatedList: Project[];
    if (isCreatingNew) {
      updatedList = [editingProject, ...projects];
    } else {
      updatedList = projects.map((p) =>
        p.id === editingProject.id ? editingProject : p
      );
    }

    try {
      setIsSaving(true);
      await onSaveProjects(updatedList);
      setEditingProject(null);
      setIsCreatingNew(false);
      onShowToast(`Projeto "${editingProject.title}" sincronizado na nuvem!`);
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao sincronizar com a nuvem.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${projectTitle}"?`)) {
      const updated = projects.filter((p) => p.id !== projectId);
      try {
        setIsSaving(true);
        await onSaveProjects(updated);
        onShowToast(`Projeto "${projectTitle}" excluído e sincronizado.`);
      } catch (err: any) {
        onShowToast(err?.message || 'Erro ao excluir.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Duplicate project
  const handleDuplicateProject = async (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `${project.id}-copy-${Date.now()}`,
      title: `${project.title} (Cópia)`,
    };
    try {
      setIsSaving(true);
      await onSaveProjects([duplicated, ...projects]);
      onShowToast(`Projeto "${project.title}" duplicado e sincronizado.`);
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao duplicar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to original projects
  const handleResetToDefaults = async () => {
    if (
      window.confirm(
        'Deseja restaurar a lista original de projetos? Todas as alterações personalizadas em projetos serão redefinidas e sincronizadas.'
      )
    ) {
      try {
        setIsSaving(true);
        await onSaveProjects(JPX_PROJECTS);
        setEditingProject(null);
        onShowToast('Projetos restaurados para a versão padrão.');
      } catch (err: any) {
        onShowToast(err?.message || 'Erro ao restaurar.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Save logo changes atomically across all devices
  const handleSaveFooterLogo = async () => {
    try {
      setIsSaving(true);
      if (onSaveLogoConfig) {
        await onSaveLogoConfig(draftLogoUrl, draftLogoHeight);
      } else {
        if (onSaveFooterLogo) await onSaveFooterLogo(draftLogoUrl);
        if (onSaveFooterLogoHeight) await onSaveFooterLogoHeight(draftLogoHeight);
      }
      onShowToast('Logotipo salvo e sincronizado em todos os dispositivos!');
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao sincronizar logo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset logo to default vector
  const handleResetFooterLogo = async () => {
    setDraftLogoUrl(null);
    setDraftLogoHeight(32);
    try {
      setIsSaving(true);
      if (onSaveLogoConfig) {
        await onSaveLogoConfig(null, 32);
      } else {
        if (onSaveFooterLogo) await onSaveFooterLogo(null);
        if (onSaveFooterLogoHeight) await onSaveFooterLogoHeight(32);
      }
      onShowToast('Logotipo restaurado para a versão padrão.');
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao restaurar logo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize new project
  const handleStartCreateNew = () => {
    const newProj: Project = {
      id: `project-${Date.now()}`,
      title: 'NOVO PROJETO',
      client: 'Cliente Exemplo',
      year: new Date().getFullYear().toString(),
      category: 'Identidade Visual',
      tagline: 'Descrição curta de impacto visual e posicionamento de marca.',
      description: 'Visão geral abrangente do projeto de design.',
      challenge: 'O principal desafio visual e estratégico a ser superado.',
      solution: 'A solução criativa, tipográfica e arquitetural implementada.',
      deliverables: ['Identidade Visual', 'Brand Guidelines', 'Mockups de Apresentação'],
      palette: ['#050505', '#FFFFFF', '#A1A1AA'],
      typography: 'Syne & Plus Jakarta Sans',
      aspectRatio: '4/3',
      featured: false,
      themeColor: '#FFFFFF',
      customImageUrl: '',
    };
    setEditingProject(newProj);
    setIsCreatingNew(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Background dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#0A0A0C] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#0E0E11]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
              {isAuthenticated ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-zinc-400" />}
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                Painel do Administrador
                {isAuthenticated && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                      isCloudConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {isCloudConnected
                      ? 'Sincronização Simultânea Ativa'
                      : 'Reconectando à Nuvem...'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#A1A1AA] flex items-center gap-2 flex-wrap">
                <span>Edição de Projetos e Logo</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400/90 font-mono text-[11px]" title="ID do documento Firestore">
                  Doc: UiDBo8OtShNXwp46ZnX2
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400 font-mono text-[11px]">
                  Nuvem: ~{estimatedPayloadKb} KB / 1000 KB
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors"
                title="Bloquear painel"
              >
                Bloquear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* ==============================================================
             PASSWORD AUTHENTICATION GATE
             ============================================================== */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8 text-zinc-400" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl text-white">
                Acesso Restrito
              </h3>
              <p className="text-sm text-[#A1A1AA]">
                Insira a senha de acesso para gerenciar os projetos e alterar a logo do rodapé.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Digite a senha..."
                  autoFocus
                  className={`w-full px-4 py-3 bg-[#121215] border ${
                    passwordError ? 'border-red-500 focus:border-red-500' : 'border-[#27272A] focus:border-white'
                  } rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none transition-colors text-center tracking-widest`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                  aria-label="Alternar visualização da senha"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <div className="flex items-center justify-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Senha incorreta. Tente novamente.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        ) : (
          /* ==============================================================
             AUTHENTICATED ADMIN INTERFACE
             ============================================================== */
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Tabs Bar */}
            <div className="flex items-center justify-between px-6 pt-3 border-b border-[#27272A] bg-[#0A0A0C]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setEditingProject(null);
                  }}
                  className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'projects'
                      ? 'border-white text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Projetos do Portfólio</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300">
                    {projects.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('logo');
                    setEditingProject(null);
                  }}
                  className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'logo'
                      ? 'border-white text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Logotipo (Topo & Rodapé)</span>
                  {footerLogo && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              </div>

              {activeTab === 'projects' && !editingProject && (
                <div className="flex items-center gap-2 pb-2">
                  <button
                    onClick={handleResetToDefaults}
                    className="px-2.5 py-1.5 text-[11px] font-mono text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
                    title="Restaurar projetos padrão"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Restaurar Padrão</span>
                  </button>
                  <button
                    onClick={handleStartCreateNew}
                    className="px-3 py-1.5 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Projeto</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'projects' ? (
                editingProject ? (
                  /* ==========================================================
                     INDIVIDUAL PROJECT EDITOR FORM
                     ========================================================== */
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {/* Back Button & Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Voltar para lista de projetos</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProject(null)}
                          className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveProjectForm}
                          className="px-4 py-1.5 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvar Projeto</span>
                        </button>
                      </div>
                    </div>

                    {/* Section 1: Image / Visual Cover */}
                    <div className="p-5 rounded-xl border border-[#27272A] bg-[#0E0E12] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">
                            Imagem do Projeto (Capa / Visual)
                          </h4>
                          <p className="text-xs text-[#A1A1AA]">
                            Faça upload de uma foto/render do seu computador ou informe um link direto.
                          </p>
                        </div>
                      </div>

                      {/* Image Preview & Upload Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 aspect-[4/3] rounded-lg overflow-hidden border border-[#27272A] bg-[#0A0A0C] relative flex items-center justify-center">
                          {editingProject.customImageUrl ? (
                            <>
                              <div
                                className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-45 pointer-events-none"
                                style={{ backgroundImage: `url(${editingProject.customImageUrl})` }}
                                aria-hidden="true"
                              />
                              <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />
                              <img
                                src={editingProject.customImageUrl}
                                alt={editingProject.title}
                                className="relative z-10 w-full h-full object-contain p-1"
                              />
                            </>
                          ) : (
                            <div className="w-full h-full relative">
                              <ProjectArtCanvas project={editingProject} />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-mono text-white/80 bg-black/70 px-2 py-1 rounded">
                                  Mockup Padrão (Sem Foto Externa)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProjectImageUpload}
                            accept="image/*"
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isOptimizingImage || isSaving}
                            className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isOptimizingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                                <span>Otimizando Imagem para a Nuvem...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-zinc-300" />
                                <span>Carregar Imagem do Dispositivo (Upload Otimizado)</span>
                              </>
                            )}
                          </button>

                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-zinc-400">
                              Ou cole a URL direta da imagem:
                            </label>
                            <input
                              type="text"
                              value={editingProject.customImageUrl || ''}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  customImageUrl: e.target.value,
                                })
                              }
                              placeholder="https://exemplo.com/imagem-do-projeto.jpg"
                              className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-xs focus:outline-none focus:border-white"
                            />
                          </div>

                          {editingProject.customImageUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProject({
                                  ...editingProject,
                                  customImageUrl: '',
                                })
                              }
                              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remover imagem personalizada</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Metadata & Main Info */}
                    <div className="p-5 rounded-xl border border-[#27272A] bg-[#0E0E12] space-y-4">
                      <h4 className="font-display font-bold text-sm text-white">
                        Dados Principais do Projeto
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Nome / Título do Projeto
                          </label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, title: e.target.value })
                            }
                            placeholder="Ex: AURA APOTHECARY"
                            className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-sm font-semibold focus:outline-none focus:border-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Cliente
                          </label>
                          <input
                            type="text"
                            value={editingProject.client}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, client: e.target.value })
                            }
                            placeholder="Ex: Aura Botanicals Ltd."
                            className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Ano / Período
                          </label>
                          <input
                            type="text"
                            value={editingProject.year}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, year: e.target.value })
                            }
                            placeholder="Ex: 2025"
                            className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Categoria
                          </label>
                          <select
                            value={editingProject.category}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                category: e.target.value as ProjectCategory,
                              })
                            }
                            className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">
                          Frase de Impacto / Tagline (Aparece no card e destaque)
                        </label>
                        <input
                          type="text"
                          value={editingProject.tagline}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, tagline: e.target.value })
                          }
                          placeholder="Ex: Sistema de identidade minimalista para perfumaria artesanal e botânica."
                          className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    {/* Section 3: Detailed Case Study Texts */}
                    <div className="p-5 rounded-xl border border-[#27272A] bg-[#0E0E12] space-y-4">
                      <h4 className="font-display font-bold text-sm text-white">
                        Estudo de Caso (Detalhes do Modal)
                      </h4>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">
                          O Desafio
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.challenge}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, challenge: e.target.value })
                          }
                          placeholder="Descreva o desafio que o cliente enfrentava..."
                          className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-xs leading-relaxed focus:outline-none focus:border-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">
                          A Abordagem & Solução
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.solution}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, solution: e.target.value })
                          }
                          placeholder="Descreva a solução visual e conceitual criada..."
                          className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-xs leading-relaxed focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    {/* Section 4: Deliverables & Colors */}
                    <div className="p-5 rounded-xl border border-[#27272A] bg-[#0E0E12] space-y-4">
                      <h4 className="font-display font-bold text-sm text-white">
                        Entregáveis & Paleta de Cores
                      </h4>

                      {/* Deliverables list */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">
                          Entregáveis
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editingProject.deliverables?.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs border border-zinc-700"
                            >
                              <span>{item}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingProject({
                                    ...editingProject,
                                    deliverables: editingProject.deliverables.filter(
                                      (_, i) => i !== idx
                                    ),
                                  })
                                }
                                className="text-zinc-400 hover:text-white"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newDeliverable}
                            onChange={(e) => setNewDeliverable(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newDeliverable.trim()) {
                                  setEditingProject({
                                    ...editingProject,
                                    deliverables: [
                                      ...editingProject.deliverables,
                                      newDeliverable.trim(),
                                    ],
                                  });
                                  setNewDeliverable('');
                                }
                              }
                            }}
                            placeholder="Adicionar entregável (ex: Embalagem)"
                            className="flex-1 px-3 py-1.5 bg-[#141418] border border-[#27272A] rounded-lg text-white text-xs focus:outline-none focus:border-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newDeliverable.trim()) {
                                setEditingProject({
                                  ...editingProject,
                                  deliverables: [
                                    ...editingProject.deliverables,
                                    newDeliverable.trim(),
                                  ],
                                });
                                setNewDeliverable('');
                              }
                            }}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>

                      {/* Palette */}
                      <div className="space-y-2 pt-2 border-t border-[#27272A]">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">
                          Paleta HEX do Projeto
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          {editingProject.palette?.map((color, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs"
                            >
                              <span
                                className="w-5 h-5 rounded border border-white/20"
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-mono text-zinc-300 text-[11px]">{color}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingProject({
                                    ...editingProject,
                                    palette: editingProject.palette.filter((_, i) => i !== idx),
                                  })
                                }
                                className="text-zinc-500 hover:text-white px-1"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value.toUpperCase())}
                            className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value.toUpperCase())}
                            placeholder="#FFFFFF"
                            className="w-28 px-2 py-1 bg-[#141418] border border-[#27272A] rounded-lg text-white font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newColorHex) {
                                setEditingProject({
                                  ...editingProject,
                                  palette: [...(editingProject.palette || []), newColorHex],
                                });
                              }
                            }}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                          >
                            + Cor
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProjectForm}
                        disabled={isSaving || isOptimizingImage}
                        className="px-6 py-2.5 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 text-black animate-spin" />
                            <span>Sincronizando com a Nuvem...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Salvar & Sincronizar em Todos os Dispositivos</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ==========================================================
                     PROJECTS LIST VIEW
                     ========================================================== */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                      <p>
                        Clique em <strong>Editar</strong> para alterar imagens, frases, cliente ou datas de cada projeto individualmente.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl border border-[#27272A] bg-[#0E0E12] flex gap-4 items-center justify-between hover:border-zinc-600 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Project Thumbnail */}
                            <div className="w-16 h-16 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                              {proj.customImageUrl ? (
                                <img
                                  src={proj.customImageUrl}
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full scale-50 origin-top-left pointer-events-none">
                                  <ProjectArtCanvas project={proj} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                                <span>{proj.year}</span>
                                <span>·</span>
                                <span className="truncate">{proj.category}</span>
                              </div>
                              <h4 className="font-display font-bold text-sm text-white truncate">
                                {proj.title}
                              </h4>
                              <p className="text-xs text-zinc-400 truncate">
                                {proj.client}
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingProject({ ...proj });
                                setIsCreatingNew(false);
                              }}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                              title="Editar projeto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProject(proj)}
                              className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                              title="Duplicar projeto"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="p-2 rounded-lg bg-zinc-800/40 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors"
                              title="Excluir projeto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                /* ==============================================================
                   FOOTER LOGO CUSTOMIZATION TAB
                   ============================================================== */
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      Logotipo Oficial do Estúdio (Topo & Rodapé)
                    </h3>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      Altere a logotipo que aparece no menu superior (cabeçalho) e no rodapé do site. As alterações são sincronizadas simultaneamente em todos os navegadores e dispositivos conectados.
                    </p>
                  </div>

                  {/* Dual Live Preview Box */}
                  <div className="p-5 rounded-xl border border-[#27272A] bg-[#050505] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                        Pré-visualização ao vivo:
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {draftLogoUrl ? 'Logo Personalizada Ativa' : 'Logotipo Vetorial Padrão'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Top Header Preview */}
                      <div className="p-3.5 rounded-lg bg-[#0E0E12] border border-zinc-800 space-y-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                          Topo / Cabeçalho (Header):
                        </span>
                        <div className="h-14 flex items-center justify-start px-3 bg-[#050505] rounded border border-zinc-900">
                          {draftLogoUrl ? (
                            <img
                              src={draftLogoUrl}
                              alt="Logo Cabeçalho"
                              style={{ height: Math.min(Math.max(draftLogoHeight, 22), 40) }}
                              className="w-auto object-contain max-h-10"
                            />
                          ) : (
                            <span className="font-display font-extrabold text-lg text-white tracking-tighter">JPXSTUDIO</span>
                          )}
                        </div>
                      </div>

                      {/* Footer Preview */}
                      <div className="p-3.5 rounded-lg bg-[#0E0E12] border border-zinc-800 space-y-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                          Rodapé (Footer):
                        </span>
                        <div className="h-14 flex items-center justify-start px-3 bg-[#050505] rounded border border-zinc-900 gap-3">
                          {draftLogoUrl ? (
                            <img
                              src={draftLogoUrl}
                              alt="Logo Rodapé"
                              style={{ height: draftLogoHeight }}
                              className="w-auto object-contain max-h-10"
                            />
                          ) : (
                            <JPXLogo height={draftLogoHeight} className="text-white" />
                          )}
                          <span className="text-zinc-700 text-xs">|</span>
                          <span className="text-zinc-400 text-xs font-sans">Designer Gráfico</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="p-5 rounded-xl border border-[#27272A] bg-[#0E0E12] space-y-4">
                    <h4 className="font-display font-bold text-sm text-white">
                      Carregar Arquivo ou Inserir Link da Logo
                    </h4>

                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        disabled={isOptimizingImage || isSaving}
                        className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isOptimizingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                            <span>Otimizando Logo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-zinc-300" />
                            <span>Carregar Imagem do Computador (PNG, SVG, JPG)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleResetFooterLogo}
                        disabled={isSaving || isOptimizingImage}
                        className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4 text-zinc-400" />
                        <span>Restaurar Logo Padrão</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-[11px] font-mono text-zinc-400">
                        Ou insira a URL direta da imagem da logo:
                      </label>
                      <input
                        type="text"
                        value={draftLogoUrl || ''}
                        onChange={(e) => setDraftLogoUrl(e.target.value)}
                        placeholder="https://exemplo.com/minha-logo.png"
                        className="w-full px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-xs focus:outline-none focus:border-white"
                      />
                    </div>

                    {/* Height slider */}
                    <div className="space-y-2 pt-3 border-t border-[#27272A]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 font-medium">Altura / Proporção da Logo:</span>
                        <span className="font-mono text-white">{draftLogoHeight}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="60"
                        step="2"
                        value={draftLogoHeight}
                        onChange={(e) => setDraftLogoHeight(Number(e.target.value))}
                        className="w-full accent-white cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
                    <button
                      type="button"
                      onClick={handleSaveFooterLogo}
                      disabled={isSaving || isOptimizingImage}
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 text-black animate-spin" />
                          <span>Sincronizando Logo na Nuvem...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Salvar & Sincronizar Logo em Todos os Dispositivos</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
