"use client";
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { createService, updateService } from '@/src/store/slices/servicesSlice';
import type { Service, CardContent, ServiceItem, WhyChoosePoint } from '@/src/services';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
}

export default function ServiceFormModal({ isOpen, onClose, service }: ServiceFormModalProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(service?.backgroundImage || '');
  const [listImagePreview, setListImagePreview] = useState<string>(service?.listImage || '');
  
  const [formData, setFormData] = useState({
    listImage: '',
    summary: '',
    backgroundImage: '',
    pageTitle: '',
    pageSubtitle: '',
    mainContent: '',
    servicesTitle: '',
    whyChooseTitle: '',
    footerTitle: '',
    footerContent: '',
    active: true,
    order: 0,
  });

  const [cardContents, setCardContents] = useState<CardContent[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [whyChoosePoints, setWhyChoosePoints] = useState<WhyChoosePoint[]>([]);

  useEffect(() => {
    if (service) {
      setFormData({
        listImage: service.listImage || '',
        summary: service.summary || '',
        backgroundImage: service.backgroundImage || '',
        pageTitle: service.pageTitle || '',
        pageSubtitle: service.pageSubtitle || '',
        mainContent: service.mainContent || '',
        servicesTitle: service.servicesTitle || '',
        whyChooseTitle: service.whyChooseTitle || '',
        footerTitle: service.footerTitle || '',
        footerContent: service.footerContent || '',
        active: service.active !== undefined ? service.active : true,
        order: service.order || 0,
      });
      setImagePreview(service.backgroundImage || '');
      setListImagePreview(service.listImage || '');
      setCardContents(service.cardContents || []);
      setServicesList(service.servicesList || []);
      setWhyChoosePoints(service.whyChoosePoints || []);
    }
  }, [service]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setLoading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'services');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, backgroundImage: result.data.url });
        setImagePreview(result.data.url);
      } else {
        alert('Failed to upload image: ' + result.error);
        setImagePreview('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setImagePreview('');
    } finally {
      setLoading(false);
    }
  };

  const handleListImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setListImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setLoading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'services');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, listImage: result.data.url });
        setListImagePreview(result.data.url);
      } else {
        alert('Failed to upload image: ' + result.error);
        setListImagePreview('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setListImagePreview('');
    } finally {
      setLoading(false);
    }
  };

  const addCardContent = () => {
    setCardContents([...cardContents, { header: '', content: '', icon: '' }]);
  };

  const updateCardContent = (index: number, field: keyof CardContent, value: string) => {
    const updated = [...cardContents];
    updated[index] = { ...updated[index], [field]: value };
    setCardContents(updated);
  };

  const removeCardContent = (index: number) => {
    setCardContents(cardContents.filter((_, i) => i !== index));
  };

  const addServiceItem = () => {
    setServicesList([...servicesList, { title: '', points: [''] }]);
  };

  const updateServiceItem = (index: number, field: 'title' | 'points', value: string | string[]) => {
    const updated = [...servicesList];
    updated[index] = { ...updated[index], [field]: value };
    setServicesList(updated);
  };

  const addServicePoint = (serviceIndex: number) => {
    const updated = [...servicesList];
    updated[serviceIndex].points.push('');
    setServicesList(updated);
  };

  const updateServicePoint = (serviceIndex: number, pointIndex: number, value: string) => {
    const updated = [...servicesList];
    updated[serviceIndex].points[pointIndex] = value;
    setServicesList(updated);
  };

  const removeServicePoint = (serviceIndex: number, pointIndex: number) => {
    const updated = [...servicesList];
    updated[serviceIndex].points = updated[serviceIndex].points.filter((_, i) => i !== pointIndex);
    setServicesList(updated);
  };

  const removeServiceItem = (index: number) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

  const addWhyChoosePoint = () => {
    setWhyChoosePoints([...whyChoosePoints, { title: '', icon: '', subPoints: [''] }]);
  };

  const updateWhyChoosePoint = (index: number, field: keyof WhyChoosePoint, value: string | string[]) => {
    const updated = [...whyChoosePoints];
    updated[index] = { ...updated[index], [field]: value };
    setWhyChoosePoints(updated);
  };

  const addWhyChooseSubPoint = (pointIndex: number) => {
    const updated = [...whyChoosePoints];
    updated[pointIndex].subPoints.push('');
    setWhyChoosePoints(updated);
  };

  const updateWhyChooseSubPoint = (pointIndex: number, subPointIndex: number, value: string) => {
    const updated = [...whyChoosePoints];
    updated[pointIndex].subPoints[subPointIndex] = value;
    setWhyChoosePoints(updated);
  };

  const removeWhyChooseSubPoint = (pointIndex: number, subPointIndex: number) => {
    const updated = [...whyChoosePoints];
    updated[pointIndex].subPoints = updated[pointIndex].subPoints.filter((_, i) => i !== subPointIndex);
    setWhyChoosePoints(updated);
  };

  const removeWhyChoosePoint = (index: number) => {
    setWhyChoosePoints(whyChoosePoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        cardContents: cardContents.filter(c => c.header || c.content),
        servicesList: servicesList.filter(s => s.title),
        whyChoosePoints: whyChoosePoints.filter(w => w.title),
      };

      if (service?.id) {
        await dispatch(updateService({ id: service.id, data: serviceData })).unwrap();
      } else {
        await dispatch(createService(serviceData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Listing Display (All Services Page)</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                List Thumbnail Image (Optional)
              </label>
              <div className="flex items-start gap-4">
                {listImagePreview && (
                  <div className="w-40 h-28 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                    <img src={listImagePreview} alt="List preview" className="w-full h-full object-cover" />
                    {loading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleListImageChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This image is used on the all-services listing/cards. Recommended: 800x500px, max 1MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Summary (2–3 lines, used in listing)
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Write a brief 2–3 line summary that will appear on the service card in the all-services page."
              />
            </div>
          </div>

          <div className="border-l-4 border-red-600 pl-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Header Section (Required)</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Background Image * (Required)
              </label>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {loading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended: 1920x600px, max 2MB. Uploads to Supabase Storage.
                  </p>
                  {loading && (
                    <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading image to storage...
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Page Title * (Required)
              </label>
              <input
                type="text"
                required
                value={formData.pageTitle}
                onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Quality Inspection Services"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Page Subtitle * (Required)
              </label>
              <textarea
                required
                value={formData.pageSubtitle}
                onChange={(e) => setFormData({ ...formData, pageSubtitle: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Brief tagline for the service"
              />
            </div>
          </div>

          <div className="border-l-4 border-red-600 pl-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Main Content (Required)</h3>
            <textarea
              required
              value={formData.mainContent}
              onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Detailed description of the service. Use double line breaks for paragraphs."
            />
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Feature Cards (Optional)</h3>
              <button
                type="button"
                onClick={addCardContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                + Add Card
              </button>
            </div>
            
            {cardContents.map((card, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Card {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeCardContent(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={card.header}
                  onChange={(e) => updateCardContent(index, 'header', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  placeholder="Card header"
                />
                <textarea
                  value={card.content}
                  onChange={(e) => updateCardContent(index, 'content', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  placeholder="Card content"
                />
                <input
                  type="text"
                  value={card.icon}
                  onChange={(e) => updateCardContent(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Icon name or SVG path (optional)"
                />
              </div>
            ))}
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Services Section Title (Optional)
              </label>
              <input
                type="text"
                value={formData.servicesTitle}
                onChange={(e) => setFormData({ ...formData, servicesTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Our Quality Inspection Services"
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Service Items</h3>
              <button
                type="button"
                onClick={addServiceItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
              >
                + Add Service Item
              </button>
            </div>
            
            {servicesList.map((item, sIndex) => (
              <div key={sIndex} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Service Item {sIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeServiceItem(sIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateServiceItem(sIndex, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Service category title"
                />
                <div className="pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Points:</label>
                    <button
                      type="button"
                      onClick={() => addServicePoint(sIndex)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      + Add Point
                    </button>
                  </div>
                  {item.points.map((point, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-2 mb-2">
                      <span className="text-red-600">•</span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateServicePoint(sIndex, pIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Service point"
                      />
                      <button
                        type="button"
                        onClick={() => removeServicePoint(sIndex, pIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why Choose Section Title (Optional)
              </label>
              <input
                type="text"
                value={formData.whyChooseTitle}
                onChange={(e) => setFormData({ ...formData, whyChooseTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Why Choose Our Quality Services?"
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Why Choose Points</h3>
              <button
                type="button"
                onClick={addWhyChoosePoint}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
              >
                + Add Point
              </button>
            </div>
            
            {whyChoosePoints.map((point, wIndex) => (
              <div key={wIndex} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Point {wIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeWhyChoosePoint(wIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={point.title}
                  onChange={(e) => updateWhyChoosePoint(wIndex, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  placeholder="Main point title"
                />
                <input
                  type="text"
                  value={point.icon || ''}
                  onChange={(e) => updateWhyChoosePoint(wIndex, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Icon name (optional)"
                />
                <div className="pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Sub-points:</label>
                    <button
                      type="button"
                      onClick={() => addWhyChooseSubPoint(wIndex)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      + Add Sub-point
                    </button>
                  </div>
                  {point.subPoints.map((subPoint, spIndex) => (
                    <div key={spIndex} className="flex items-center gap-2 mb-2">
                      <span className="text-purple-600">◦</span>
                      <input
                        type="text"
                        value={subPoint}
                        onChange={(e) => updateWhyChooseSubPoint(wIndex, spIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Sub-point"
                      />
                      <button
                        type="button"
                        onClick={() => removeWhyChooseSubPoint(wIndex, spIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Footer Call-to-Action (Optional)</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Footer Title
              </label>
              <input
                type="text"
                value={formData.footerTitle}
                onChange={(e) => setFormData({ ...formData, footerTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Need quality inspection services?"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Footer Content
              </label>
              <textarea
                value={formData.footerContent}
                onChange={(e) => setFormData({ ...formData, footerContent: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Call-to-action description"
              />
            </div>
          </div>

          <div className="border-l-4 border-gray-500 pl-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
