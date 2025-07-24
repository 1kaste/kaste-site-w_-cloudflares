
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceById, getProjectsByServiceId } from '../services/siteContent';
import type { Service, Project } from '../types';
import { ArrowLeft, ExternalLink, Presentation, Mail, Rocket } from 'lucide-react';
import { useContactModal } from '../contexts/ContactModalContext';
import PresentationModal from './PresentationModal';

const comingSoonServiceIds = ['mobile-apps', 'software-development'];

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const { openModal } = useContactModal();
  const [presentationModalProject, setPresentationModalProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      const foundService = getServiceById(id);
      setService(foundService || null);
      if (foundService) {
        const serviceProjects = getProjectsByServiceId(id).filter(p => p.status === 'live');
        setProjects(serviceProjects);
      }
    }
    window.scrollTo(0, 0);
  }, [id]);

  const renderContent = () => {
    if (!service) {
      return (
        <div id="service-detail-not-found" className="text-center py-20 animate-fade-in-up">
          <h2 className="text-2xl font-bold font-heading text-brand-gray">Service not found.</h2>
          <Link to="/services" className="mt-4 inline-flex items-center px-6 py-3 font-bold rounded-lg shadow-md text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 transition-all">
            <ArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Back to Services
          </Link>
        </div>
      );
    }

    const hasProjects = projects.length > 0;
    const isComingSoon = service && comingSoonServiceIds.includes(service.id);

    return (
      <div id={`service-detail-container-${id}`} className="max-w-5xl mx-auto animate-fade-in-up">
          <Link to="/services" className="inline-flex items-center text-brand-secondary hover:underline mb-8 group">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Back to All Services
          </Link>

          {isComingSoon ? (
              <div id={`service-detail-coming-soon-${id}`} className="mt-4 p-6 sm:p-8 bg-gradient-to-br from-red-600/10 via-brand-surface to-brand-surface border-l-4 border-red-500 text-brand-light rounded-r-lg flex flex-col items-center text-center">
                  <div id={`service-detail-coming-soon-icon-wrapper-${id}`} className="p-3 bg-red-500/20 rounded-full mb-4">
                      <Rocket className="h-8 w-8 text-red-400" />
                  </div>
                  <h2 className="text-3xl font-bold font-heading text-red-400">Launching Soon!</h2>
                  <p className="mt-2 max-w-xl mx-auto text-brand-gray/80">
                      We're putting the final touches on our new "{service.title}" services. We're excited to bring you the best in class solution.
                  </p>
                  <p className="mt-2 text-sm text-brand-gray/60">
                      Be the first to know when we launch, or get in touch for an early-bird quote.
                  </p>
                  <button 
                      onClick={() => openModal({ serviceId: service.id, subject: `Early Inquiry: ${service.title}` })}
                      className="mt-8 inline-flex items-center justify-center px-8 py-3 text-base font-bold text-brand-light bg-red-600 rounded-lg shadow-lg shadow-red-500/20 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all transform hover:scale-105"
                  >
                      <Mail className="mr-3 h-5 w-5" />
                      Request an Early Quote
                  </button>
              </div>
          ) : (
              <>
                  <header id={`service-detail-header-${id}`} className="text-center mb-12 sm:mb-16">
                      <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-brand-light">
                          {service.title} Projects
                      </h1>
                      <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-brand-gray/80">
                          Explore our case studies and previous work for {service.title}. If a particular style or project catches your eye, feel free to request a quote.
                      </p>
                  </header>

                  {hasProjects ? (
                      <div id={`service-detail-projects-grid-${id}`} className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                          {projects.map((project, index) => (
                                  <div 
                                      key={index}
                                      id={`service-detail-project-card-${project.id}`}
                                      className="bg-brand-surface rounded-xl border border-brand-primary/20 flex flex-col animate-fade-in-up group overflow-hidden" 
                                      style={{ animationDelay: `${index * 100}ms` }}
                                  >
                                      {project.imageUrl && (
                                          <div id={`service-detail-project-image-wrapper-${project.id}`} className="relative h-48 overflow-hidden">
                                              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                          </div>
                                      )}
                                      <div id={`service-detail-project-content-wrapper-${project.id}`} className="p-6 flex flex-col flex-grow">
                                          <div id={`service-detail-project-text-wrapper-${project.id}`} className="flex-grow">
                                              <h3 className="text-xl font-bold font-heading text-brand-light">{project.title}</h3>
                                              <p className="mt-2 text-sm text-brand-gray/90">{project.description}</p>
                                          </div>
                                          <div id={`service-detail-project-actions-wrapper-${project.id}`} className="mt-6 flex flex-wrap gap-4 items-center">
                                              {project.demoLink && (
                                                  <a
                                                  href={project.demoLink}
                                                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-secondary bg-transparent border border-brand-secondary rounded-lg hover:bg-brand-secondary/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-all"
                                                  >
                                                  <ExternalLink className="mr-2 h-4 w-4" />
                                                  View Demo
                                                  </a>
                                              )}
                                              {project.presentation && (
                                                  <button
                                                    onClick={() => setPresentationModalProject(project)}
                                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-secondary bg-transparent border border-brand-secondary rounded-lg hover:bg-brand-secondary/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-all"
                                                  >
                                                    <Presentation className="mr-2 h-4 w-4" />
                                                    View Presentation
                                                  </button>
                                              )}
                                              <button
                                                  onClick={() => openModal({ serviceId: service.id, subject: `Quote Request for project style: ${project.title}` })}
                                                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-brand-dark-text bg-brand-secondary rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-all transform hover:scale-105"
                                              >
                                                  <Mail className="mr-2 h-4 w-4" />
                                                  Request Quote
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              )
                          )}
                      </div>
                  ) : (
                      <div id={`service-detail-no-projects-${id}`} className="text-center py-16 px-6 bg-brand-surface rounded-2xl border border-brand-primary/20">
                          <h3 className="text-2xl font-bold font-heading text-brand-light">Let's Build Something Together</h3>
                          <p className="mt-2 max-w-xl mx-auto text-brand-gray/80">
                              While we don't have specific case studies for this category just yet, we're fully equipped to handle your needs. Let's discuss how we can bring your vision for {service.title} to life.
                          </p>
                          <button 
                              onClick={() => openModal({ serviceId: service.id, subject: `Inquiry about ${service.title}` })}
                              className="mt-8 inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-brand-light bg-brand-primary rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-all"
                          >
                              Request a Quote for {service.title}
                          </button>
                      </div>
                  )}
              </>
          )}
          {presentationModalProject && (
              <PresentationModal 
                  project={presentationModalProject} 
                  onClose={() => setPresentationModalProject(null)} 
              />
          )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 sm:pb-12">
      {renderContent()}
    </div>
  );
};

export default ServiceDetail;