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
  ChevronRight,
  Star,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  CloudCheck,
} from 'lucide-react';
import { getProjectImages } from '../types';
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
  'Matchday',
  'Artes 1920x1080',
  'Site',
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

  // In-app deletion and reset confirmation states (iframe-safe, zero window.confirm)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Async states
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);

  // Logo tab draft state
  const [draftLogoUrl, setDraftLogoUrl] = useState<string | null>(footerLogo);
  const [draftLogoHeight, setDraftLogoHeight] = useState<number>(footerLogoHeight);

  // New deliverable / color temp state
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FFFFFF');

  // Multi-image management state
  const [activeImagePreviewIndex, setActiveImagePreviewIndex] = useState(0);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

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

  // Upload and compress image file(s) for project - supports multiple files
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    try {
      setIsOptimizingImage(true);
      const existingImages = [
        ...(editingProject.images && editingProject.images.length > 0
          ? editingProject.images
          : editingProject.customImageUrl
          ? [editingProject.customImageUrl]
          : [])
      ];

      const newOptimizedImages: string[] = [];
      let detectedFormat = editingProject.aspectRatio || '1350x1080';
      let suggestedCategory = editingProject.category;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        onShowToast(`Otimizando imagem ${i + 1} de ${files.length}...`);
        const optimized = await optimizeImageFile(file);
        newOptimizedImages.push(optimized);

        // Auto-detect image dimensions on first image if project has no images yet
        if (existingImages.length === 0 && i === 0) {
          try {
            const img = new Image();
            img.src = optimized;
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
            if (img.naturalWidth && img.naturalHeight) {
              const ratio = img.naturalWidth / img.naturalHeight;
              if (ratio >= 1.15) {
                detectedFormat = '1920x1080';
                suggestedCategory = editingProject.category === 'Site' ? 'Site' : 'Artes 1920x1080';
              } else if (ratio <= 0.95) {
                detectedFormat = '1350x1080';
                suggestedCategory = 'Matchday';
              }
            }
          } catch {
            // ignore detection error
          }
        }
      }

      const combinedImages = [...existingImages, ...newOptimizedImages];
      setEditingProject({
        ...editingProject,
        images: combinedImages,
        customImageUrl: combinedImages[0] || '',
        aspectRatio: detectedFormat,
        category: suggestedCategory,
      });

      setActiveImagePreviewIndex(combinedImages.length - 1);

      onShowToast(
        files.length === 1
          ? 'Imagem adicionada ao trabalho com sucesso!'
          : `${files.length} novas imagens adicionadas ao trabalho!`
      );
    } catch (err) {
      console.error('Erro ao otimizar imagem:', err);
      onShowToast('Erro ao processar imagem.');
    } finally {
      setIsOptimizingImage(false);
      e.target.value = '';
    }
  };

  // Add image by direct URL
  const handleAddImageUrl = () => {
    if (!editingProject || !newImageUrlInput.trim()) return;
    const url = newImageUrlInput.trim();
    const existingImages = [
      ...(editingProject.images && editingProject.images.length > 0
        ? editingProject.images
        : editingProject.customImageUrl
        ? [editingProject.customImageUrl]
        : [])
    ];
    const combined = [...existingImages, url];
    setEditingProject({
      ...editingProject,
      images: combined,
      customImageUrl: combined[0] || '',
    });
    setActiveImagePreviewIndex(combined.length - 1);
    setNewImageUrlInput('');
    onShowToast('Imagem adicionada à galeria!');
  };

  // Remove specific image by index
  const handleRemoveImageAtIndex = (idxToRemove: number) => {
    if (!editingProject) return;
    const currentImages = [
      ...(editingProject.images && editingProject.images.length > 0
        ? editingProject.images
        : editingProject.customImageUrl
        ? [editingProject.customImageUrl]
        : [])
    ];
    const updated = currentImages.filter((_, i) => i !== idxToRemove);
    setEditingProject({
      ...editingProject,
      images: updated,
      customImageUrl: updated[0] || '',
    });
    if (activeImagePreviewIndex >= updated.length) {
      setActiveImagePreviewIndex(Math.max(0, updated.length - 1));
    }
    onShowToast('Imagem removida do trabalho.');
  };

  // Set image as cover (position 0)
  const handleSetCoverImage = (idx: number) => {
    if (!editingProject) return;
    const currentImages = [
      ...(editingProject.images && editingProject.images.length > 0
        ? editingProject.images
        : editingProject.customImageUrl
        ? [editingProject.customImageUrl]
        : [])
    ];
    if (idx <= 0 || idx >= currentImages.length) return;
    const [selected] = currentImages.splice(idx, 1);
    currentImages.unshift(selected);
    setEditingProject({
      ...editingProject,
      images: currentImages,
      customImageUrl: currentImages[0] || '',
    });
    setActiveImagePreviewIndex(0);
    onShowToast('Imagem definida como Capa principal!');
  };

  // Move image position (reorder)
  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (!editingProject) return;
    const currentImages = [
      ...(editingProject.images && editingProject.images.length > 0
        ? editingProject.images
        : editingProject.customImageUrl
        ? [editingProject.customImageUrl]
        : [])
    ];
    if (toIdx < 0 || toIdx >= currentImages.length) return;
    const [item] = currentImages.splice(fromIdx, 1);
    currentImages.splice(toIdx, 0, item);
    setEditingProject({
      ...editingProject,
      images: currentImages,
      customImageUrl: currentImages[0] || '',
    });
    setActiveImagePreviewIndex(toIdx);
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

    const currentImages = (
      editingProject.images && editingProject.images.length > 0
        ? editingProject.images
        : editingProject.customImageUrl
        ? [editingProject.customImageUrl]
        : []
    ).filter(Boolean);

    const projectToSave: Project = {
      ...editingProject,
      images: currentImages,
      customImageUrl: currentImages[0] || '',
    };

    let updatedList: Project[];
    if (isCreatingNew || !projects.some((p) => p.id === projectToSave.id)) {
      updatedList = [projectToSave, ...projects.filter((p) => p.id !== projectToSave.id)];
    } else {
      updatedList = projects.map((p) =>
        p.id === projectToSave.id ? projectToSave : p
      );
    }

    try {
      setIsSaving(true);
      await onSaveProjects(updatedList);
      setEditingProject(null);
      setIsCreatingNew(false);
      onShowToast(
        `Projeto "${projectToSave.title}" salvo com ${currentImages.length} imagem(ns)!`
      );
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao sincronizar com a nuvem.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete project execution (called after user confirms in the custom modal)
  const confirmDeleteProject = async (projectId: string, projectTitle: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    try {
      setIsSaving(true);
      await onSaveProjects(updated);
      if (editingProject?.id === projectId) {
        setEditingProject(null);
      }
      onShowToast(`Projeto "${projectTitle}" excluído com sucesso!`);
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao excluir.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open delete confirmation modal
  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    setProjectToDelete({ id: projectId, title: projectTitle });
  };

  // Duplicate project
  const handleDuplicateProject = async (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `${project.id}-copy-${Date.now()}`,
      title: `${project.title} (Cópia)`,
      images: project.images
        ? [...project.images]
        : project.customImageUrl
        ? [project.customImageUrl]
        : [],
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
  const confirmResetToDefaults = async () => {
    try {
      setIsSaving(true);
      await onSaveProjects(JPX_PROJECTS);
      setEditingProject(null);
      setShowResetConfirm(false);
      onShowToast('Projetos restaurados para a versão padrão.');
    } catch (err: any) {
      onShowToast(err?.message || 'Erro ao restaurar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setShowResetConfirm(true);
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
      title: 'NOVA ARTE',
      client: 'Cliente / Clube',
      year: new Date().getFullYear().toString(),
      category: 'Matchday',
      tagline: 'Descrição curta de impacto visual e posicionamento da arte.',
      description: 'Visão geral abrangente do projeto de design.',
      challenge: 'O principal desafio visual e estratégico a ser superado.',
      solution: 'A solução criativa, tipográfica e arquitetural implementada.',
      deliverables: ['Arte Digital', 'Post Social', 'Flyer Oficial'],
      palette: ['#050505', '#FFFFFF', '#A1A1AA'],
      typography: 'Syne & Plus Jakarta Sans',
      aspectRatio: '1350x1080',
      featured: false,
      themeColor: '#FFFFFF',
      customImageUrl: '',
      images: [],
    };
    setEditingProject(newProj);
    setActiveImagePreviewIndex(0);
    setNewImageUrlInput('');
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
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Nuvem Sincronizada · {projects.length} {projects.length === 1 ? 'arte' : 'artes'} (Sem Limite)
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

                    {/* Section 1: Image / Visual Cover & Multi-Image Gallery */}
                    {(() => {
                      const currentImages = (
                        editingProject.images && editingProject.images.length > 0
                          ? editingProject.images
                          : editingProject.customImageUrl
                          ? [editingProject.customImageUrl]
                          : []
                      ).filter(Boolean);
                      const safeActivePreviewIndex = Math.min(
                        activeImagePreviewIndex,
                        Math.max(0, currentImages.length - 1)
                      );
                      const activeImageUrl = currentImages[safeActivePreviewIndex];

                      return (
                        <div className="p-5 rounded-xl border border-[#27272A] bg-[#0E0E12] space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-display font-bold text-sm text-white">
                                  Galeria de Imagens do Trabalho
                                </h4>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
                                  {currentImages.length} imagem{currentImages.length === 1 ? '' : 'ns'}
                                </span>
                              </div>
                              <p className="text-xs text-[#A1A1AA] mt-0.5">
                                Adicione quantas fotos/artes quiser para este trabalho. O visitante poderá passar as imagens usando os botões laterais no site.
                              </p>
                            </div>

                            {currentImages.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono text-zinc-400">
                                  Prévia ativa: #{safeActivePreviewIndex + 1} de {currentImages.length}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Image Preview & Upload Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Preview Box with Side Navigation Controls in Admin */}
                            <div
                              style={{
                                aspectRatio:
                                  editingProject.aspectRatio === '1920x1080'
                                    ? '1080 / 1920'
                                    : editingProject.aspectRatio === '1350x1080'
                                    ? '1080 / 1350'
                                    : editingProject.aspectRatio === '1080x1080'
                                    ? '1 / 1'
                                    : '1080 / 1920',
                              }}
                              className="md:col-span-5 max-h-[360px] w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0A0A0C] relative flex items-center justify-center shadow-lg transition-all group/adminPreview"
                            >
                              {/* Badge de formato na prévia */}
                              <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 flex items-center gap-1 shadow">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    editingProject.aspectRatio === '1920x1080' ? 'bg-emerald-400' : 'bg-amber-400'
                                  }`}
                                />
                                <span>
                                  {editingProject.aspectRatio === '1920x1080'
                                    ? '1920×1080'
                                    : editingProject.aspectRatio === '1350x1080'
                                    ? '1350×1080'
                                    : editingProject.aspectRatio || 'Vertical'}
                                </span>
                              </div>

                              {/* Badge de Capa */}
                              {safeActivePreviewIndex === 0 && activeImageUrl && (
                                <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded bg-emerald-500 text-black font-bold text-[10px] font-mono flex items-center gap-1 shadow">
                                  <Star className="w-3 h-3 fill-black text-black" />
                                  <span>Capa Principal</span>
                                </div>
                              )}

                              {activeImageUrl ? (
                                <>
                                  <div
                                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-45 pointer-events-none transition-all duration-300"
                                    style={{ backgroundImage: `url(${activeImageUrl})` }}
                                    aria-hidden="true"
                                  />
                                  <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />
                                  <img
                                    src={activeImageUrl}
                                    alt={editingProject.title}
                                    className={`relative z-10 w-full h-full ${
                                      editingProject.fitMode === 'cover' ? 'object-cover' : 'object-contain'
                                    } p-1`}
                                  />

                                  {/* Botões laterais na prévia do Admin */}
                                  {currentImages.length > 1 && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setActiveImagePreviewIndex((prev) =>
                                            prev > 0 ? prev - 1 : currentImages.length - 1
                                          )
                                        }
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-all shadow-lg hover:scale-110 cursor-pointer"
                                        title="Imagem anterior"
                                      >
                                        <ChevronLeft className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setActiveImagePreviewIndex((prev) =>
                                            prev < currentImages.length - 1 ? prev + 1 : 0
                                          )
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-all shadow-lg hover:scale-110 cursor-pointer"
                                        title="Próxima imagem"
                                      >
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
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

                            {/* Controls Column */}
                            <div className="md:col-span-7 space-y-4">
                              {/* File input accepting multiple files */}
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleProjectImageUpload}
                                accept="image/*"
                                multiple
                                className="hidden"
                              />

                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isOptimizingImage || isSaving}
                                  className="flex-1 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                  {isOptimizingImage ? (
                                    <>
                                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                                      <span>Otimizando Imagem(ns)...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4 text-emerald-400" />
                                      <span>+ Carregar Imagens do Dispositivo (Múltiplas)</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                                <span className="text-emerald-400">✨</span>
                                <span>Pode selecionar 1 ou várias imagens de uma vez. Otimização em WebP sem perda de detalhes.</span>
                              </p>

                              {/* Adicionar por URL */}
                              <div className="space-y-1.5 pt-1 border-t border-[#27272A]/80">
                                <label className="text-[11px] font-mono text-zinc-400">
                                  Ou adicione imagem por link direto (URL):
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newImageUrlInput}
                                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddImageUrl();
                                      }
                                    }}
                                    placeholder="https://exemplo.com/outra-foto.jpg"
                                    className="flex-1 px-3 py-2 bg-[#141418] border border-[#27272A] rounded-lg text-white text-xs focus:outline-none focus:border-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleAddImageUrl}
                                    disabled={!newImageUrlInput.trim()}
                                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white text-xs font-medium border border-zinc-700 transition-colors whitespace-nowrap"
                                  >
                                    + Adicionar URL
                                  </button>
                                </div>
                              </div>

                              {/* Lista / Grid de Miniaturas de Todas as Imagens Cadastradas */}
                              {currentImages.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-[#27272A]">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                                      <span>Imagens cadastradas ({currentImages.length})</span>
                                    </label>
                                    <span className="text-[10px] font-mono text-zinc-500">
                                      Clique para inspecionar
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1.5 bg-[#121215] rounded-xl border border-[#27272A]">
                                    {currentImages.map((imgUrl, idx) => {
                                      const isCover = idx === 0;
                                      const isSelected = idx === safeActivePreviewIndex;
                                      return (
                                        <div
                                          key={idx}
                                          onClick={() => setActiveImagePreviewIndex(idx)}
                                          className={`group relative rounded-lg border overflow-hidden transition-all cursor-pointer flex flex-col ${
                                            isSelected
                                              ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400/50'
                                              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                                          }`}
                                        >
                                          {/* Thumbnail image */}
                                          <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                                            <img
                                              src={imgUrl}
                                              alt={`Foto ${idx + 1}`}
                                              className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 backdrop-blur-sm text-[8px] font-mono text-zinc-300">
                                              #{idx + 1}
                                            </div>
                                            {isCover && (
                                              <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-emerald-500 text-black font-bold text-[8px] font-mono flex items-center gap-0.5">
                                                <Star className="w-2.5 h-2.5 fill-black" />
                                                <span>CAPA</span>
                                              </div>
                                            )}
                                          </div>

                                          {/* Thumbnail Action Bar */}
                                          <div className="p-1.5 flex items-center justify-between gap-1 bg-[#0A0A0C]">
                                            {!isCover ? (
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleSetCoverImage(idx);
                                                }}
                                                className="text-[9px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                                                title="Tornar imagem de capa principal"
                                              >
                                                <Star className="w-2.5 h-2.5" />
                                                <span>Virar Capa</span>
                                              </button>
                                            ) : (
                                              <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                                                Capa Principal
                                              </span>
                                            )}

                                            <div className="flex items-center gap-0.5 ml-auto">
                                              {idx > 0 && (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveImage(idx, idx - 1);
                                                  }}
                                                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                                                  title="Mover para esquerda"
                                                >
                                                  <ArrowLeft className="w-2.5 h-2.5" />
                                                </button>
                                              )}
                                              {idx < currentImages.length - 1 && (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveImage(idx, idx + 1);
                                                  }}
                                                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                                                  title="Mover para direita"
                                                >
                                                  <ArrowRight className="w-2.5 h-2.5" />
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemoveImageAtIndex(idx);
                                                }}
                                                className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40 ml-1"
                                                title="Excluir imagem"
                                              >
                                                <Trash2 className="w-2.5 h-2.5" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Ajuste da imagem no card */}
                              {currentImages.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                  <label className="text-[11px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                                    <span>Ajuste da Imagem nos Cards</span>
                                    <span className="text-[10px] text-emerald-400">
                                      {editingProject.fitMode === 'cover'
                                        ? 'Preenchendo moldura'
                                        : 'Sem cortar · Inteira evidente'}
                                    </span>
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingProject({ ...editingProject, fitMode: 'contain' })
                                      }
                                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all text-left flex items-center justify-between ${
                                        editingProject.fitMode !== 'cover'
                                          ? 'bg-white text-black border-white font-semibold'
                                          : 'bg-[#141418] text-zinc-400 border-[#27272A] hover:border-zinc-500'
                                      }`}
                                    >
                                      <span>Inteira (Sem Cortar)</span>
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/10">Evidente</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingProject({ ...editingProject, fitMode: 'cover' })
                                      }
                                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all text-left flex items-center justify-between ${
                                        editingProject.fitMode === 'cover'
                                          ? 'bg-white text-black border-white font-semibold'
                                          : 'bg-[#141418] text-zinc-400 border-[#27272A] hover:border-zinc-500'
                                      }`}
                                    >
                                      <span>Preencher Tudo</span>
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-300">Cover</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {currentImages.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProject({
                                      ...editingProject,
                                      customImageUrl: '',
                                      images: [],
                                    });
                                    setActiveImagePreviewIndex(0);
                                  }}
                                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 pt-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remover todas as imagens</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

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
                            onChange={(e) => {
                              const newCat = e.target.value as ProjectCategory;
                              let newAr = editingProject.aspectRatio;
                              if (newCat === 'Matchday') newAr = '1350x1080';
                              if (newCat === 'Site') newAr = '1920x1080';
                              setEditingProject({
                                ...editingProject,
                                category: newCat,
                                aspectRatio: newAr,
                              });
                            }}
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

                      {/* Format / Grid Row Selector */}
                      <div className="space-y-2 pt-2 border-t border-[#27272A]/70">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-2">
                            <span>Formato & Fila da Arte (Tamanho)</span>
                            <span className="text-zinc-600">·</span>
                            <span className="text-emerald-400 text-[10px] lowercase">
                              {editingProject.aspectRatio === '1350x1080'
                                ? '4 por fila no portfólio (Matchdays & Cartazes)'
                                : editingProject.aspectRatio === '1920x1080'
                                ? '4 por fila no portfólio (Retângulos Verticais)'
                                : '4 por fila'}
                            </span>
                          </label>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            {
                              id: '1350x1080',
                              name: '1350×1080',
                              sub: '4 por fila · Fila 1 (Matchday)',
                              badge: 'Fila 1',
                            },
                            {
                              id: '1920x1080',
                              name: '1920×1080',
                              sub: '4 por fila · Fila 2 (Vertical)',
                              badge: 'Fila 2',
                            },
                            {
                              id: '1080x1080',
                              name: '1080×1080',
                              sub: '3 por fila · Quadrado',
                              badge: 'Feed',
                            },
                            {
                              id: '4:3',
                              name: '4:3 Clássico',
                              sub: '3 por fila · Editorial',
                              badge: 'Padrão',
                            },
                          ].map((fmt) => {
                            const isSelected = (editingProject.aspectRatio || '4:3') === fmt.id;
                            return (
                              <button
                                key={fmt.id}
                                type="button"
                                onClick={() => {
                                  let updatedCat = editingProject.category;
                                  if (fmt.id === '1920x1080' && updatedCat === 'Matchday') {
                                    updatedCat = 'Artes 1920x1080';
                                  } else if (fmt.id === '1350x1080' && updatedCat === 'Artes 1920x1080') {
                                    updatedCat = 'Matchday';
                                  }
                                  setEditingProject({
                                    ...editingProject,
                                    aspectRatio: fmt.id,
                                    category: updatedCat,
                                  });
                                }}
                                className={`p-2.5 rounded-lg border text-left transition-all ${
                                  isSelected
                                    ? 'bg-white text-black border-white shadow-md'
                                    : 'bg-[#141418] text-zinc-400 border-[#27272A] hover:border-zinc-500 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-bold text-xs">{fmt.name}</span>
                                  <span
                                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                      isSelected
                                        ? 'bg-black text-white'
                                        : 'bg-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {fmt.badge}
                                  </span>
                                </div>
                                <p
                                  className={`text-[10px] leading-tight ${
                                    isSelected ? 'text-zinc-800 font-medium' : 'text-zinc-500'
                                  }`}
                                >
                                  {fmt.sub}
                                </p>
                              </button>
                            );
                          })}
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
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#27272A] flex-wrap">
                      {!isCreatingNew && (
                        <button
                          type="button"
                          onClick={() => setProjectToDelete({ id: editingProject.id, title: editingProject.title })}
                          className="px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 rounded-lg border border-red-900/50 bg-red-950/20 hover:bg-red-950/40 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir Este Projeto</span>
                        </button>
                      )}
                      <div className="flex items-center gap-3 ml-auto">
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
                      {projects.map((proj) => {
                        const openEditor = () => {
                          const projImgs = proj.images && proj.images.length > 0
                            ? [...proj.images]
                            : (proj.customImageUrl ? [proj.customImageUrl] : []);
                          setEditingProject({
                            ...proj,
                            images: projImgs,
                            customImageUrl: projImgs[0] || proj.customImageUrl || '',
                          });
                          setActiveImagePreviewIndex(0);
                          setNewImageUrlInput('');
                          setIsCreatingNew(false);
                        };

                        return (
                          <div
                            key={proj.id}
                            className="p-4 rounded-xl border border-[#27272A] bg-[#0E0E12] flex gap-4 items-center justify-between hover:border-zinc-500 transition-colors group"
                          >
                            <div
                              onClick={openEditor}
                              className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                              title="Clique para editar este trabalho"
                            >
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
                                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 flex-wrap">
                                  <span>{proj.year}</span>
                                  <span>·</span>
                                  <span className="text-zinc-200 font-semibold">{proj.category}</span>
                                  <span>·</span>
                                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[9px] text-zinc-300 border border-zinc-700">
                                    {proj.aspectRatio === '1350x1080'
                                      ? '1350×1080'
                                      : proj.aspectRatio === '1920x1080'
                                      ? '1920×1080'
                                      : proj.aspectRatio || '4:3'}
                                  </span>
                                  {proj.images && proj.images.length > 1 && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/40 text-[9px] font-mono">
                                      {proj.images.length} fotos
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-display font-bold text-sm text-white truncate mt-0.5 group-hover:text-emerald-400 transition-colors">
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
                                const projImgs = proj.images && proj.images.length > 0
                                  ? [...proj.images]
                                  : (proj.customImageUrl ? [proj.customImageUrl] : []);
                                setEditingProject({
                                  ...proj,
                                  images: projImgs,
                                  customImageUrl: projImgs[0] || proj.customImageUrl || '',
                                });
                                setActiveImagePreviewIndex(0);
                                setNewImageUrlInput('');
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
                      );
                    })}
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

        {/* Custom In-App Delete Confirmation Modal (Iframe-safe, zero window.confirm) */}
        {projectToDelete && (
          <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2.5 rounded-full bg-red-950/60 border border-red-800/40">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Excluir Projeto</h4>
                  <p className="text-xs text-zinc-400">Sincronização imediata na nuvem</p>
                </div>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed">
                Tem certeza que deseja apagar o projeto <strong className="text-white">"{projectToDelete.title}"</strong>?
              </p>
              <p className="text-xs text-zinc-400">
                Esta ação removerá este trabalho de todos os navegadores e da galeria do portfólio.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const target = projectToDelete;
                    setProjectToDelete(null);
                    await confirmDeleteProject(target.id, target.title);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sim, Excluir Definitivamente</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom In-App Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400">
                <div className="p-2.5 rounded-full bg-amber-950/60 border border-amber-800/40">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Restaurar Versão Padrão</h4>
                  <p className="text-xs text-zinc-400">Redefinir projetos</p>
                </div>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed">
                Deseja restaurar os projetos padrão do portfólio? Todas as artes personalizadas serão substituídas.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmResetToDefaults}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
