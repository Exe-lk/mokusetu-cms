"use client";
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchAboutPage, updateAboutPage } from '@/src/store/slices/aboutSlice';
import type { StorySection, CoreValue, TimelineItem } from '@/src/services/about.service';
import IconRenderer from './IconRenderer';
import Swal from 'sweetalert2';

type TabType = 'edit' | 'preview';
type SectionType = 'header' | 'story' | 'mission' | 'values' | 'timeline' | 'cta';

export default function AboutPageEditor() {
  const dispatch = useAppDispatch();
  const { aboutPage, loading } = useAppSelector((state) => state.about);
  const [activeTab, setActiveTab] = useState<TabType>('edit');
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  console.log('aboutPage', aboutPage);

  const [headerData, setHeaderData] = useState({
    backgroundImage: '',
    pageTitle: '',
    pageSubtitle: '',
  });

  const [storySections, setStorySections] = useState<StorySection[]>([]);
  const [missionData, setMissionData] = useState({
    missionSectionTitle: '',
    missionSectionSubtitle: '',
    missionTitle: '',
    missionContent: '',
    missionIcon: '',
    visionTitle: '',
    visionContent: '',
    visionIcon: '',
    brandArchetypeTitle: '',
    brandArchetype: '',
  });
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [coreValuesSectionTitle, setCoreValuesSectionTitle] = useState('');
  const [coreValuesSectionSubtitle, setCoreValuesSectionSubtitle] = useState('');
  const [timelineSectionTitle, setTimelineSectionTitle] = useState('');
  const [timelineSectionSubtitle, setTimelineSectionSubtitle] = useState('');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [ctaData, setCtaData] = useState({
    ctaTitle: '',
    ctaContent: '',
  });

  useEffect(() => {
    dispatch(fetchAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (aboutPage) {
      setHeaderData({
        backgroundImage: aboutPage.backgroundImage || '',
        pageTitle: aboutPage.pageTitle || '',
        pageSubtitle: aboutPage.pageSubtitle || '',
      });
      setStorySections(aboutPage.storySections || []);
      setMissionData({
        missionSectionTitle: aboutPage.missionSectionTitle || '',
        missionSectionSubtitle: aboutPage.missionSectionSubtitle || '',
        missionTitle: aboutPage.missionTitle || '',
        missionContent: aboutPage.missionContent || '',
        missionIcon: aboutPage.missionIcon || '',
        visionTitle: aboutPage.visionTitle || '',
        visionContent: aboutPage.visionContent || '',
        visionIcon: aboutPage.visionIcon || '',
        brandArchetypeTitle: aboutPage.brandArchetypeTitle || '',
        brandArchetype: aboutPage.brandArchetype || '',
      });
      setCoreValues(aboutPage.coreValues || []);
      setCoreValuesSectionTitle(aboutPage.coreValuesSectionTitle || '');
      setCoreValuesSectionSubtitle(aboutPage.coreValuesSectionSubtitle || '');
      setTimelineSectionTitle(aboutPage.timelineSectionTitle || '');
      setTimelineSectionSubtitle(aboutPage.timelineSectionSubtitle || '');
      const timelineData = Array.isArray(aboutPage.timeline) ? aboutPage.timeline : (aboutPage.timeline ? [aboutPage.timeline] : []);
      setTimeline(timelineData);
      setCtaData({
        ctaTitle: aboutPage.ctaTitle || '',
        ctaContent: aboutPage.ctaContent || '',
      });
    }
  }, [aboutPage]);

  const handleImageUpload = async (file: File, fieldName: string, sectionIndex?: number) => {
    const uploadKey = sectionIndex !== undefined ? `${fieldName}-${sectionIndex}` : fieldName;
    setUploadingImage(uploadKey);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'about');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.url;

        if (fieldName === 'backgroundImage') {
          setHeaderData({ ...headerData, backgroundImage: imageUrl });
        }

        return imageUrl;
      } else {
        alert('Failed to upload image: ' + result.error);
        return null;
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSaveSection = async (section: SectionType) => {
    try {
      let updateData: any = {};

      switch (section) {
        case 'header':
          if (!headerData.pageTitle || headerData.pageTitle.trim() === '') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Page title is required',
            });
            return;
          }
          updateData = headerData;
          break;
        case 'story':
          updateData = { storySections };
          break;
        case 'mission':
          updateData = missionData;
          break;
        case 'values':
          updateData = { 
            coreValues,
            coreValuesSectionTitle,
            coreValuesSectionSubtitle
          };
          break;
        case 'timeline':
          updateData = { 
            timeline,
            timelineSectionTitle,
            timelineSectionSubtitle
          };
          break;
        case 'cta':
          updateData = ctaData;
          break;
      }

      const result = await dispatch(updateAboutPage(updateData)).unwrap();
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

  const addStorySection = () => {
    setStorySections([...storySections, { title: '', content: '' }]);
  };

  const updateStorySection = (index: number, field: keyof StorySection, value: string) => {
    const updated = [...storySections];
    updated[index] = { ...updated[index], [field]: value };
    setStorySections(updated);
  };

  const removeStorySection = (index: number) => {
    setStorySections(storySections.filter((_, i) => i !== index));
  };

  const addCoreValue = () => {
    setCoreValues([...coreValues, { title: '', description: '', icon: 'star' }]);
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    const updated = [...coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setCoreValues(updated);
  };

  const removeCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const addTimelineItem = () => {
    setTimeline([...timeline, { year: '', title: '', description: '' }]);
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };

  const removeTimelineItem = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  if (loading && !aboutPage) {
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
              headerData={headerData}
              setHeaderData={setHeaderData}
              storySections={storySections}
              setStorySections={setStorySections}
              missionData={missionData}
              setMissionData={setMissionData}
              coreValues={coreValues}
              setCoreValues={setCoreValues}
              coreValuesSectionTitle={coreValuesSectionTitle}
              setCoreValuesSectionTitle={setCoreValuesSectionTitle}
              coreValuesSectionSubtitle={coreValuesSectionSubtitle}
              setCoreValuesSectionSubtitle={setCoreValuesSectionSubtitle}
              timelineSectionTitle={timelineSectionTitle}
              setTimelineSectionTitle={setTimelineSectionTitle}
              timelineSectionSubtitle={timelineSectionSubtitle}
              setTimelineSectionSubtitle={setTimelineSectionSubtitle}
              timeline={timeline}
              setTimeline={setTimeline}
              ctaData={ctaData}
              setCtaData={setCtaData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              handleImageUpload={handleImageUpload}
              handleSaveSection={handleSaveSection}
              uploadingImage={uploadingImage}
              addStorySection={addStorySection}
              updateStorySection={updateStorySection}
              removeStorySection={removeStorySection}
              addCoreValue={addCoreValue}
              updateCoreValue={updateCoreValue}
              removeCoreValue={removeCoreValue}
              addTimelineItem={addTimelineItem}
              updateTimelineItem={updateTimelineItem}
              removeTimelineItem={removeTimelineItem}
            />
          ) : (
            <PreviewTab
              headerData={headerData}
              storySections={storySections}
              missionData={missionData}
              coreValues={coreValues}
              coreValuesSectionTitle={coreValuesSectionTitle}
              coreValuesSectionSubtitle={coreValuesSectionSubtitle}
              timelineSectionTitle={timelineSectionTitle}
              timelineSectionSubtitle={timelineSectionSubtitle}
              timeline={timeline}
              ctaData={ctaData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EditTab(props: any) {
  const {
    headerData,
    setHeaderData,
    storySections,
    setStorySections,
    missionData,
    setMissionData,
    coreValues,
    setCoreValues,
    coreValuesSectionTitle = '',
    setCoreValuesSectionTitle,
    coreValuesSectionSubtitle = '',
    setCoreValuesSectionSubtitle,
    timelineSectionTitle = '',
    setTimelineSectionTitle,
    timelineSectionSubtitle = '',
    setTimelineSectionSubtitle,
    timeline,
    setTimeline,
    ctaData,
    setCtaData,
    activeSection,
    setActiveSection,
    handleImageUpload,
    handleSaveSection,
    uploadingImage,
    addStorySection,
    updateStorySection,
    removeStorySection,
    addCoreValue,
    updateCoreValue,
    removeCoreValue,
    addTimelineItem,
    updateTimelineItem,
    removeTimelineItem,
  } = props || {};
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Header Section"
          description="Background image, title, subtitle"
          onClick={() => setActiveSection('header')}
        />
        <SectionCard
          title="Story Sections"
          description={`${storySections.length} story sections`}
          onClick={() => setActiveSection('story')}
        />
        <SectionCard
          title="Mission & Vision"
          description="Mission, vision, brand archetype"
          onClick={() => setActiveSection('mission')}
        />
        <SectionCard
          title="Core Values"
          description={`${coreValues.length} values`}
          onClick={() => setActiveSection('values')}
        />
        <SectionCard
          title="Timeline"
          description={`${timeline.length} milestones`}
          onClick={() => setActiveSection('timeline')}
        />
        <SectionCard
          title="Call-to-Action Section"
          description="Call-to-action"
          onClick={() => setActiveSection('cta')}
        />
      </div>

      {activeSection && (
        <SectionEditorModal
          activeSection={activeSection}
          onClose={() => setActiveSection(null)}
          headerData={headerData}
          setHeaderData={setHeaderData}
          storySections={storySections}
          setStorySections={setStorySections}
          missionData={missionData}
          setMissionData={setMissionData}
          coreValues={coreValues}
          setCoreValues={setCoreValues}
          coreValuesSectionTitle={coreValuesSectionTitle}
          setCoreValuesSectionTitle={setCoreValuesSectionTitle}
          coreValuesSectionSubtitle={coreValuesSectionSubtitle}
          setCoreValuesSectionSubtitle={setCoreValuesSectionSubtitle}
          timelineSectionTitle={timelineSectionTitle}
          setTimelineSectionTitle={setTimelineSectionTitle}
          timelineSectionSubtitle={timelineSectionSubtitle}
          setTimelineSectionSubtitle={setTimelineSectionSubtitle}
          timeline={timeline}
          setTimeline={setTimeline}
          ctaData={ctaData}
          setCtaData={setCtaData}
          handleImageUpload={handleImageUpload}
          handleSaveSection={handleSaveSection}
          uploadingImage={uploadingImage}
          addStorySection={addStorySection}
          updateStorySection={updateStorySection}
          removeStorySection={removeStorySection}
          addCoreValue={addCoreValue}
          updateCoreValue={updateCoreValue}
          removeCoreValue={removeCoreValue}
          addTimelineItem={addTimelineItem}
          updateTimelineItem={updateTimelineItem}
          removeTimelineItem={removeTimelineItem}
        />
      )}
    </div>
  );
}

function PreviewTab({
  headerData,
  storySections,
  missionData,
  coreValues,
  coreValuesSectionTitle = '',
  coreValuesSectionSubtitle = '',
  timelineSectionTitle = '',
  timelineSectionSubtitle = '',
  timeline = [],
  ctaData,
}: any) {
  return (
    <div className="space-y-12">
      <section className="relative w-full min-h-[60vh] rounded-lg overflow-hidden">
        {headerData.backgroundImage && (
          <>
            <img
              src={headerData.backgroundImage}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/40 to-black/80"></div>
          </>
        )}
        {!headerData.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        )}
        <div className="relative z-10 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
              {headerData.pageTitle || 'About Us'}
            </h1>
            {headerData.pageSubtitle && (
              <p className="text-xl text-gray-200 max-w-3xl mx-auto [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
                {headerData.pageSubtitle}
              </p>
            )}
            <div className="mt-8 h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {storySections.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {storySections.map((section: StorySection, index: number) => (
                <div key={index} className="bg-white shadow-lg p-8 rounded-3xl">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(missionData.missionTitle || missionData.visionTitle) && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black">
                {missionData.missionSectionTitle || 'Our Mission & Vision'}
              </h2>
              {missionData.missionSectionSubtitle && (
                <p className="text-lg text-gray-600 mt-4">
                  {missionData.missionSectionSubtitle}
                </p>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {missionData.missionTitle && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    {missionData.missionIcon && (
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <IconRenderer icon={missionData.missionIcon} color="#1e3a8a" size={24} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-black">{missionData.missionTitle}</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                        {missionData.missionContent}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {missionData.visionTitle && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    {missionData.visionIcon && (
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <IconRenderer icon={missionData.visionIcon} color="#1e3a8a" size={24} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-black">{missionData.visionTitle}</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                        {missionData.visionContent}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {missionData.brandArchetype && (
              <div className="mt-12 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-center text-black">
                  {missionData.brandArchetypeTitle || 'Our Brand Archetype: The Caretaker'}
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {missionData.brandArchetype}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {coreValues.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black">
                {coreValuesSectionTitle || 'Our Core Values'}
              </h2>
              {coreValuesSectionSubtitle && (
                <p className="text-lg text-gray-600 mt-4">
                  {coreValuesSectionSubtitle}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value: CoreValue, index: number) => (
                <div key={index} className="bg-gray-50 border border-gray-200 p-6 rounded-xl text-center">
                  {value.icon && (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <IconRenderer icon={value.icon} color="#1e3a8a" size={32} />
                    </div>
                  )}
                  <h4 className="text-lg font-semibold mb-3 text-black">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(timelineSectionTitle || timelineSectionSubtitle || (timeline && Array.isArray(timeline) && timeline.length > 0)) && (
        <section className="section section-muted">
          <div className="container mx-auto px-6">
            {timelineSectionTitle && (
              <div className="text-center mb-16 fade-in visible">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="text-black">{timelineSectionTitle}</span>
                </h2>
                {timelineSectionSubtitle && (
                  <p className="text-xl text-muted max-w-3xl mx-auto">
                    {timelineSectionSubtitle}
                  </p>
                )}
              </div>
            )}

            {timeline.length > 0 && (
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 to-secondary/20"></div>

                <div className="space-y-12">
                  {timeline.map((item: TimelineItem, index: number) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div 
                        key={index} 
                        className={`relative flex items-center ${isEven ? 'slide-in-left' : 'slide-in-right'} visible`} 
                        style={{ transitionDelay: `${index * 0.2}s` }}
                      >
                        {isEven ? (
                          <>
                            <div className="w-1/2 pr-8 text-right">
                              <div className="floating-paper p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-foreground mb-2">{item.year} - {item.title}</h3>
                                <p className="text-muted">{item.description}</p>
                              </div>
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                            <div className="w-1/2 pl-8"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-1/2 pr-8"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-lg"></div>
                            <div className="w-1/2 pl-8">
                              <div className="floating-paper p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-foreground mb-2">{item.year} - {item.title}</h3>
                                <p className="text-muted">{item.description}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {ctaData.ctaTitle && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <div className="bg-white shadow-lg p-12 rounded-3xl text-center max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-black">
                {ctaData.ctaTitle}
              </h2>
              {ctaData.ctaContent && (
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto whitespace-pre-line">
                  {ctaData.ctaContent}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all">
                  Get Started Today
                </a>
                <a href="/services" className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-all">
                  Explore Our Services
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
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
  headerData,
  setHeaderData,
  storySections,
  setStorySections,
  missionData,
  setMissionData,
  coreValues,
  setCoreValues,
  coreValuesSectionTitle = '',
  setCoreValuesSectionTitle,
  coreValuesSectionSubtitle = '',
  setCoreValuesSectionSubtitle,
  timelineSectionTitle = '',
  setTimelineSectionTitle,
  timelineSectionSubtitle = '',
  setTimelineSectionSubtitle,
  timeline,
  setTimeline,
  ctaData,
  setCtaData,
  handleImageUpload,
  handleSaveSection,
  uploadingImage,
  addStorySection,
  updateStorySection,
  removeStorySection,
  addCoreValue,
  updateCoreValue,
  removeCoreValue,
  addTimelineItem,
  updateTimelineItem,
  removeTimelineItem,
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
          {activeSection === 'header' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                {headerData.backgroundImage && (
                  <img src={headerData.backgroundImage} alt="Background" className="w-full h-48 object-cover rounded-lg mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageUpload(file, 'backgroundImage');
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  disabled={uploadingImage === 'backgroundImage'}
                />
                {uploadingImage === 'backgroundImage' && (
                  <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title *</label>
                <input
                  type="text"
                  value={headerData.pageTitle}
                  onChange={(e) => setHeaderData({ ...headerData, pageTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                <textarea
                  value={headerData.pageSubtitle}
                  onChange={(e) => setHeaderData({ ...headerData, pageSubtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={() => handleSaveSection('header')}
                disabled={!headerData.pageTitle}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300"
              >
                Save Header
              </button>
            </div>
          )}

          {activeSection === 'story' && (
            <div className="space-y-4">
              {storySections.map((section: StorySection, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Story Section {index + 1}</h4>
                    <button onClick={() => removeStorySection(index)} className="text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateStorySection(index, 'title', e.target.value)}
                    placeholder="Section Title (e.g., MokuSetu: Where Bridge Begins)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <textarea
                    value={section.content}
                    onChange={(e) => updateStorySection(index, 'content', e.target.value)}
                    placeholder="Section Content"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}
              <button
                onClick={addStorySection}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-600 hover:text-red-600"
              >
                + Add Story Section
              </button>
              <button
                onClick={() => handleSaveSection('story')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Story Sections
              </button>
            </div>
          )}

          {activeSection === 'mission' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Main Title</label>
                <input
                  type="text"
                  value={missionData.missionSectionTitle}
                  onChange={(e) => setMissionData({ ...missionData, missionSectionTitle: e.target.value })}
                  placeholder="Our Mission & Vision"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={missionData.missionSectionSubtitle}
                  onChange={(e) => setMissionData({ ...missionData, missionSectionSubtitle: e.target.value })}
                  placeholder="Driving international business success in Japan through cultural expertise and strategic partnerships"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Icon (SVG)</label>
                <textarea
                  value={missionData.missionIcon}
                  onChange={(e) => setMissionData({ ...missionData, missionIcon: e.target.value })}
                  placeholder="Paste SVG code here (e.g., &lt;svg&gt;...&lt;/svg&gt;)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 font-mono text-sm"
                />
                {missionData.missionIcon && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Preview:</div>
                    <div className="flex items-center justify-center w-16 h-16">
                      <IconRenderer icon={missionData.missionIcon} color="#1e40af" size={32} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Title</label>
                <input
                  type="text"
                  value={missionData.missionTitle}
                  onChange={(e) => setMissionData({ ...missionData, missionTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Content</label>
                <textarea
                  value={missionData.missionContent}
                  onChange={(e) => setMissionData({ ...missionData, missionContent: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Icon (SVG)</label>
                <textarea
                  value={missionData.visionIcon}
                  onChange={(e) => setMissionData({ ...missionData, visionIcon: e.target.value })}
                  placeholder="Paste SVG code here (e.g., &lt;svg&gt;...&lt;/svg&gt;)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 font-mono text-sm"
                />
                {missionData.visionIcon && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Preview:</div>
                    <div className="flex items-center justify-center w-16 h-16">
                      <IconRenderer icon={missionData.visionIcon} color="#1e40af" size={32} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Title</label>
                <input
                  type="text"
                  value={missionData.visionTitle}
                  onChange={(e) => setMissionData({ ...missionData, visionTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Content</label>
                <textarea
                  value={missionData.visionContent}
                  onChange={(e) => setMissionData({ ...missionData, visionContent: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Archetype Title</label>
                <input
                  type="text"
                  value={missionData.brandArchetypeTitle}
                  onChange={(e) => setMissionData({ ...missionData, brandArchetypeTitle: e.target.value })}
                  placeholder="Our Brand Archetype: The Caretaker"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Archetype Content</label>
                <textarea
                  value={missionData.brandArchetype}
                  onChange={(e) => setMissionData({ ...missionData, brandArchetype: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={() => handleSaveSection('mission')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Mission & Vision
              </button>
            </div>
          )}

          {activeSection === 'values' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={coreValuesSectionTitle}
                  onChange={(e) => {
                    if (setCoreValuesSectionTitle) {
                      setCoreValuesSectionTitle(e.target.value);
                    }
                  }}
                  placeholder="Our Core Values"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={coreValuesSectionSubtitle}
                  onChange={(e) => {
                    if (setCoreValuesSectionSubtitle) {
                      setCoreValuesSectionSubtitle(e.target.value);
                    }
                  }}
                  placeholder="Subtitle for core values section"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              {coreValues.map((value: CoreValue, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Value {index + 1}</h4>
                    <button onClick={() => removeCoreValue(index)} className="text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon (SVG)</label>
                    <textarea
                      value={value.icon}
                      onChange={(e) => updateCoreValue(index, 'icon', e.target.value)}
                      placeholder="Paste SVG code here (e.g., &lt;svg&gt;...&lt;/svg&gt;)"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 font-mono text-sm"
                    />
                    {value.icon && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Preview:</div>
                        <div className="flex items-center justify-center w-16 h-16">
                          <IconRenderer icon={value.icon} color="#1e3a8a" size={32} />
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                    placeholder="Value Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <textarea
                    value={value.description}
                    onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                    placeholder="Value Description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}
              <button
                onClick={addCoreValue}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-600 hover:text-red-600"
              >
                + Add Core Value
              </button>
              <button
                onClick={() => handleSaveSection('values')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Core Values
              </button>
            </div>
          )}

          {activeSection === 'timeline' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={timelineSectionTitle}
                  onChange={(e) => {
                    if (setTimelineSectionTitle) {
                      setTimelineSectionTitle(e.target.value);
                    }
                  }}
                  placeholder="Our Journey"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={timelineSectionSubtitle}
                  onChange={(e) => {
                    if (setTimelineSectionSubtitle) {
                      setTimelineSectionSubtitle(e.target.value);
                    }
                  }}
                  placeholder="Subtitle for timeline section"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              {timeline.map((item: TimelineItem, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Milestone {index + 1}</h4>
                    <button onClick={() => removeTimelineItem(index)} className="text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                    placeholder="Year (e.g., 2025 July)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                    placeholder="Milestone Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}
              <button
                onClick={addTimelineItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-600 hover:text-red-600"
              >
                + Add Timeline Item
              </button>
              <button
                onClick={() => handleSaveSection('timeline')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save Timeline
              </button>
            </div>
          )}

          {activeSection === 'cta' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Title</label>
                <input
                  type="text"
                  value={ctaData.ctaTitle}
                  onChange={(e) => setCtaData({ ...ctaData, ctaTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Content</label>
                <textarea
                  value={ctaData.ctaContent}
                  onChange={(e) => setCtaData({ ...ctaData, ctaContent: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={() => handleSaveSection('cta')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Save CTA Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
