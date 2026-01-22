'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { MdBusiness } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchHomePage, updateHomePage } from '@/src/store/slices/homeSlice';
import type { HomeThreeCard, HomeWhyChooseCard } from '@/src/services/home.services';
import IconRenderer from '../components/IconRenderer';
import { fetchServices } from '@/src/store/slices/servicesSlice';

export default function PageEditor() {
  const dispatch = useAppDispatch();
  const { home, loading } = useAppSelector((state) => state.home);
  const { services } = useAppSelector((state) => state.services);

  const [hero, setHero] = useState({
    titleHero: '',
    contentHero: '',
    globalPartners: '',
    yearsExperiences: '',
    successRate: '',
  });

  const [about, setAbout] = useState({
    aboutTitle: '',
    aboutContent: '',
  });

  const [threeCards, setThreeCards] = useState<HomeThreeCard[]>([
    { cardIcon: '', cardTitle: '', cardContent: '' },
    { cardIcon: '', cardTitle: '', cardContent: '' },
    { cardIcon: '', cardTitle: '', cardContent: '' },
  ]);

  const [whyChoose, setWhyChoose] = useState<{
    title: string;
    subtitle: string;
    cards: HomeWhyChooseCard[];
  }>({
    title: '',
    subtitle: '',
    cards: [
      { cardIcon: '', cardTitle: '', cardContent: '' },
      { cardIcon: '', cardTitle: '', cardContent: '' },
      { cardIcon: '', cardTitle: '', cardContent: '' },
      { cardIcon: '', cardTitle: '', cardContent: '' },
    ],
  });

  const [serviceSection, setServiceSection] = useState<{
    serviceIcon: string;
    serviceServiceId: string;
    serviceTitle: string;
    serviceContent: string;
    serviceCards: { cardIcon: string; selectedService: string; content: string }[];
  }>({
    serviceIcon: '',
    serviceServiceId: '',
    serviceTitle: '',
    serviceContent: '',
    serviceCards: [{ cardIcon: '', selectedService: '', content: '' }],
  });

  useEffect(() => {
    dispatch(fetchHomePage());
    dispatch(fetchServices(true));
  }, [dispatch]);

  useEffect(() => {
    if (!home) return;

    setHero({
      titleHero: home.titleHero || '',
      contentHero: home.contentHero || '',
      globalPartners: home.globalPartners || '',
      yearsExperiences: home.yearsExperiences || '',
      successRate: home.successRate || '',
    });

    setAbout({
      aboutTitle: home.aboutTitle || '',
      aboutContent: home.aboutContent || '',
    });

    setServiceSection({
      serviceIcon: home.serviceIcon || '',
      serviceServiceId: home.serviceServiceId || '',
      serviceTitle: home.serviceTitle || '',
      serviceContent: home.serviceContent || '',
      serviceCards:
        (home.serviceCards && home.serviceCards.length > 0
          ? home.serviceCards
          : [{ cardIcon: '', selectedService: '', content: '' }]) as { cardIcon: string; selectedService: string; content: string }[],
    });

    const cardsFromDb = home.threeCards && home.threeCards.length > 0
      ? home.threeCards
      : [
          { cardIcon: '', cardTitle: '', cardContent: '' },
          { cardIcon: '', cardTitle: '', cardContent: '' },
          { cardIcon: '', cardTitle: '', cardContent: '' },
        ];
    setThreeCards(cardsFromDb.slice(0, 3).concat(
      Array(Math.max(0, 3 - cardsFromDb.length)).fill({
        cardIcon: '',
        cardTitle: '',
        cardContent: '',
      })
    ).slice(0, 3));

    const whyCardsFromDb = home.whyChooseCards && home.whyChooseCards.length > 0
      ? home.whyChooseCards
      : [
          { cardIcon: '', cardTitle: '', cardContent: '' },
          { cardIcon: '', cardTitle: '', cardContent: '' },
          { cardIcon: '', cardTitle: '', cardContent: '' },
          { cardIcon: '', cardTitle: '', cardContent: '' },
        ];

    setWhyChoose({
      title: home.whyChooseTitle || '',
      subtitle: home.whyChooseSubtitle || '',
      cards: whyCardsFromDb
        .slice(0, 4)
        .concat(
          Array(Math.max(0, 4 - whyCardsFromDb.length)).fill({
            cardIcon: '',
            cardTitle: '',
            cardContent: '',
          })
        )
        .slice(0, 4),
    });
  }, [home]);

  const handlePublish = async () => {
    await dispatch(
      updateHomePage({
        titleHero: hero.titleHero,
        contentHero: hero.contentHero,
        globalPartners: hero.globalPartners,
        yearsExperiences: hero.yearsExperiences,
        successRate: hero.successRate,
        aboutTitle: about.aboutTitle,
        aboutContent: about.aboutContent,
        serviceIcon: serviceSection.serviceIcon,
        serviceServiceId: serviceSection.serviceServiceId,
        serviceTitle: serviceSection.serviceTitle,
        serviceContent: serviceSection.serviceContent,
        serviceCards: serviceSection.serviceCards,
        threeCards,
        whyChooseTitle: whyChoose.title,
        whyChooseSubtitle: whyChoose.subtitle,
        whyChooseCards: whyChoose.cards,
      })
    ).unwrap().catch((err) => {
      console.error('Failed to save home page:', err);
      alert('Failed to save home page. Please try again.');
    });
  };

  return (
    <Layout title="Page Content Editor - Home">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pages / Home Page</p>
              <h2 className="text-xl font-bold text-gray-900">Home Page Sections</h2>
              {loading && (
                <p className="text-xs text-blue-600 mt-1">
                  Loading content from database...
                </p>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                type="button"
              >
                Live Preview
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Publish Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 text-sm font-bold">
                    1
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Hero Section</h3>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={hero.titleHero}
                    onChange={(e) => setHero({ ...hero, titleHero: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Main headline for the hero section"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Content</label>
                  <textarea
                    value={hero.contentHero}
                    onChange={(e) => setHero({ ...hero, contentHero: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Short paragraph explaining your value proposition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Global Partners
                    </label>
                    <input
                      type="text"
                      value={hero.globalPartners}
                      onChange={(e) => setHero({ ...hero, globalPartners: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      placeholder="e.g., 3+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Years Experience
                    </label>
                    <input
                      type="text"
                      value={hero.yearsExperiences}
                      onChange={(e) => setHero({ ...hero, yearsExperiences: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      placeholder="e.g., 15+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Success Rate
                    </label>
                    <input
                      type="text"
                      value={hero.successRate}
                      onChange={(e) => setHero({ ...hero, successRate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      placeholder="e.g., 98%"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">
                    2
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">About Section</h3>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">About Title</label>
                  <input
                    type="text"
                    value={about.aboutTitle}
                    onChange={(e) => setAbout({ ...about, aboutTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Section heading for About"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About Content
                  </label>
                  <textarea
                    value={about.aboutContent}
                    onChange={(e) => setAbout({ ...about, aboutContent: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your company, mission, and what makes you unique."
                  />
                </div>
              </div>
            </div>

            {/* Service Section */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-sm font-bold">
                    3
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Service Highlight Section</h3>
                </div>
              </div>

              {/* Service Section Content */}
              <div className="p-4 sm:p-6 space-y-4">  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Section Title</label>
                  <input
                    type="text"
                    value={serviceSection.serviceTitle}
                    onChange={(e) => setServiceSection({ ...serviceSection, serviceTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Service section title"
                  />
                </div>
              </div>
              {/* Service Section Subtitle */}
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Section Subtitle</label>
                  <textarea
                    value={serviceSection.serviceContent}
                    onChange={(e) => setServiceSection({ ...serviceSection, serviceContent: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Service section subtitle"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-800">Service Cards</h4>
                    <button
                      type="button"
                      onClick={() =>
                        setServiceSection({
                          ...serviceSection,
                          serviceCards: [
                            ...serviceSection.serviceCards,
                            { cardIcon: '', selectedService: '', content: '' },
                          ],
                        })
                      }
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      + Add Card
                    </button>
                  </div>
                  <div className="space-y-3">
                    {serviceSection.serviceCards.map((card, index) => {
                      // Get all selected service IDs from other cards
                      const selectedServiceIds = serviceSection.serviceCards
                        .map((c, i) => (i !== index && c.selectedService ? c.selectedService : null))
                        .filter((id): id is string => id !== null);
                      
                      // Filter services to exclude already selected ones
                      const availableServices = services.filter(
                        (svc) => !selectedServiceIds.includes(svc.id)
                      );

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              Card {index + 1}
                            </span>
                            {serviceSection.serviceCards.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setServiceSection({
                                    ...serviceSection,
                                    serviceCards: serviceSection.serviceCards.filter(
                                      (_, i) => i !== index
                                    ),
                                  })
                                }
                                className="text-[11px] text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Card Icon SVG
                              </label>
                              <input
                                type="text"
                                value={card.cardIcon}
                                onChange={(e) => {
                                  const updated = [...serviceSection.serviceCards];
                                  updated[index] = { ...updated[index], cardIcon: e.target.value };
                                  setServiceSection({ ...serviceSection, serviceCards: updated });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Paste inline SVG"
                              />
                              <div className="mt-1 flex items-center justify-start min-h-[24px]">
                                {card.cardIcon ? (
                                  <IconRenderer
                                    icon={card.cardIcon}
                                    size={20}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <span className="text-[10px] text-gray-400">Icon preview</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Select Service
                              </label>
                              <select
                                value={card.selectedService}
                                onChange={(e) => {
                                  const updated = [...serviceSection.serviceCards];
                                  updated[index] = { ...updated[index], selectedService: e.target.value };
                                  setServiceSection({ ...serviceSection, serviceCards: updated });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                              >
                                <option value="">Select a service</option>
                                {availableServices.map((svc) => (
                                  <option key={svc.id} value={svc.id}>
                                    {svc.pageTitle}
                                  </option>
                                ))}
                                {card.selectedService && !availableServices.find(s => s.id === card.selectedService) && (
                                  <option value={card.selectedService}>
                                    {services.find(s => s.id === card.selectedService)?.pageTitle || 'Selected Service'}
                                  </option>
                                )}
                              </select>
                              {selectedServiceIds.length > 0 && (
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {selectedServiceIds.length} service(s) already selected in other cards
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Card Content
                            </label>
                            <textarea
                              value={card.content}
                              onChange={(e) => {
                                const updated = [...serviceSection.serviceCards];
                                updated[index] = { ...updated[index], content: e.target.value };
                                setServiceSection({ ...serviceSection, serviceCards: updated });
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Card content description"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 text-sm font-bold">
                    4
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Three Cards Section</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    3 cards
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {threeCards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Card {index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Card Icon SVG
                        </label>
                        <input
                          type="text"
                          value={card.cardIcon}
                          onChange={(e) => {
                            const updated = [...threeCards];
                            updated[index] = { ...updated[index], cardIcon: e.target.value };
                            setThreeCards(updated);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Paste inline SVG (e.g., <svg>...</svg>)"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={card.cardTitle}
                            onChange={(e) => {
                              const updated = [...threeCards];
                              updated[index] = { ...updated[index], cardTitle: e.target.value };
                              setThreeCards(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Card Content
                          </label>
                          <textarea
                            value={card.cardContent}
                            onChange={(e) => {
                              const updated = [...threeCards];
                              updated[index] = { ...updated[index], cardContent: e.target.value };
                              setThreeCards(updated);
                            }}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 text-sm font-bold">
                    5
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Why Choose Us Section</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Up to 4 cards
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={whyChoose.title}
                    onChange={(e) => setWhyChoose({ ...whyChoose, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Why Choose Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={whyChoose.subtitle}
                    onChange={(e) => setWhyChoose({ ...whyChoose, subtitle: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Short subtitle explaining the value of this section."
                  />
                </div>

                {whyChoose.cards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Card {index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Card Icon SVG
                        </label>
                        <input
                          type="text"
                          value={card.cardIcon}
                          onChange={(e) => {
                            const updated = { ...whyChoose };
                            updated.cards[index] = {
                              ...updated.cards[index],
                              cardIcon: e.target.value,
                            };
                            setWhyChoose(updated);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Paste inline SVG (e.g., <svg>...</svg>)"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={card.cardTitle}
                            onChange={(e) => {
                              const updated = { ...whyChoose };
                              updated.cards[index] = {
                                ...updated.cards[index],
                                cardTitle: e.target.value,
                              };
                              setWhyChoose(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Card Content
                          </label>
                          <textarea
                            value={card.cardContent}
                            onChange={(e) => {
                              const updated = { ...whyChoose };
                              updated.cards[index] = {
                                ...updated.cards[index],
                                cardContent: e.target.value,
                              };
                              setWhyChoose(updated);
                            }}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 sticky top-24 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Preview</h3>

              <section className="rounded-lg border border-gray-200 p-4 bg-gradient-to-br from-red-50 to-orange-50 space-y-3">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {hero.titleHero || 'Hero Title'}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {hero.contentHero || 'Hero description will appear here.'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-200 pt-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {hero.globalPartners || '—'}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase">Global Partners</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {hero.yearsExperiences || '—'}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {hero.successRate || '—'}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase">Success Rate</div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 p-4 bg-white space-y-2">
                <h4 className="text-sm font-bold text-gray-900">
                  {about.aboutTitle || 'About Section Title'}
                </h4>
                <p className="text-xs text-gray-600">
                  {about.aboutContent || 'About content preview will appear here.'}
                </p>
              </section>

              <section className="rounded-lg border border-gray-200 p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600 font-semibold text-gray-900 mb-1 mt-1 items-center justify-center">
                    {serviceSection.serviceTitle || 'Service section title preview will appear here.'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    {serviceSection.serviceContent || 'Service section content preview will appear here.'}
                  </p>
                </div>
               
                {serviceSection.serviceCards.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {serviceSection.serviceCards.map((card, index) => {
                      const selectedService = services.find((s) => s.id === card.selectedService);
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-2 bg-gray-50"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {card.cardIcon ? (
                              <IconRenderer
                                icon={card.cardIcon}
                                size={18}
                                className="text-emerald-600"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">Icon</span>
                            )}
                            <div className="text-xs font-semibold text-gray-900">
                              {selectedService ? selectedService.pageTitle : 'No service selected'}
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1">
                            {card.content || 'Card content'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-gray-200 p-4 bg-white space-y-3">
                <h4 className="text-sm font-bold text-gray-900">Key Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {threeCards.map((card, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-2 bg-gray-50 text-center"
                    >
                      <div className="mb-1 flex items-center justify-center">
                        {card.cardIcon ? (
                          <IconRenderer
                            icon={card.cardIcon}
                            size={28}
                            className="text-red-600"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">Icon</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-gray-900">
                        {card.cardTitle || 'Card Title'}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-1">
                        {card.cardContent || 'Card content'}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {whyChoose.title || 'Why Choose Us'}
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      {whyChoose.subtitle || 'Subtitle preview will appear here.'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <MdBusiness className="text-red-600 text-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {whyChoose.cards.map((card, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-2 bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {card.cardIcon ? (
                          <IconRenderer
                            icon={card.cardIcon}
                            size={20}
                            className="text-red-600"
                          />
                        ) : (
                          <span className="text-[11px] text-gray-400">Icon</span>
                        )}
                        <span className="text-xs font-semibold text-gray-900">
                          {card.cardTitle || 'Card Title'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        {card.cardContent || 'Card content'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}