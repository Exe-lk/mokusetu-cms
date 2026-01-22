"use client";
import { useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import PageHeader from './PageHeader';
import IconRenderer from './IconRenderer';
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver';
import type { Service } from '@/src/services';

interface ServicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function ServicePreviewModal({ isOpen, onClose, service }: ServicePreviewModalProps) {
  const [contentRef, isContentVisible] = useIntersectionObserver();
  const [cardsRef, isCardsVisible] = useIntersectionObserver();
  const [servicesRef, isServicesVisible] = useIntersectionObserver();
  const [whyUsRef, isWhyUsVisible] = useIntersectionObserver();
  const [ctaRef, isCtaVisible] = useIntersectionObserver();

  const showAll = true;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const parseJsonField = (field: any, defaultValue: any[] = []) => {
    if (!field) return defaultValue;
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const cardContents = parseJsonField(service.cardContents);
  const servicesList = parseJsonField(service.servicesList);
  const whyChoosePoints = parseJsonField(service.whyChoosePoints);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50">
      <div 
        className="fixed inset-0 bg-white bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative min-h-full">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          <Breadcrumb 
            currentPage={service.pageTitle} 
            currentPagePath={`/services/${service.slug}`}
            parentPage="Services"
            parentPagePath="/services"
          />
          
          <PageHeader 
            title={service.pageTitle} 
            subtitle={service.pageSubtitle}
            backgroundImage={service.backgroundImage}
          />
          
          <section className="section">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                {service.mainContent && (
                  <div ref={contentRef as React.RefObject<HTMLDivElement>} className={`floating-paper p-8 rounded-3xl mb-8 fade-in ${(isContentVisible || showAll) ? 'visible' : ''}`}>
                    <div 
                      className="text-lg text-muted leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: service.mainContent.includes('<') 
                          ? service.mainContent 
                          : service.mainContent.split('\n').map((para: string) => `<p class="mb-6">${para}</p>`).join('')
                      }}
                    />
                  </div>
                )}

                {cardContents.length > 0 && (
                  <div ref={cardsRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 gap-8 mb-12">
                    {cardContents.map((card: any, index: number) => (
                      <div 
                        key={index} 
                        className={`floating-paper p-8 rounded-3xl flex flex-col items-center text-center h-full ${
                          index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
                        } ${(isCardsVisible || showAll) ? 'visible' : ''}`}
                      >
                        {card.icon && (
                          <div className="icon-container-unique w-16 h-16 flex items-center justify-center flex-shrink-0 shadow-lg mb-6">
                            <IconRenderer 
                              icon={card.icon} 
                              color="white" 
                              size={32}
                              className="flex-shrink-0"
                            />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold mb-4">{card.header}</h3>
                        <p className="text-muted leading-relaxed">{card.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {servicesList.length > 0 && (
                  <div ref={servicesRef as React.RefObject<HTMLDivElement>} className={`floating-paper p-8 rounded-3xl mb-8 h-full scale-in ${(isServicesVisible || showAll) ? 'visible' : ''}`}>
                    {service.servicesTitle && (
                      <h2 className="text-3xl font-bold mb-6 gradient-text-brand text-center">
                        {service.servicesTitle}
                      </h2>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      {servicesList.map((item: any, index: number) => (
                        <div key={index} className={index % 2 === 0 ? 'md:pr-4' : 'md:pl-4'}>
                          <h4 className="text-xl font-semibold mb-3 text-left">{item.title}</h4>
                          {item.points && item.points.length > 0 && (
                            <ul className="space-y-2 text-muted text-left pl-4">
                              {item.points.map((point: string, pointIndex: number) => (
                                <li key={pointIndex}>• {point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {whyChoosePoints.length > 0 && (
                  <div ref={whyUsRef as React.RefObject<HTMLDivElement>} className={`floating-paper p-8 rounded-3xl mb-8 fade-in ${(isWhyUsVisible || showAll) ? 'visible' : ''}`}>
                    {service.whyChooseTitle && (
                      <h3 className="text-2xl font-bold mb-4 text-center mb-12">
                        {service.whyChooseTitle}
                      </h3>
                    )}
                    <div className="grid md:grid-cols-3 gap-6">
                      {whyChoosePoints.map((point: any, index: number) => (
                        <div key={index} className="text-center">
                          {point.icon && (
                            <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-3">
                              <IconRenderer 
                                icon={point.icon} 
                                color="#dc2626" 
                                size={24}
                                className="flex-shrink-0"
                              />
                            </div>
                          )}
                          <h4 className="font-semibold mb-2">{point.title}</h4>
                          {point.subPoints && point.subPoints.length > 0 && (
                            <ul className="text-sm text-muted space-y-1">
                              {point.subPoints.map((subPoint: string, subIndex: number) => (
                                <li key={subIndex}>{subPoint}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(service.footerTitle || service.footerContent) && (
                  <div ref={ctaRef as React.RefObject<HTMLDivElement>} className="text-center">
                    <div className={`inline-flex flex-col items-center gap-4 p-6 bg-white border border-red-600/20 rounded-2xl shadow-md scale-in ${(isCtaVisible || showAll) ? 'visible' : ''}`}>
                      {service.footerTitle && (
                        <h3 className="text-xl font-semibold">{service.footerTitle}</h3>
                      )}
                      {service.footerContent && (
                        <p className="text-muted">{service.footerContent}</p>
                      )}
                      <button className="btn-primary">
                        Get Started
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
