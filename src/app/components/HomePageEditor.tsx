"use client";
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchHomePage, updateHomePage } from '@/src/store/slices/homeSlice';
import { fetchServices } from '@/src/store/slices/servicesSlice';
import type { HomeThreeCard, HomeWhyChooseCard } from '@/src/services/home.services';
import IconRenderer from './IconRenderer';
import Swal from 'sweetalert2';
import { MdBusiness } from 'react-icons/md';

type TabType = 'edit' | 'preview';
type SectionType = 'hero' | 'about' | 'service' | 'threeCards' | 'whyChoose' | 'footer';

export default function HomePageEditor() {
  const dispatch = useAppDispatch();
  const { home, loading } = useAppSelector((state) => state.home);
  const { services } = useAppSelector((state) => state.services);
  const [activeTab, setActiveTab] = useState<TabType>('edit');
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);

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

  const [footer, setFooter] = useState({
    footerTitle: '',
    footerSubtitle: '',
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

    setFooter({
      footerTitle: home.footerTitle || '',
      footerSubtitle: home.footerSubtitle || '',
    });
  }, [home]);

  const handleSaveSection = async (section: SectionType) => {
    try {
      let updateData: any = {};

      switch (section) {
        case 'hero':
          updateData = {
            titleHero: hero.titleHero,
            contentHero: hero.contentHero,
            globalPartners: hero.globalPartners,
            yearsExperiences: hero.yearsExperiences,
            successRate: hero.successRate,
          };
          break;
        case 'about':
          updateData = {
            aboutTitle: about.aboutTitle,
            aboutContent: about.aboutContent,
          };
          break;
        case 'service':
          updateData = {
            serviceIcon: serviceSection.serviceIcon,
            serviceServiceId: serviceSection.serviceServiceId,
            serviceTitle: serviceSection.serviceTitle,
            serviceContent: serviceSection.serviceContent,
            serviceCards: serviceSection.serviceCards,
          };
          break;
        case 'threeCards':
          updateData = { threeCards };
          break;
        case 'whyChoose':
          updateData = {
            whyChooseTitle: whyChoose.title,
            whyChooseSubtitle: whyChoose.subtitle,
            whyChooseCards: whyChoose.cards,
          };
          break;
        case 'footer':
          updateData = {
            footerTitle: footer.footerTitle,
            footerSubtitle: footer.footerSubtitle,
          };
          break;
      }

      const result = await dispatch(updateHomePage(updateData)).unwrap();
      if (result) {
        setActiveSection(null);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `${section.charAt(0).toUpperCase() + section.slice(1)} section saved successfully!`,
        });
      }
    } catch (error: any) {
      console.error('Error saving section:', error);
      const errorMessage = error?.message || error?.error || 'Unknown error occurred';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Failed to save section: ${errorMessage}. Please try again.`,
      });
    }
  };

  const addServiceCard = () => {
    setServiceSection({
      ...serviceSection,
      serviceCards: [
        ...serviceSection.serviceCards,
        { cardIcon: '', selectedService: '', content: '' },
      ],
    });
  };

  const updateServiceCard = (index: number, field: string, value: string) => {
    const updated = [...serviceSection.serviceCards];
    updated[index] = { ...updated[index], [field]: value };
    setServiceSection({ ...serviceSection, serviceCards: updated });
  };

  const removeServiceCard = (index: number) => {
    setServiceSection({
      ...serviceSection,
      serviceCards: serviceSection.serviceCards.filter((_, i) => i !== index),
    });
  };

  const updateThreeCard = (index: number, field: keyof HomeThreeCard, value: string) => {
    const updated = [...threeCards];
    updated[index] = { ...updated[index], [field]: value };
    setThreeCards(updated);
  };

  const updateWhyChooseCard = (index: number, field: keyof HomeWhyChooseCard, value: string) => {
    const updated = { ...whyChoose };
    updated.cards[index] = { ...updated.cards[index], [field]: value };
    setWhyChoose(updated);
  };

  if (loading && !home) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'edit'
                ? 'bg-red-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Content Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'preview'
                ? 'bg-red-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Live Preview
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'edit' ? (
            <EditTab
              hero={hero}
              setHero={setHero}
              about={about}
              setAbout={setAbout}
              serviceSection={serviceSection}
              setServiceSection={setServiceSection}
              threeCards={threeCards}
              setThreeCards={setThreeCards}
              whyChoose={whyChoose}
              setWhyChoose={setWhyChoose}
              footer={footer}
              setFooter={setFooter}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              handleSaveSection={handleSaveSection}
              services={services}
              addServiceCard={addServiceCard}
              updateServiceCard={updateServiceCard}
              removeServiceCard={removeServiceCard}
              updateThreeCard={updateThreeCard}
              updateWhyChooseCard={updateWhyChooseCard}
            />
          ) : (
            <PreviewTab
              hero={hero}
              about={about}
              serviceSection={serviceSection}
              threeCards={threeCards}
              whyChoose={whyChoose}
              footer={footer}
              services={services}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EditTab(props: any) {
  const {
    hero,
    setHero,
    about,
    setAbout,
    serviceSection,
    setServiceSection,
    threeCards,
    setThreeCards,
    whyChoose,
    setWhyChoose,
    footer,
    setFooter,
    activeSection,
    setActiveSection,
    handleSaveSection,
    services,
    addServiceCard,
    updateServiceCard,
    removeServiceCard,
    updateThreeCard,
    updateWhyChooseCard,
  } = props || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Hero Section"
          description="Title, content, stats"
          onClick={() => setActiveSection('hero')}
        />
        <SectionCard
          title="About Section"
          description="About title and content"
          onClick={() => setActiveSection('about')}
        />
        <SectionCard
          title="Service Section"
          description={`${serviceSection?.serviceCards?.length || 0} service cards`}
          onClick={() => setActiveSection('service')}
        />
        <SectionCard
          title="Three Cards"
          description="3 key highlight cards"
          onClick={() => setActiveSection('threeCards')}
        />
        <SectionCard
          title="Why Choose Us"
          description={`${whyChoose?.cards?.length || 0} cards`}
          onClick={() => setActiveSection('whyChoose')}
        />
        <SectionCard
          title="Call-to-Action Section"
          description="Call-to-action title and subtitle"
          onClick={() => setActiveSection('footer')}
        />
      </div>

      {activeSection && (
        <SectionEditorModal
          activeSection={activeSection}
          onClose={() => setActiveSection(null)}
          hero={hero}
          setHero={setHero}
          about={about}
          setAbout={setAbout}
          serviceSection={serviceSection}
          setServiceSection={setServiceSection}
          threeCards={threeCards}
          setThreeCards={setThreeCards}
          whyChoose={whyChoose}
          setWhyChoose={setWhyChoose}
          footer={footer}
          setFooter={setFooter}
          handleSaveSection={handleSaveSection}
          services={services}
          addServiceCard={addServiceCard}
          updateServiceCard={updateServiceCard}
          removeServiceCard={removeServiceCard}
          updateThreeCard={updateThreeCard}
          updateWhyChooseCard={updateWhyChooseCard}
        />
      )}
    </div>
  );
}

function PreviewTab({
  hero,
  about,
  serviceSection,
  threeCards,
  whyChoose,
  footer,
  services,
}: any) {
  return (
    <div className="space-y-12">
      <section className="rounded-lg border border-gray-200 p-6 bg-gradient-to-br from-red-50 to-orange-50 space-y-4">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            {hero?.titleHero || 'Hero Title'}
          </h4>
          <p className="text-gray-600 mb-4">
            {hero?.contentHero || 'Hero description will appear here.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-4">
          <div>
            <div className="text-xl font-bold text-gray-900">
              {hero?.globalPartners || '—'}
            </div>
            <div className="text-xs text-gray-500 uppercase mt-1">Global Partners</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">
              {hero?.yearsExperiences || '—'}
            </div>
            <div className="text-xs text-gray-500 uppercase mt-1">Years Experience</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">
              {hero?.successRate || '—'}
            </div>
            <div className="text-xs text-gray-500 uppercase mt-1">Success Rate</div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-6 bg-white space-y-3">
        <h4 className="text-xl font-bold text-gray-900">
          {about?.aboutTitle || 'About Section Title'}
        </h4>
        <p className="text-gray-600">
          {about?.aboutContent || 'About content preview will appear here.'}
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 p-6 bg-white space-y-4">
        <h4 className="text-xl font-bold text-gray-900">
          {serviceSection?.serviceTitle || 'Service Section Title'}
        </h4>
        <p className="text-gray-600">
          {serviceSection?.serviceContent || 'Service section content preview will appear here.'}
        </p>
        {serviceSection?.serviceCards?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {serviceSection.serviceCards.map((card: any, index: number) => {
              const selectedService = services?.find((s: any) => s.id === card.selectedService);
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {card.cardIcon ? (
                      <IconRenderer
                        icon={card.cardIcon}
                        size={24}
                        className="text-emerald-600"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">Icon</span>
                    )}
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedService ? selectedService.pageTitle : 'No service selected'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {card.content || 'Card content'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-6 bg-white space-y-4">
        <h4 className="text-xl font-bold text-gray-900">Key Highlights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {threeCards?.map((card: any, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center"
            >
              <div className="mb-3 flex items-center justify-center">
                {card.cardIcon ? (
                  <IconRenderer
                    icon={card.cardIcon}
                    size={32}
                    className="text-red-600"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Icon</span>
                )}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {card.cardTitle || 'Card Title'}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {card.cardContent || 'Card content'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {whyChoose?.title || 'Why Choose Us'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {whyChoose?.subtitle || 'Subtitle preview will appear here.'}
            </p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
            <MdBusiness className="text-red-600 text-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whyChoose?.cards?.map((card: any, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-3 mb-2">
                {card.cardIcon ? (
                  <IconRenderer
                    icon={card.cardIcon}
                    size={24}
                    className="text-red-600"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Icon</span>
                )}
                <span className="text-sm font-semibold text-gray-900">
                  {card.cardTitle || 'Card Title'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {card.cardContent || 'Card content'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-6 bg-gray-50 space-y-3">
        <h4 className="text-xl font-bold text-gray-900">
          {footer?.footerTitle || 'Footer Title'}
        </h4>
        <p className="text-gray-600">
          {footer?.footerSubtitle || 'Footer subtitle preview will appear here.'}
        </p>
      </section>
    </div>
  );
}

function SectionCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

function SectionEditorModal({
  activeSection,
  onClose,
  hero,
  setHero,
  about,
  setAbout,
  serviceSection,
  setServiceSection,
  threeCards,
  setThreeCards,
  whyChoose,
  setWhyChoose,
  footer,
  setFooter,
  handleSaveSection,
  services,
  addServiceCard,
  updateServiceCard,
  removeServiceCard,
  updateThreeCard,
  updateWhyChooseCard,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={hero?.titleHero || ''}
                  onChange={(e) => setHero({ ...hero, titleHero: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Main headline for the hero section"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Content</label>
                <textarea
                  value={hero?.contentHero || ''}
                  onChange={(e) => setHero({ ...hero, contentHero: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Short paragraph explaining your value proposition"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Global Partners</label>
                  <input
                    type="text"
                    value={hero?.globalPartners || ''}
                    onChange={(e) => setHero({ ...hero, globalPartners: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 3+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years Experience</label>
                  <input
                    type="text"
                    value={hero?.yearsExperiences || ''}
                    onChange={(e) => setHero({ ...hero, yearsExperiences: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 15+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate</label>
                  <input
                    type="text"
                    value={hero?.successRate || ''}
                    onChange={(e) => setHero({ ...hero, successRate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 98%"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveSection('hero')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Hero Section
              </button>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Title</label>
                <input
                  type="text"
                  value={about?.aboutTitle || ''}
                  onChange={(e) => setAbout({ ...about, aboutTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Section heading for About"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Content</label>
                <textarea
                  value={about?.aboutContent || ''}
                  onChange={(e) => setAbout({ ...about, aboutContent: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Describe your company, mission, and what makes you unique."
                />
              </div>
              <button
                onClick={() => handleSaveSection('about')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save About Section
              </button>
            </div>
          )}

          {activeSection === 'service' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Section Title</label>
                <input
                  type="text"
                  value={serviceSection?.serviceTitle || ''}
                  onChange={(e) => setServiceSection({ ...serviceSection, serviceTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Service section title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Section Content</label>
                <textarea
                  value={serviceSection?.serviceContent || ''}
                  onChange={(e) => setServiceSection({ ...serviceSection, serviceContent: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Service section subtitle"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">Service Cards</h4>
                  <button
                    type="button"
                    onClick={addServiceCard}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    + Add Card
                  </button>
                </div>
                {serviceSection?.serviceCards?.map((card: any, index: number) => {
                  const selectedServiceIds = serviceSection.serviceCards
                    .map((c: any, i: number) => (i !== index && c.selectedService ? c.selectedService : null))
                    .filter((id: any): id is string => id !== null);
                  const availableServices = services?.filter(
                    (svc: any) => !selectedServiceIds.includes(svc.id)
                  ) || [];

                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Card {index + 1}</h4>
                        {serviceSection.serviceCards.length > 1 && (
                          <button onClick={() => removeServiceCard(index)} className="text-red-600 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Card Icon SVG</label>
                          <input
                            type="text"
                            value={card.cardIcon || ''}
                            onChange={(e) => updateServiceCard(index, 'cardIcon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Paste inline SVG"
                          />
                          {card.cardIcon && (
                            <div className="mt-2">
                              <IconRenderer icon={card.cardIcon} size={20} className="text-emerald-600" />
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Select Service</label>
                          <select
                            value={card.selectedService || ''}
                            onChange={(e) => updateServiceCard(index, 'selectedService', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                          >
                            <option value="">Select a service</option>
                            {availableServices.map((svc: any) => (
                              <option key={svc.id} value={svc.id}>
                                {svc.pageTitle}
                              </option>
                            ))}
                            {card.selectedService && !availableServices.find((s: any) => s.id === card.selectedService) && (
                              <option value={card.selectedService}>
                                {services?.find((s: any) => s.id === card.selectedService)?.pageTitle || 'Selected Service'}
                              </option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Card Content</label>
                        <textarea
                          value={card.content || ''}
                          onChange={(e) => updateServiceCard(index, 'content', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Card content description"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => handleSaveSection('service')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Service Section
              </button>
            </div>
          )}

          {activeSection === 'threeCards' && (
            <div className="space-y-4">
              {threeCards?.map((card: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                  <h4 className="font-semibold">Card {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card Icon SVG</label>
                      <input
                        type="text"
                        value={card.cardIcon || ''}
                        onChange={(e) => updateThreeCard(index, 'cardIcon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Paste inline SVG"
                      />
                      {card.cardIcon && (
                        <div className="mt-2">
                          <IconRenderer icon={card.cardIcon} size={20} className="text-red-600" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Card Title</label>
                        <input
                          type="text"
                          value={card.cardTitle || ''}
                          onChange={(e) => updateThreeCard(index, 'cardTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Card Content</label>
                        <textarea
                          value={card.cardContent || ''}
                          onChange={(e) => updateThreeCard(index, 'cardContent', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleSaveSection('threeCards')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Three Cards Section
              </button>
            </div>
          )}

          {activeSection === 'whyChoose' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={whyChoose?.title || ''}
                  onChange={(e) => setWhyChoose({ ...whyChoose, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Why Choose Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={whyChoose?.subtitle || ''}
                  onChange={(e) => setWhyChoose({ ...whyChoose, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Short subtitle explaining the value of this section."
                />
              </div>
              {whyChoose?.cards?.map((card: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                  <h4 className="font-semibold">Card {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card Icon SVG</label>
                      <input
                        type="text"
                        value={card.cardIcon || ''}
                        onChange={(e) => updateWhyChooseCard(index, 'cardIcon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Paste inline SVG"
                      />
                      {card.cardIcon && (
                        <div className="mt-2">
                          <IconRenderer icon={card.cardIcon} size={20} className="text-red-600" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Card Title</label>
                        <input
                          type="text"
                          value={card.cardTitle || ''}
                          onChange={(e) => updateWhyChooseCard(index, 'cardTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Card Content</label>
                        <textarea
                          value={card.cardContent || ''}
                          onChange={(e) => updateWhyChooseCard(index, 'cardContent', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleSaveSection('whyChoose')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Why Choose Us Section
              </button>
            </div>
          )}

          {activeSection === 'footer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Title</label>
                <input
                  type="text"
                  value={footer?.footerTitle || ''}
                  onChange={(e) => setFooter({ ...footer, footerTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Footer title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Subtitle</label>
                <textarea
                  value={footer?.footerSubtitle || ''}
                  onChange={(e) => setFooter({ ...footer, footerSubtitle: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Footer subtitle or description"
                />
              </div>
              <button
                onClick={() => handleSaveSection('footer')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Footer Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
