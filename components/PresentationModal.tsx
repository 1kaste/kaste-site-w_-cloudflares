

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Video, Image as ImageIcon } from 'lucide-react';
import type { Project } from '../types';

interface PresentationModalProps {
  project: Project | null;
  onClose: () => void;
}

const PresentationModal: React.FC<PresentationModalProps> = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const presentation = project?.presentation;
  const isGallery = presentation?.type === 'gallery';
  const urls = presentation?.urls || [];

  const handleNext = useCallback(() => {
    if (isGallery) {
        setCurrentIndex(prev => (prev + 1) % urls.length);
    }
  }, [isGallery, urls.length]);

  const handlePrev = useCallback(() => {
    if (isGallery) {
        setCurrentIndex(prev => (prev - 1 + urls.length) % urls.length);
    }
  }, [isGallery, urls.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (isGallery) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isGallery, handleNext, handlePrev]);
  
  useEffect(() => {
    // Reset index when project changes
    setCurrentIndex(0);
  }, [project]);

  if (!project || !presentation) return null;
  
  return (
    <div 
      id="presentation-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="presentation-title"
    >
      <div 
        id={`presentation-modal-container-${project.id}`}
        className="bg-brand-surface rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] m-4 border border-brand-primary/20 flex flex-col relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <header id="presentation-modal-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-brand-primary/20">
            <div id="presentation-modal-header-title-wrapper" className="flex items-center gap-3">
                {isGallery ? <ImageIcon className="w-6 h-6 text-brand-secondary" /> : <Video className="w-6 h-6 text-brand-secondary" />}
                <div id="presentation-modal-header-title-text-wrapper">
                    <h2 id="presentation-title" className="text-xl font-bold font-heading text-brand-light">{project.title}</h2>
                    <p className="text-sm text-brand-gray/70">{isGallery ? 'Image Gallery' : 'Video Presentation'}</p>
                </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-brand-gray/60 hover:text-brand-light transition-colors rounded-full hover:bg-white/10"
              aria-label="Close presentation"
            >
              <X size={24} />
            </button>
        </header>

        <main id="presentation-modal-main" className="flex-grow flex flex-col p-4 relative overflow-hidden">
            {isGallery ? (
                <>
                    <div id="presentation-modal-gallery-wrapper" className="flex-grow flex items-center justify-center relative bg-brand-bg rounded-lg overflow-hidden">
                        <img 
                            id={`presentation-image-${project.id}-${currentIndex}`}
                            key={urls[currentIndex]}
                            src={urls[currentIndex]} 
                            alt={`Slide ${currentIndex + 1} for ${project.title}`}
                            className="block max-w-full max-h-full object-contain animate-fade-in"
                        />
                         <button 
                            id={`presentation-prev-btn-${project.id}`}
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous image"
                            disabled={urls.length <= 1}
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button 
                            id={`presentation-next-btn-${project.id}`}
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next image"
                            disabled={urls.length <= 1}
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                    {urls.length > 1 && (
                      <div id="presentation-modal-gallery-thumbnails-wrapper" className="flex-shrink-0 mt-4">
                        <div id="presentation-modal-gallery-thumbnails-container" className="flex justify-center p-2 overflow-x-auto gap-2">
                           {urls.map((url, index) => (
                                <button 
                                    id={`presentation-thumb-${project.id}-${index}`}
                                    key={index} 
                                    onClick={() => setCurrentIndex(index)} 
                                    className={`flex-shrink-0 w-20 h-12 rounded-md overflow-hidden border-2 transition-colors ${currentIndex === index ? 'border-brand-secondary' : 'border-transparent hover:border-brand-secondary/50'}`}
                                >
                                    <img src={url} alt={`Thumbnail ${index+1}`} className="w-full h-full object-cover" />
                                </button>
                           ))}
                        </div>
                      </div>
                    )}
                </>
            ) : (
                <div id="presentation-modal-video-wrapper" className="w-full h-full bg-black rounded-lg overflow-hidden">
                     <iframe
                        id={`presentation-video-${project.id}`}
                        src={urls[0]}
                        title={`${project.title} Video Presentation`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default PresentationModal;