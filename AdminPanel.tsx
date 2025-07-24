import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { useAdminPanel } from '../contexts/AdminPanelContext';
import { getSiteContent, saveSiteContent, resetSiteContent } from '../services/siteContent';
import type { SiteContent, Service, Project, SocialLink, CyclingContent, IconSource, FooterContent, HomepageContent, AboutPageContent } from '../types';
import * as LucideIcons from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const { X, Save, RefreshCw, Trash2, Plus, ChevronDown, ChevronUp, Palette, Home, LayoutTemplate, MessageSquare, Info, Phone, Settings, Briefcase, LogIn, LogOut, Wand2, Loader2 } = LucideIcons;

type AdminSection = 'branding' | 'header' | 'footer' | 'homepage' | 'about' | 'services' | 'projects' | 'contact' | 'popup';

const sectionConfig: Record<AdminSection, { label: string; icon: React.ElementType }> = {
    branding: { label: 'Branding', icon: Palette },
    header: { label: 'Header', icon: LayoutTemplate },
    footer: { label: 'Footer', icon: LayoutTemplate },
    homepage: { label: 'Homepage', icon: Home },
    about: { label: 'About Page', icon: Info },
    popup: { label: 'Announcement Popup', icon: MessageSquare },
    services: { label: 'Services', icon: Settings },
    projects: { label: 'Projects', icon: Briefcase },
    contact: { label: 'Contact Page', icon: Phone },
};

const InputField = ({ label, value, onChange, id, type = 'text', placeholder = '' }) => (
    <div id={`input-wrapper-${id}`}>
        <label htmlFor={id} className="block text-sm font-medium text-brand-gray/80 mb-1">{label}</label>
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
    </div>
);

const TextareaField = ({ label, value, onChange, id, rows = 3, placeholder = '', description = '' }) => (
     <div id={`textarea-wrapper-${id}`}>
        <label htmlFor={id} className="block text-sm font-medium text-brand-gray/80 mb-1">{label}</label>
        <textarea id={id} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors resize-y"/>
        {description && <p className="mt-1.5 text-xs text-brand-gray/70">{description}</p>}
    </div>
);

const SelectField = ({ label, value, onChange, id, children }) => (
     <div id={`select-wrapper-${id}`}>
        <label htmlFor={id} className="block text-sm font-medium text-brand-gray/80 mb-1">{label}</label>
        <div id={`select-inner-wrapper-${id}`} className="relative">
            <select id={id} value={value} onChange={onChange} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg pl-3 pr-8 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors appearance-none">
             {children}
            </select>
             <div id={`select-chevron-wrapper-${id}`} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-gray">
                <ChevronDown size={16} />
            </div>
        </div>
    </div>
);

const ColorField = ({ label, value, onChange, id }) => (
    <div id={`color-wrapper-${id}`} className="flex items-center">
        <label htmlFor={id} className="text-sm font-medium text-brand-gray/80 mr-2">{label}</label>
        <input id={id} type="color" value={value} onChange={onChange} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"/>
        <span className="ml-2 text-brand-light">{value}</span>
    </div>
);

const ToggleSwitch = ({ label, checked, onChange, id }) => (
    <div className="flex items-center justify-between bg-brand-bg p-3 rounded-lg border border-brand-primary/30">
        <label htmlFor={id} className="font-semibold text-brand-light">{label}</label>
        <button
            type="button"
            id={id}
            onClick={() => onChange(!checked)}
            className={`${checked ? 'bg-brand-secondary' : 'bg-brand-surface'} relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors`}
            role="switch"
            aria-checked={checked}
        >
            <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
    </div>
);

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean, id: string }> = ({ title, children, defaultOpen = false, id }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
        setIsOpen(defaultOpen);
    }, [defaultOpen]);
    
    return (
        <div id={id} className="bg-brand-surface/50 rounded-lg border border-brand-primary/10">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <h3 className="font-bold font-heading text-brand-light">{title}</h3>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && (
                <div id={`${id}-content`} className="p-4 border-t border-brand-primary/10 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const LoginForm: React.FC = () => {
    const { login } = useAdminPanel();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(password);
        if (!success) {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
        setIsLoading(false);
    };

    return (
        <div id="admin-login-container" className="flex flex-col items-center justify-center h-full w-full">
            <div id="admin-login-form-wrapper" className="bg-brand-surface p-8 rounded-2xl shadow-2xl border border-brand-primary/20 w-full max-w-sm">
                <h2 className="text-2xl font-bold font-heading text-brand-light text-center mb-2">Admin Access</h2>
                <p className="text-brand-gray/70 text-center mb-6">Please enter the master password to continue.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div id="admin-login-input-wrapper">
                        <label htmlFor="master-password" className="sr-only">Master Password</label>
                        <input
                            id="master-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Master Password"
                            className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-4 py-3 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors text-center"
                        />
                    </div>
                    {error && <p id="admin-login-error" className="text-sm text-red-400 text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center px-6 py-3 font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 transition-all transform hover:scale-105 disabled:bg-brand-gray disabled:cursor-not-allowed disabled:transform-none">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Authenticating...' : 'Authenticate'}
                    </button>
                </form>
            </div>
        </div>
    );
};


const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const AdminPanel: React.FC = () => {
    const { isOpen, closePanel, isAuthenticated, login, logout } = useAdminPanel();
    const [content, setContent] = useState<SiteContent | null>(null);
    const [activeSection, setActiveSection] = useState<AdminSection>('branding');
    const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
    const adminContentRef = useRef<HTMLDivElement>(null);
    const [projectUiState, setProjectUiState] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useLayoutEffect(() => {
        if (newlyAddedId && adminContentRef.current) {
            const element = adminContentRef.current.querySelector(`#admin-item-${newlyAddedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('flash-highlight');
                setTimeout(() => {
                    element.classList.remove('flash-highlight');
                }, 2000);
            }
            setNewlyAddedId(null);
        }
    }, [newlyAddedId]);

    useEffect(() => {
        if (content?.projects) {
            setProjectUiState(prev => {
                const newState = {...prev};
                content.projects.forEach(p => {
                    if (!newState[p.id]) {
                        newState[p.id] = {
                            showGenerator: false,
                            prompt: '',
                            aspectRatio: '16:9',
                            generationStatus: 'idle',
                            generationError: ''
                        };
                    }
                });
                return newState;
            });
        }
    }, [content?.projects]);
    
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            const loadedContent = getSiteContent();
            // Ensure splashScreen data exists for backward compatibility with old localStorage data
            if (!loadedContent.branding.splashScreen) {
                loadedContent.branding.splashScreen = {
                    brandName: "Kaste Brands & Designs",
                    description: "Building Bold Brands & Smart Solutions",
                };
            }
            if (!loadedContent.popup) { // Ensure popup data exists
                loadedContent.popup = {
                    enabled: false,
                    type: 'announcement',
                    icon: 'Megaphone',
                    title: 'New Announcement!',
                    message: 'Check out our latest news or special offers.',
                    ctaText: 'Learn More',
                    ctaLink: '/about',
                    imageUrl: ''
                };
            }
             if (!('type' in loadedContent.popup)) {
                (loadedContent.popup as any).type = 'announcement';
            }
            if (!('imageUrl' in loadedContent.popup)) {
              loadedContent.popup.imageUrl = '';
            }
            setContent(loadedContent);
        } else {
            setContent(null);
        }
    }, [isOpen, isAuthenticated]);

    const updateProjectUiState = (projectId, updates) => {
        setProjectUiState(prev => ({
            ...prev,
            [projectId]: { ...prev[projectId], ...updates }
        }));
    };

    const handleGenerateImage = async (projectIndex: number, projectId: string) => {
        const currentState = projectUiState[projectId];
        if (!currentState.prompt) {
            updateProjectUiState(projectId, { generationStatus: 'error', generationError: 'Please enter a prompt for the image.' });
            return;
        }

        updateProjectUiState(projectId, { generationStatus: 'loading', generationError: '' });
        
        try {
            const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
            if (!apiKey) {
              throw new Error("API Key is not configured.");
            }
            
            const ai = new GoogleGenAI({ apiKey: apiKey });
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: currentState.prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: currentState.aspectRatio,
                },
            });
            
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            
            handleContentChange(`projects.${projectIndex}.imageUrl`, imageUrl);
            updateProjectUiState(projectId, { generationStatus: 'success' });
            
        } catch (error) {
            console.error("Image generation failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            updateProjectUiState(projectId, { generationStatus: 'error', generationError: `Failed to generate: ${errorMessage}` });
        }
    };

    const handleContentChange = (path: string, value: any) => {
        setContent(prevContent => {
            if (!prevContent) return null;
            const keys = path.split('.');
            const newContent = JSON.parse(JSON.stringify(prevContent));
            let current: any = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newContent;
        });
    };

    const handleProjectPresentationChange = (projectIndex: number, field: string, value: any) => {
         setContent(prevContent => {
            if (!prevContent) return null;
            const newContent = JSON.parse(JSON.stringify(prevContent));
            const project = newContent.projects[projectIndex];
            
            if (field === 'type') {
                 if (value === 'none') {
                    delete project.presentation;
                } else {
                    const oldUrls = project.presentation?.type === value ? project.presentation.urls : [];
                    project.presentation = { type: value, urls: oldUrls };
                }
            } else if (field === 'urls' && project.presentation) {
                project.presentation.urls = value;
            }
            
            return newContent;
        });
    };
    
    const handleSave = async () => {
        if (content) {
            setIsSaving(true);
            try {
                await saveSiteContent(content);
                alert('Content saved successfully! The site will now reload to apply changes.');
                window.location.reload();
            } catch (error) {
                console.error("Failed to save content:", error);
                alert('Error: Could not save content. Please check the console and try again.');
                setIsSaving(false);
            }
        }
    };
    
    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all content to default? This will immediately publish the default content and reload the page.')) {
            setIsSaving(true);
            try {
                await resetSiteContent();
                alert('Content has been reset to default. The site will now reload.');
                window.location.reload();
            } catch (error) {
                console.error("Failed to reset content:", error);
                alert('Error: Could not reset content. Please check the console and try again.');
                setIsSaving(false);
            }
        }
    };
    
    const handleAddCyclingContent = () => {
        const newId = generateId();
        const newItem: CyclingContent = { id: newId, icon: 'Sparkles', text: 'New Item' };
        const newItems = [...content.header.cyclingContent, newItem];
        handleContentChange('header.cyclingContent', newItems);
        setNewlyAddedId(newId);
    };

    const handleAddSocialLink = () => {
        const newId = generateId();
        const newLink: SocialLink = { id: newId, label: 'New Link', url: '#', iconUrl: '' };
        const newLinks = [...content.footer.socialLinks, newLink];
        handleContentChange('footer.socialLinks', newLinks);
        setNewlyAddedId(newId);
    };

    const handleAddFooterNavLink = () => {
        if (!content) return;
        const newId = generateId();
        const newItem = { id: newId, label: 'New Link', url: '#' };
        const newItems = [...content.footer.navLinks, newItem];
        handleContentChange('footer.navLinks', newItems);
        setNewlyAddedId(newId);
    };

    const handleAddService = () => {
        if (!content) return;
        const newId = generateId();
        const newService: Service = { 
            id: newId, 
            title: 'New Service', 
            description: 'A brief description of the new service.',
            longDescription: 'A more detailed description of what this service entails.',
            imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop' // A placeholder image
        };
        const newServices = [newService, ...content.services];
        handleContentChange('services', newServices);
        setNewlyAddedId(newId);
    };

    const handleDeleteService = (serviceToDelete: Service) => {
        if (!content) return;
        if (window.confirm(`Are you sure you want to delete the service "${serviceToDelete.title}"? This action cannot be undone.`)) {
            // Check if any projects are using this service
            const associatedProjects = content.projects.filter(p => p.serviceId === serviceToDelete.id);
            if (associatedProjects.length > 0) {
                if (!window.confirm(`Warning: ${associatedProjects.length} project(s) are associated with this service. Deleting the service will leave these projects without a category. Do you still want to proceed?`)) {
                    return; // User cancelled the deletion
                }
            }
            
            const newServices = content.services.filter(service => service.id !== serviceToDelete.id);
            handleContentChange('services', newServices);
        }
    };
    
    const handleAddProject = () => {
        if (!content) return;
        const newId = generateId();
        const newProject: Project = { id: newId, title: 'New Project', description: '', serviceId: content.services[0]?.id || '', status: 'live' };
        const newProjects = [newProject, ...content.projects];
        handleContentChange('projects', newProjects);
        setNewlyAddedId(newId);
    };

    const handleAddStatItem = () => {
        if (!content) return;
        const newId = generateId();
        const newItem = { id: newId, icon: 'HelpCircle', value: '0', label: 'New Stat' };
        const newItems = [...content.homepage.stats.items, newItem];
        handleContentChange('homepage.stats.items', newItems);
        setNewlyAddedId(newId);
    };

    const handleAddMissionPoint = () => {
        if (!content) return;
        const newId = generateId();
        const newItem = { id: newId, icon: 'Target', title: 'New Point', text: 'Description for the new point.' };
        const newItems = [...content.about.mission.points, newItem];
        handleContentChange('about.mission.points', newItems);
        setNewlyAddedId(newId);
    };

    const handleAddPrinciple = () => {
        if (!content) return;
        const newId = generateId();
        const newItem = { id: newId, icon: 'Lightbulb', title: 'New Principle', text: 'Description for the new principle.' };
        const newItems = [...content.about.principles.items, newItem];
        handleContentChange('about.principles.items', newItems);
        setNewlyAddedId(newId);
    };

    if (!isOpen) return null;

    if (!isAuthenticated) {
        return (
            <div id="admin-panel-backdrop" className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/90 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
                 <div id="admin-panel-container-unauthed" className="relative w-full h-full">
                    <button onClick={closePanel} className="absolute top-6 right-6 p-2 text-brand-gray/60 hover:text-brand-light transition-colors z-10" aria-label="Close admin panel">
                        <X size={24} />
                    </button>
                    <LoginForm />
                </div>
            </div>
        );
    }

    if (!content) return <div id="admin-panel-loading" className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/90 backdrop-blur-sm">Loading...</div>;

    const renderSection = () => {
        switch(activeSection) {
            case 'branding': return (
                <div id="admin-section-branding" className="space-y-4">
                    <InputField label="Logo URL (Site & Splash Screen)" id="logo-url" value={content.branding.logoUrl} onChange={e => handleContentChange('branding.logoUrl', e.target.value)} />
                    
                    <Accordion title="Splash Screen Content" id="admin-branding-splash-accordion" defaultOpen>
                        <InputField 
                            label="Brand Name" 
                            id="splash-brand-name" 
                            value={content.branding.splashScreen.brandName} 
                            onChange={e => handleContentChange('branding.splashScreen.brandName', e.target.value)} 
                        />
                        <TextareaField 
                            label="Description / Tagline" 
                            id="splash-description" 
                            value={content.branding.splashScreen.description} 
                            onChange={e => handleContentChange('branding.splashScreen.description', e.target.value)} 
                            rows={2} 
                        />
                    </Accordion>

                    <fieldset className="p-4 border border-brand-primary/20 rounded-lg">
                        <legend className="px-2 font-bold text-brand-light">Colors</legend>
                        <div id="admin-branding-colors-grid" className="grid grid-cols-2 gap-4">
                            {Object.entries(content.branding.colors).map(([key, value]) => (
                                <ColorField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} id={`color-${key}`} value={value} onChange={e => handleContentChange(`branding.colors.${key}`, e.target.value)} />
                            ))}
                        </div>
                    </fieldset>
                </div>
            );
            case 'header': return (
                <div id="admin-section-header" className="space-y-4">
                    <fieldset className="p-4 border border-brand-primary/20 rounded-lg">
                       <legend className="px-2 font-bold text-brand-light">Contact Info</legend>
                       <div id="admin-header-contact-grid" className="grid grid-cols-2 gap-4">
                            <InputField label="Phone Number" id="header-phone" value={content.header.contact.phone} onChange={e => handleContentChange('header.contact.phone', e.target.value)} />
                            <InputField label="WhatsApp Number" id="header-whatsapp" value={content.header.contact.whatsapp} onChange={e => handleContentChange('header.contact.whatsapp', e.target.value)} />
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border border-brand-primary/20 rounded-lg">
                       <legend className="px-2 font-bold text-brand-light">Cycling Content</legend>
                       {content.header.cyclingContent.map((item, index) => (
                           <div key={item.id} id={`admin-item-${item.id}`} className="grid grid-cols-3 gap-2 items-end mb-2 p-2 bg-brand-bg rounded-md">
                               <InputField label="Icon Name" id={`cycle-icon-${index}`} value={item.icon} onChange={e => handleContentChange(`header.cyclingContent.${index}.icon`, e.target.value)} />
                               <InputField label="Text" id={`cycle-text-${index}`} value={item.text} onChange={e => handleContentChange(`header.cyclingContent.${index}.text`, e.target.value)} />
                               <button 
                                   id={`delete-cycle-item-${item.id}`}
                                   onClick={() => {
                                       if (window.confirm(`Are you sure you want to delete the cycling item "${item.text}"?`)) {
                                           const newItems = content.header.cyclingContent.filter(i => i.id !== item.id);
                                           handleContentChange('header.cyclingContent', newItems);
                                       }
                                   }} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button>
                           </div>
                       ))}
                       <button id="add-cycling-content-btn" onClick={handleAddCyclingContent} className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors">
                           <Plus size={16}/> Add Item
                       </button>
                    </fieldset>
                </div>
            );
            case 'footer': return (
                 <div id="admin-section-footer" className="space-y-4">
                    <TextareaField label="Tagline" id="footer-tagline" value={content.footer.tagline} onChange={e => handleContentChange('footer.tagline', e.target.value)} />
                    <fieldset className="p-4 border border-brand-primary/20 rounded-lg">
                       <legend className="px-2 font-bold text-brand-light">Contact Info</legend>
                       <div id="admin-footer-contact-grid" className="grid grid-cols-2 gap-4">
                          <InputField label="Email" id="footer-email" value={content.footer.contact.email} onChange={e => handleContentChange('footer.contact.email', e.target.value)} />
                          <InputField label="Location" id="footer-location" value={content.footer.contact.location} onChange={e => handleContentChange('footer.contact.location', e.target.value)} />
                        </div>
                    </fieldset>
                    <fieldset className="p-4 border border-brand-primary/20 rounded-lg">
                        <legend className="px-2 font-bold text-brand-light">Navigation Links</legend>
                        {content.footer.navLinks.map((link, index) => (
                            <div key={link.id} id={`admin-item-${link.id}`} className="grid grid-cols-12 gap-2 items-end mb-2 p-2 bg-brand-bg rounded-md">
                                <div className="col-span-5">
                                    <InputField label="Label" id={`nav-label-${index}`} value={link.label} onChange={e => handleContentChange(`footer.navLinks.${index}.label`, e.target.value)} />
                                </div>
                                <div className="col-span-6">
                                    <InputField label="URL" id={`nav-url-${index}`} value={link.url} onChange={e => handleContentChange(`footer.navLinks.${index}.url`, e.target.value)} />
                                </div>
                                <div className="col-span-1">
                                    <button 
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete the nav link "${link.label}"?`)) {
                                                const newLinks = content.footer.navLinks.filter(l => l.id !== link.id);
                                                handleContentChange('footer.navLinks', newLinks);
                                            }
                                        }} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                        <button onClick={handleAddFooterNavLink} className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors">
                            <Plus size={16}/> Add Nav Link
                        </button>
                    </fieldset>
                    <fieldset className="p-4 border border-brand-primary/20 rounded-lg">
                       <legend className="px-2 font-bold text-brand-light">Social Links</legend>
                       {content.footer.socialLinks.map((link, index) => (
                           <div key={link.id} id={`admin-item-${link.id}`} className="grid grid-cols-4 gap-2 items-end mb-2 p-2 bg-brand-bg rounded-md">
                               <InputField label="Label" id={`social-label-${index}`} value={link.label} onChange={e => handleContentChange(`footer.socialLinks.${index}.label`, e.target.value)} />
                               <InputField label="URL" id={`social-url-${index}`} value={link.url} onChange={e => handleContentChange(`footer.socialLinks.${index}.url`, e.target.value)} />
                               <InputField label="Icon URL" id={`social-icon-${index}`} value={link.iconUrl} onChange={e => handleContentChange(`footer.socialLinks.${index}.iconUrl`, e.target.value)} />
                               <button 
                                   id={`delete-social-link-${link.id}`}
                                   onClick={() => {
                                       if (window.confirm(`Are you sure you want to delete the social link "${link.label}"?`)) {
                                           const newLinks = content.footer.socialLinks.filter(l => l.id !== link.id);
                                           handleContentChange('footer.socialLinks', newLinks);
                                       }
                                   }} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button>
                           </div>
                       ))}
                       <button id="add-social-link-btn" onClick={handleAddSocialLink} className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors">
                           <Plus size={16}/> Add Social Link
                       </button>
                    </fieldset>
                </div>
            );
            case 'homepage': return (
                <div id="admin-section-homepage" className="space-y-4">
                    <Accordion title="Hero Section" id="admin-homepage-hero-accordion" defaultOpen>
                        <TextareaField
                            label="Title"
                            id="hero-title"
                            value={content.homepage.hero.title}
                            onChange={e => handleContentChange('homepage.hero.title', e.target.value)}
                            rows={3}
                            description="Use <br /> for line breaks."
                        />
                        <TextareaField label="Subtitle" id="hero-subtitle" value={content.homepage.hero.subtitle} onChange={e => handleContentChange('homepage.hero.subtitle', e.target.value)} />
                        <InputField label="Background Image URL" id="hero-bg" value={content.homepage.hero.backgroundImageUrl} onChange={e => handleContentChange('homepage.hero.backgroundImageUrl', e.target.value)} />
                    </Accordion>
                     <Accordion title="Client Marquee" id="admin-homepage-marquee-accordion">
                        <InputField label="Title" id="client-title" value={content.homepage.clientMarquee.title} onChange={e => handleContentChange('homepage.clientMarquee.title', e.target.value)} />
                        
                        {[0, 1].map(rowIndex => (
                            <fieldset key={`row-${rowIndex}`} className="p-4 border border-brand-primary/20 rounded-lg mt-4">
                                <legend className="px-2 font-bold text-brand-light">Row {rowIndex + 1}</legend>
                                <div className="space-y-3">
                                    {(content.homepage.clientMarquee.clients[rowIndex] || []).map((client, clientIndex) => (
                                        <div key={client.id} id={`admin-item-${client.id}`} className="grid grid-cols-12 gap-2 items-center p-2 bg-brand-bg rounded-md">
                                            <div className="col-span-5">
                                                <InputField label="Name" id={`client-name-${rowIndex}-${client.id}`} value={client.name} onChange={e => handleContentChange(`homepage.clientMarquee.clients.${rowIndex}.${clientIndex}.name`, e.target.value)} />
                                            </div>
                                            <div className="col-span-6">
                                                <InputField label="Logo URL" id={`client-logo-${rowIndex}-${client.id}`} value={client.logoUrl} onChange={e => handleContentChange(`homepage.clientMarquee.clients.${rowIndex}.${clientIndex}.logoUrl`, e.target.value)} />
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                <button
                                                    id={`delete-client-${rowIndex}-${client.id}`}
                                                    onClick={() => {
                                                        if (window.confirm(`Delete client "${client.name}"?`)) {
                                                            const newClientsMatrix = JSON.parse(JSON.stringify(content.homepage.clientMarquee.clients));
                                                            const clientRow = newClientsMatrix[rowIndex] || [];
                                                            clientRow.splice(clientIndex, 1);
                                                            newClientsMatrix[rowIndex] = clientRow;
                                                            handleContentChange('homepage.clientMarquee.clients', newClientsMatrix);
                                                        }
                                                    }}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                                                    aria-label={`Delete client ${client.name}`}
                                                ><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    id={`add-client-row-${rowIndex}`}
                                    onClick={() => {
                                        const newId = generateId();
                                        const newClient = { id: newId, name: 'New Client', logoUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753313010/client-logos/placeholder_white.svg' };
                                        const newClientsMatrix = JSON.parse(JSON.stringify(content.homepage.clientMarquee.clients));
                                        if (!newClientsMatrix[rowIndex]) {
                                            newClientsMatrix[rowIndex] = [];
                                        }
                                        newClientsMatrix[rowIndex].push(newClient);
                                        handleContentChange('homepage.clientMarquee.clients', newClientsMatrix);
                                        setNewlyAddedId(newId);
                                    }}
                                    className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors"
                                >
                                    <Plus size={16}/> Add Client to Row {rowIndex + 1}
                                </button>
                            </fieldset>
                        ))}
                    </Accordion>
                     <Accordion title="Stats Section" id="admin-homepage-stats-accordion">
                         <InputField label="Title" id="stats-title" value={content.homepage.stats.title} onChange={e => handleContentChange('homepage.stats.title', e.target.value)} />
                         <InputField label="Subtitle" id="stats-subtitle" value={content.homepage.stats.subtitle} onChange={e => handleContentChange('homepage.stats.subtitle', e.target.value)} />
                         <div className="space-y-3 mt-4 pt-4 border-t border-brand-primary/20">
                            {content.homepage.stats.items.map((stat, index) => (
                                <div key={stat.id} id={`admin-item-${stat.id}`} className="grid grid-cols-12 gap-2 items-end p-2 bg-brand-bg rounded-md">
                                    <div className="col-span-3"><InputField label="Icon" id={`stat-icon-${index}`} value={stat.icon} onChange={e => handleContentChange(`homepage.stats.items.${index}.icon`, e.target.value)} /></div>
                                    <div className="col-span-3"><InputField label="Value" id={`stat-value-${index}`} value={stat.value} onChange={e => handleContentChange(`homepage.stats.items.${index}.value`, e.target.value)} /></div>
                                    <div className="col-span-5"><InputField label="Label" id={`stat-label-${index}`} value={stat.label} onChange={e => handleContentChange(`homepage.stats.items.${index}.label`, e.target.value)} /></div>
                                    <div className="col-span-1 flex justify-end"><button onClick={() => { if(window.confirm(`Delete stat "${stat.label}"?`)) { const newItems = content.homepage.stats.items.filter(i => i.id !== stat.id); handleContentChange('homepage.stats.items', newItems); }}} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button></div>
                                </div>
                            ))}
                         </div>

                         <button onClick={handleAddStatItem} className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors">
                             <Plus size={16}/> Add Stat Item
                         </button>
                    </Accordion>
                    <Accordion title="Tabs Section" id="admin-homepage-tabs-accordion">
                        <InputField label="Title" id="tabs-title" value={content.homepage.tabsSection.title} onChange={e => handleContentChange('homepage.tabsSection.title', e.target.value)} />
                        <InputField label="Subtitle" id="tabs-subtitle" value={content.homepage.tabsSection.subtitle} onChange={e => handleContentChange('homepage.tabsSection.subtitle', e.target.value)} />
                        
                        {content.homepage.tabsSection.tabs.map((tab, tabIndex) => (
                            <fieldset key={tab.id} id={`admin-tabs-fieldset-${tab.id}`} className="p-4 border border-brand-primary/20 rounded-lg mt-4">
                                <legend className="px-2 font-bold text-brand-light">{tab.label} Items</legend>
                                <div className="space-y-4">
                                    {tab.items.map((item, itemIndex) => (
                                        <div key={item.id} id={`admin-tab-item-${tab.id}-${item.id}`} className="p-3 bg-brand-bg rounded-md grid grid-cols-2 gap-x-4 gap-y-3 relative">
                                            <div className="col-span-2">
                                                <InputField 
                                                    label="Title" 
                                                    id={`tab-item-title-${tab.id}-${item.id}`}
                                                    value={item.title} 
                                                    onChange={e => handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items.${itemIndex}.title`, e.target.value)} 
                                                />
                                            </div>

                                            <SelectField
                                                label="Icon Type"
                                                id={`tab-item-icon-type-${tab.id}-${item.id}`}
                                                value={item.icon.type}
                                                onChange={e => handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items.${itemIndex}.icon.type`, e.target.value)}
                                            >
                                                <option value="custom">Custom Component</option>
                                                <option value="lucide">Lucide Icon</option>
                                                <option value="url">Image URL</option>
                                            </SelectField>
                                            
                                            <InputField 
                                                label="Icon Value" 
                                                id={`tab-item-icon-value-${tab.id}-${item.id}`}
                                                value={item.icon.value}
                                                onChange={e => handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items.${itemIndex}.icon.value`, e.target.value)}
                                                placeholder={
                                                    item.icon.type === 'url' ? 'https://.../icon.svg' :
                                                    item.icon.type === 'lucide' ? 'IconName' : 'ComponentName'
                                                }
                                            />

                                            <div className="col-span-2">
                                                <TextareaField
                                                    label="Description"
                                                    id={`tab-item-desc-${tab.id}-${item.id}`}
                                                    value={item.description}
                                                    onChange={e => handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items.${itemIndex}.description`, e.target.value)}
                                                    rows={2}
                                                />
                                            </div>
                                            
                                            <div className="col-span-2">
                                                <InputField 
                                                    label="Icon CSS Classes (Optional)" 
                                                    id={`tab-item-icon-class-${tab.id}-${item.id}`}
                                                    value={item.iconClassName || ''}
                                                    onChange={e => handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items.${itemIndex}.iconClassName`, e.target.value)}
                                                />
                                            </div>
                                            
                                             <button
                                                id={`delete-tab-item-${tab.id}-${item.id}`}
                                                onClick={() => {
                                                    if(window.confirm(`Are you sure you want to delete the item "${item.title}"?`)) {
                                                        const newItems = [...tab.items];
                                                        newItems.splice(itemIndex, 1);
                                                        handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items`, newItems);
                                                    }
                                                }}
                                                className="absolute top-2 right-2 p-1.5 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                                                aria-label={`Delete item ${item.title}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                     <button
                                        id={`add-tab-item-btn-${tab.id}`}
                                        onClick={() => {
                                            const newId = generateId();
                                            const newItem = { 
                                                id: newId,
                                                icon: { type: 'lucide', value: 'HelpCircle' } as IconSource, 
                                                title: 'New Item', 
                                                description: 'A new description.',
                                                iconClassName: ''
                                            };
                                            const newItems = [...tab.items, newItem];
                                            handleContentChange(`homepage.tabsSection.tabs.${tabIndex}.items`, newItems);
                                            setNewlyAddedId(newId);
                                        }}
                                        className="mt-4 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors"
                                    >
                                        <Plus size={16}/> Add Item to {tab.label}
                                    </button>
                                </div>
                            </fieldset>
                        ))}
                    </Accordion>
                </div>
            );
            case 'about': return (
                 <div id="admin-section-about" className="space-y-4">
                    <Accordion title="Hero Section" id="admin-about-hero-accordion" defaultOpen>
                        <TextareaField label="Title" id="about-hero-title" value={content.about.hero.title} onChange={e => handleContentChange('about.hero.title', e.target.value)} />
                        <InputField label="Highlighted Text" id="about-hero-highlight" value={content.about.hero.highlightedText} onChange={e => handleContentChange('about.hero.highlightedText', e.target.value)} />
                        <TextareaField label="Subtitle" id="about-hero-subtitle" value={content.about.hero.subtitle} onChange={e => handleContentChange('about.hero.subtitle', e.target.value)} />
                    </Accordion>
                    <Accordion title="Mission Section" id="admin-about-mission-accordion">
                        <InputField label="Title" id="about-mission-title" value={content.about.mission.title} onChange={e => handleContentChange('about.mission.title', e.target.value)} />
                        <TextareaField label="Body Text" id="about-mission-body" rows={5} value={content.about.mission.body} onChange={e => handleContentChange('about.mission.body', e.target.value)} />
                        <InputField label="Image URL" id="about-mission-img" value={content.about.mission.imageUrl} onChange={e => handleContentChange('about.mission.imageUrl', e.target.value)} />
                        
                        <div className="space-y-3 mt-4 pt-4 border-t border-brand-primary/20">
                            <h4 className="font-semibold text-brand-light">Mission Points</h4>
                            {content.about.mission.points.map((point, index) => (
                                <div key={point.id} id={`admin-item-${point.id}`} className="grid grid-cols-1 gap-y-2 p-2 bg-brand-bg rounded-md relative">
                                    <InputField label="Icon" id={`mission-icon-${index}`} value={point.icon} onChange={e => handleContentChange(`about.mission.points.${index}.icon`, e.target.value)} />
                                    <InputField label="Title" id={`mission-title-${index}`} value={point.title} onChange={e => handleContentChange(`about.mission.points.${index}.title`, e.target.value)} />
                                    <TextareaField label="Text" id={`mission-text-${index}`} value={point.text} onChange={e => handleContentChange(`about.mission.points.${index}.text`, e.target.value)} rows={2} />
                                    <button onClick={() => { if(window.confirm(`Delete point "${point.title}"?`)) { const newItems = content.about.mission.points.filter(i => i.id !== point.id); handleContentChange('about.mission.points', newItems); }}} className="absolute top-2 right-2 p-1.5 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddMissionPoint} className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors">
                            <Plus size={16}/> Add Mission Point
                        </button>
                    </Accordion>
                    <Accordion title="Principles Section" id="admin-about-principles-accordion">
                        <InputField label="Title" id="principles-title" value={content.about.principles.title} onChange={e => handleContentChange('about.principles.title', e.target.value)} />
                        <TextareaField label="Subtitle" id="principles-subtitle" value={content.about.principles.subtitle} onChange={e => handleContentChange('about.principles.subtitle', e.target.value)} />
                        <div className="space-y-3 mt-4 pt-4 border-t border-brand-primary/20">
                            <h4 className="font-semibold text-brand-light">Principles</h4>
                            {content.about.principles.items.map((item, index) => (
                                <div key={item.id} id={`admin-item-${item.id}`} className="grid grid-cols-1 gap-y-2 p-2 bg-brand-bg rounded-md relative">
                                    <InputField label="Icon" id={`principle-icon-${index}`} value={item.icon} onChange={e => handleContentChange(`about.principles.items.${index}.icon`, e.target.value)} />
                                    <InputField label="Title" id={`principle-title-${index}`} value={item.title} onChange={e => handleContentChange(`about.principles.items.${index}.title`, e.target.value)} />
                                    <TextareaField label="Text" id={`principle-text-${index}`} value={item.text} onChange={e => handleContentChange(`about.principles.items.${index}.text`, e.target.value)} rows={2} />
                                    <button onClick={() => { if(window.confirm(`Delete principle "${item.title}"?`)) { const newItems = content.about.principles.items.filter(i => i.id !== item.id); handleContentChange('about.principles.items', newItems); }}} className="absolute top-2 right-2 p-1.5 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddPrinciple} className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors">
                            <Plus size={16}/> Add Principle
                        </button>
                    </Accordion>
                 </div>
            );
            case 'services': return (
                <div id="admin-section-services">
                    <button 
                        id="admin-add-service-button"
                        onClick={handleAddService} 
                        className="mb-6 flex items-center gap-2 px-4 py-2 font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 transition-all transform hover:scale-105"
                    >
                        <Plus size={18}/> Add New Service
                    </button>
                    <div id="admin-services-list" className="space-y-4">
                        {content.services.map((service, serviceIndex) => (
                            <Accordion 
                                key={service.id} 
                                title={service.title} 
                                id={`admin-item-${service.id}`}
                                defaultOpen={serviceIndex === 0}
                            >
                               <div id={`admin-service-item-${service.id}`} className="space-y-4 pt-2">
                                    <InputField label="Title" id={`s-title-${serviceIndex}`} value={service.title} onChange={e => handleContentChange(`services.${serviceIndex}.title`, e.target.value)} />
                                    <TextareaField label="Short Description" id={`s-desc-${serviceIndex}`} value={service.description} onChange={e => handleContentChange(`services.${serviceIndex}.description`, e.target.value)} />
                                    <TextareaField label="Long Description" id={`s-ldesc-${serviceIndex}`} rows={5} value={service.longDescription} onChange={e => handleContentChange(`services.${serviceIndex}.longDescription`, e.target.value)} />
                                    <InputField label="Image URL" id={`s-img-${serviceIndex}`} value={service.imageUrl} onChange={e => handleContentChange(`services.${serviceIndex}.imageUrl`, e.target.value)} />
                                    
                                    <div id={`admin-service-actions-wrapper-${service.id}`} className="pt-4 border-t border-brand-primary/10 flex justify-end">
                                        <button 
                                            id={`admin-delete-service-button-${service.id}`}
                                            onClick={() => handleDeleteService(service)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete Service
                                        </button>
                                    </div>
                                </div>
                            </Accordion>
                        ))}
                    </div>
                </div>
            );
            case 'projects': return (
                <div id="admin-section-projects">
                    <button onClick={handleAddProject} className="mb-6 flex items-center gap-2 px-4 py-2 font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 transition-all transform hover:scale-105">
                        <Plus size={18}/> Add New Project
                    </button>
                    <div className="space-y-4">
                        {content.projects.map((project, projectIndex) => {
                            const uiState = projectUiState[project.id] || { showGenerator: false, prompt: '', aspectRatio: '16:9', generationStatus: 'idle', generationError: '' };
                            return (
                                <Accordion 
                                    key={project.id} 
                                    title={project.title} 
                                    id={`admin-item-${project.id}`}
                                    defaultOpen={projectIndex === 0}
                                >
                                    <div id={`admin-project-item-${project.id}`} className="space-y-4 relative">
                                        <InputField label="Project Title" id={`p-title-${projectIndex}`} value={project.title} onChange={e => handleContentChange(`projects.${projectIndex}.title`, e.target.value)} />
                                        <TextareaField label="Project Description" id={`p-desc-${projectIndex}`} value={project.description} onChange={e => handleContentChange(`projects.${projectIndex}.description`, e.target.value)} />
                                        
                                        <div className="p-4 border border-brand-primary/20 rounded-lg space-y-3">
                                            <h4 className="font-semibold text-brand-light">Project Image</h4>
                                            <InputField 
                                                label="Image URL" 
                                                id={`p-img-${projectIndex}`} 
                                                value={project.imageUrl || ''} 
                                                onChange={e => handleContentChange(`projects.${projectIndex}.imageUrl`, e.target.value)} 
                                                placeholder="https://... or generate one below"
                                            />
                                            {project.imageUrl && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={project.imageUrl} 
                                                        alt="Project preview" 
                                                        className="rounded-lg max-w-xs max-h-48 object-contain border border-brand-primary/20" 
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}
                                            
                                            <button 
                                                onClick={() => updateProjectUiState(project.id, { showGenerator: !uiState.showGenerator })}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors"
                                            >
                                                <Wand2 size={16}/> {uiState.showGenerator ? 'Hide' : 'Generate Image with AI'}
                                            </button>
                                            
                                            {uiState.showGenerator && (
                                                <div className="p-3 bg-brand-bg rounded-md space-y-3 animate-fade-in">
                                                    <TextareaField 
                                                        label="Image Prompt"
                                                        id={`p-gen-prompt-${projectIndex}`}
                                                        value={uiState.prompt}
                                                        onChange={e => updateProjectUiState(project.id, { prompt: e.target.value })}
                                                        placeholder="e.g., A photorealistic image of a sleek, professional corporate website mockup on a laptop screen in a modern office."
                                                        rows={3}
                                                    />
                                                    <SelectField
                                                        label="Aspect Ratio"
                                                        id={`p-gen-aspect-${projectIndex}`}
                                                        value={uiState.aspectRatio}
                                                        onChange={e => updateProjectUiState(project.id, { aspectRatio: e.target.value })}
                                                    >
                                                        <option value="16:9">16:9 (Widescreen)</option>
                                                        <option value="1:1">1:1 (Square)</option>
                                                        <option value="9:16">9:16 (Vertical)</option>
                                                        <option value="4:3">4:3 (Standard)</option>
                                                        <option value="3:4">3:4 (Portrait)</option>
                                                    </SelectField>
                                                    <button
                                                        onClick={() => handleGenerateImage(projectIndex, project.id)}
                                                        disabled={uiState.generationStatus === 'loading'}
                                                        className="w-full flex items-center justify-center px-4 py-2 font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 disabled:bg-brand-gray disabled:cursor-not-allowed transition-all"
                                                    >
                                                        {uiState.generationStatus === 'loading' ? (
                                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        ) : (
                                                            <Wand2 className="mr-2 h-5 w-5" />
                                                        )}
                                                        {uiState.generationStatus === 'loading' ? 'Generating...' : 'Generate'}
                                                    </button>
                                                    {uiState.generationStatus === 'error' && (
                                                        <p className="text-sm text-red-400 text-center">{uiState.generationError}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <InputField label="Demo Link" id={`p-demo-${projectIndex}`} value={project.demoLink || ''} onChange={e => handleContentChange(`projects.${projectIndex}.demoLink`, e.target.value)} />

                                        <div id={`admin-project-selects-grid-${project.id}`} className="grid grid-cols-2 gap-4">
                                            <SelectField label="Category" id={`p-cat-${projectIndex}`} value={project.serviceId} onChange={e => handleContentChange(`projects.${projectIndex}.serviceId`, e.target.value)}>
                                                {content.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                            </SelectField>
                                            <SelectField label="Status" id={`p-status-${projectIndex}`} value={project.status} onChange={e => handleContentChange(`projects.${projectIndex}.status`, e.target.value)}>
                                                <option value="live">Live</option>
                                                <option value="coming-soon">Coming Soon</option>
                                            </SelectField>
                                        </div>

                                        <fieldset className="p-4 border border-brand-primary/20 rounded-lg space-y-3">
                                            <legend className="px-2 font-bold text-brand-light">Presentation</legend>
                                            <SelectField label="Presentation Type" id={`p-pres-type-${projectIndex}`} value={project.presentation?.type || 'none'} onChange={(e) => handleProjectPresentationChange(projectIndex, 'type', e.target.value)}>
                                                <option value="none">None</option>
                                                <option value="gallery">Image Gallery</option>
                                                <option value="video">Video</option>
                                            </SelectField>
                                            
                                            {project.presentation?.type === 'gallery' && (
                                                <TextareaField 
                                                    label="Image URLs" 
                                                    id={`p-pres-urls-${projectIndex}`} 
                                                    value={(project.presentation.urls || []).join(',\n')}
                                                    onChange={e => handleProjectPresentationChange(projectIndex, 'urls', e.target.value.split(/[, \n]+/).filter(url => url))}
                                                    placeholder="Enter comma or new-line separated image URLs"
                                                    rows={4}
                                                />
                                            )}
                                            {project.presentation?.type === 'video' && (
                                                <InputField
                                                    label="Video URL"
                                                    id={`p-pres-urls-${projectIndex}`}
                                                    value={project.presentation.urls ? project.presentation.urls[0] || '' : ''}
                                                    onChange={e => handleProjectPresentationChange(projectIndex, 'urls', [e.target.value])}
                                                    placeholder="Enter a single video URL (e.g., YouTube embed link)"
                                                />
                                            )}
                                        </fieldset>
                                        
                                        <button 
                                            id={`delete-project-${project.id}`}
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete the project "${project.title}"?`)) {
                                                    const newProjects = content.projects.filter(p => p.id !== project.id);
                                                    handleContentChange('projects', newProjects);
                                                }
                                            }} className="absolute top-0 right-0 p-1.5 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </Accordion>
                            )
                        })}
                    </div>
                </div>
            );
            case 'contact': return(
                <div id="admin-section-contact" className="space-y-4">
                    <Accordion title="Hero Section" id="admin-contact-hero-accordion" defaultOpen>
                        <InputField label="Title" id="contact-hero-title" value={content.contact.hero.title} onChange={e => handleContentChange('contact.hero.title', e.target.value)} />
                        <TextareaField label="Subtitle" id="contact-hero-subtitle" value={content.contact.hero.subtitle} onChange={e => handleContentChange('contact.hero.subtitle', e.target.value)} />
                    </Accordion>
                    <Accordion title="Contact Details" id="admin-contact-details-accordion">
                        <InputField label="Email" id="contact-details-email" value={content.contact.details.email} onChange={e => handleContentChange('contact.details.email', e.target.value)} />
                        <InputField label="Phone" id="contact-details-phone" value={content.contact.details.phone} onChange={e => handleContentChange('contact.details.phone', e.target.value)} />
                        <InputField label="Location" id="contact-details-location" value={content.contact.details.location} onChange={e => handleContentChange('contact.details.location', e.target.value)} />
                    </Accordion>
                </div>
            );
            case 'popup': return (
                <div id="admin-section-popup" className="space-y-4">
                    <Accordion title="General Settings" id="admin-popup-general-accordion" defaultOpen>
                        <ToggleSwitch 
                            label="Enable Announcement Popup" 
                            id="popup-enabled"
                            checked={content.popup.enabled} 
                            onChange={value => handleContentChange('popup.enabled', value)} 
                        />
                         <SelectField
                            label="Popup Type"
                            id="popup-type"
                            value={content.popup.type}
                            onChange={e => handleContentChange('popup.type', e.target.value)}
                        >
                            <option value="announcement">Standard (Bottom Right)</option>
                            <option value="special">Special (Center Modal)</option>
                        </SelectField>
                    </Accordion>
                    <Accordion title="Popup Content" id="admin-popup-content-accordion" defaultOpen>
                        <InputField label="Icon (Lucide Name)" id="popup-icon" value={content.popup.icon} onChange={e => handleContentChange('popup.icon', e.target.value)} />
                        <InputField label="Title" id="popup-title" value={content.popup.title} onChange={e => handleContentChange('popup.title', e.target.value)} />
                        <TextareaField label="Message" id="popup-message" value={content.popup.message} onChange={e => handleContentChange('popup.message', e.target.value)} />
                        <InputField 
                            label="Preview Image URL (Optional)" 
                            id="popup-image-url" 
                            value={content.popup.imageUrl || ''} 
                            onChange={e => handleContentChange('popup.imageUrl', e.target.value)} 
                            placeholder="https://.../image.png"
                        />
                    </Accordion>
                    <Accordion title="Call to Action" id="admin-popup-cta-accordion" defaultOpen>
                         <InputField label="Button Text" id="popup-cta-text" value={content.popup.ctaText} onChange={e => handleContentChange('popup.ctaText', e.target.value)} placeholder="e.g., Learn More"/>
                         <InputField label="Button Link" id="popup-cta-link" value={content.popup.ctaLink} onChange={e => handleContentChange('popup.ctaLink', e.target.value)} placeholder="e.g., /services or https://..."/>
                    </Accordion>
                </div>
            );
            default: return <div id="admin-section-default">Select a section</div>;
        }
    }

    return (
        <div id="admin-panel-backdrop-authed" className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/90 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
            <div id="admin-panel-container" className="bg-brand-surface rounded-2xl shadow-2xl w-full h-full max-w-7xl flex flex-row border border-brand-primary/20">
                {/* Sidebar */}
                <aside id="admin-panel-sidebar" className="w-1/4 xl:w-1/5 bg-brand-surface/50 border-r border-brand-primary/10 flex flex-col">
                    <div id="admin-panel-sidebar-header" className="p-4 border-b border-brand-primary/10">
                         <h2 className="text-xl font-bold font-heading text-brand-light">Admin Panel</h2>
                         <p className="text-sm text-brand-gray/60">Content Management</p>
                    </div>
                    <nav id="admin-panel-sidebar-nav" className="flex-grow p-2">
                        {(Object.keys(sectionConfig) as AdminSection[]).map(key => {
                            const { label, icon: Icon } = sectionConfig[key];
                            return (
                                <button key={key} onClick={() => setActiveSection(key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeSection === key ? 'bg-brand-primary text-brand-light' : 'text-brand-gray hover:bg-white/5'}`}>
                                    <Icon size={20} />
                                    <span className="font-semibold">{label}</span>
                                </button>
                            )
                        })}
                    </nav>
                    <div id="admin-panel-sidebar-footer" className="p-4 border-t border-brand-primary/10 flex items-center justify-between">
                         <div id="admin-panel-sidebar-footer-actions" className="flex items-center gap-2">
                            <button onClick={handleReset} disabled={isSaving} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <RefreshCw size={16} /> Reset
                            </button>
                             <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg text-brand-gray bg-white/5 hover:bg-white/10 transition-colors">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                        <button onClick={closePanel} className="p-2 text-brand-gray/60 hover:text-brand-light transition-colors" aria-label="Close admin panel">
                            <X size={24} />
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main id="admin-panel-main" className="w-3/4 xl:w-4/5 flex flex-col">
                    <header id="admin-panel-main-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-brand-primary/20">
                         <h2 className="text-xl font-bold font-heading text-brand-secondary">{sectionConfig[activeSection].label}</h2>
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 disabled:bg-brand-gray transition-colors">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save & Publish'}
                        </button>
                    </header>
                    <div id="admin-panel-main-content" ref={adminContentRef} className="flex-grow p-6 overflow-y-auto">
                        {renderSection()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
