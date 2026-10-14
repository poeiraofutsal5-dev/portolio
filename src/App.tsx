import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { DesignSystemGuideModal } from './components/DesignSystemGuideModal';
import { AdminEditorModal } from './components/AdminEditorModal';
import { Toast } from './components/Toast';
import { Project } from './types';
import { JPX_PROJECTS } from './data/portfolioData';
import {
  subscribeToStudioConfig,
  saveStudioConfigToFirebase,
  testConnection,
  STUDIO_CONFIG_DOC_ID,
} from './lib/firebase';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [contactPrefillService, setContactPrefillService] = useState<string>('');
  const isInitializedRef = useRef(false);

  // Dynamic projects with localStorage cached fallback
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('jpx_custom_projects_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Erro ao ler projetos salvos:', err);
    }
    return JPX_PROJECTS;
  });

  // Dynamic footer logo with localStorage cached fallback
  const [footerLogo, setFooterLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('jpx_custom_footer_logo_v1') || null;
    } catch {
      return null;
    }
  });

  const [footerLogoHeight, setFooterLogoHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('jpx_custom_footer_logo_height_v1');
      return saved ? parseInt(saved, 10) : 32;
    } catch {
      return 32;
    }
  });

  // Real-time synchronization across all devices via Firebase Firestore
  useEffect(() => {
    // Validate connection
    testConnection();

    // Subscribe to live cloud updates
    const unsubscribe = subscribeToStudioConfig((cloudData) => {
      isInitializedRef.current = true;
      setProjects(cloudData.projects);
      setFooterLogo(cloudData.footerLogo);
      setFooterLogoHeight(cloudData.footerLogoHeight);

      // Keep local cache fresh for instant offline access
      try {
        localStorage.setItem('jpx_custom_projects_v1', JSON.stringify(cloudData.projects));
        if (cloudData.footerLogo) {
          localStorage.setItem('jpx_custom_footer_logo_v1', cloudData.footerLogo);
        } else {
          localStorage.removeItem('jpx_custom_footer_logo_v1');
        }
        localStorage.setItem('jpx_custom_footer_logo_height_v1', cloudData.footerLogoHeight.toString());
      } catch (e) {
        console.warn('Erro ao atualizar cache local:', e);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSelectProjectForContact = (projectName: string) => {
    setContactPrefillService(projectName);
  };

  const handleSelectSpecialtyForContact = (specialtyTitle: string) => {
    setContactPrefillService(specialtyTitle);
  };

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Save changes to both local cache and Firebase Cloud so all devices sync instantly
  const handleSaveProjects = async (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem('jpx_custom_projects_v1', JSON.stringify(updatedProjects));
    } catch (err) {
      console.error('Erro ao salvar projetos no storage:', err);
    }

    try {
      await saveStudioConfigToFirebase(updatedProjects, footerLogo, footerLogoHeight);
      showToast('Sincronizado na nuvem com todos os dispositivos!');
    } catch (err) {
      console.error('Erro ao sincronizar com Firebase:', err);
      showToast('Salvo localmente (offline)');
    }
  };

  const handleSaveFooterLogo = async (logoUrl: string | null) => {
    setFooterLogo(logoUrl);
    try {
      if (logoUrl) {
        localStorage.setItem('jpx_custom_footer_logo_v1', logoUrl);
      } else {
        localStorage.removeItem('jpx_custom_footer_logo_v1');
      }
    } catch (err) {
      console.error('Erro ao salvar logo do rodapé:', err);
    }

    try {
      await saveStudioConfigToFirebase(projects, logoUrl, footerLogoHeight);
      showToast('Logo sincronizada na nuvem com todos os dispositivos!');
    } catch (err) {
      console.error('Erro ao sincronizar com Firebase:', err);
    }
  };

  const handleSaveFooterLogoHeight = async (height: number) => {
    setFooterLogoHeight(height);
    try {
      localStorage.setItem('jpx_custom_footer_logo_height_v1', height.toString());
    } catch (err) {
      console.error('Erro ao salvar altura da logo do rodapé:', err);
    }

    try {
      await saveStudioConfigToFirebase(projects, footerLogo, height);
    } catch (err) {
      console.error('Erro ao sincronizar com Firebase:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F4F5] flex flex-col selection:bg-white selection:text-black">
      {/* Top Navigation with gray Lock icon beside Iniciar Projeto */}
      <Header onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          projects={projects}
          onScrollToProjects={() => scrollToSection('projetos')}
          onScrollToContact={() => scrollToSection('contato')}
          onOpenProject={handleOpenProject}
        />

        {/* Selected Works (Typographic Grid with Real-Time Edit Support) */}
        <ProjectsSection
          projects={projects}
          onOpenProject={handleOpenProject}
        />

        {/* About & Specialties Section */}
        <AboutSection onSelectSpecialtyForContact={handleSelectSpecialtyForContact} />

        {/* Contact Section ("Vamos trabalhar juntos?" + Briefing WhatsApp Form + Socials) */}
        <ContactSection
          selectedProjectOrService={contactPrefillService}
          onShowToast={showToast}
        />
      </main>

      {/* Minimalist Studio Footer with Customizable Logo */}
      <Footer
        customLogoUrl={footerLogo}
        logoHeight={footerLogoHeight}
      />

      {/* Case Study Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProjectForContact={handleSelectProjectForContact}
        onShowToast={showToast}
      />

      {/* Admin Editor Modal (Password: jpx00) */}
      <AdminEditorModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        onSaveProjects={handleSaveProjects}
        footerLogo={footerLogo}
        onSaveFooterLogo={handleSaveFooterLogo}
        footerLogoHeight={footerLogoHeight}
        onSaveFooterLogoHeight={handleSaveFooterLogoHeight}
        onShowToast={showToast}
      />

      {/* Design System, Copywriting & Implementation Guide Modal */}
      <DesignSystemGuideModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} />
    </div>
  );
}
