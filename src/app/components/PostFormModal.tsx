"use client";
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { createPost, updatePost, fetchPosts } from '@/src/store/slices/postsSlice';
import type { Post } from '@/src/services';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Swal from 'sweetalert2';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post | null;
}

export default function PostFormModal({ isOpen, onClose, post }: PostFormModalProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    published: false,
    categoryId: '',
  });

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#333333' },
    { name: 'Gray', value: '#666666' },
    { name: 'Light Gray', value: '#999999' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Yellow', value: '#ca8a04' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Pink', value: '#db2777' },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextStyle,
      Color,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
    ],
    content: formData.content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, content: html }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        'data-placeholder': 'Write your blog content here. Use the toolbar to format text, add headings, and create paragraphs...',
      },
    },
  });

  useEffect(() => {
    if (post) {
      const newFormData = {
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featuredImage: (post as any).featuredImage || '',
        published: post.published || false,
        categoryId: post.categoryId || '',
      };
      setFormData(newFormData);
      setImagePreview((post as any).featuredImage || '');
      if (editor && newFormData.content !== editor.getHTML()) {
        editor.commands.setContent(newFormData.content);
      }
    } else {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        published: false,
        categoryId: '',
      });
      setImagePreview('');
      if (editor) {
        editor.commands.clearContent();
      }
    }
  }, [post, editor]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColorPicker && !target.closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
      if (showLinkInput && !target.closest('.link-input-container')) {
        setShowLinkInput(false);
        setLinkUrl('');
      }
    };

    if (showColorPicker || showLinkInput) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showColorPicker, showLinkInput]);

  const handleSetLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = linkUrl.trim() || previousUrl;

    if (url) {
      const finalUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;
      
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: finalUrl })
        .run();
    }

    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

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
      uploadFormData.append('bucket', 'posts');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, featuredImage: result.data.url });
        setImagePreview(result.data.url);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to upload image: ' + result.error,
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setImagePreview('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload image. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setImagePreview('');
    } finally {
      setLoading(false);
    }
  };

  const hasContent = (html: string): boolean => {
    if (!html) return false;
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasContent(formData.content)) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter some content for the post.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);

    try {
      const postData: any = {
        ...formData,
      };

      if (post?.id) {
        await dispatch(updatePost({ id: post.id, data: postData })).unwrap();
        await dispatch(fetchPosts()).unwrap();
        Swal.fire({
          title: 'Updated',
          text: 'Post updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        onClose();
      } else {
        await dispatch(createPost(postData)).unwrap();
        await dispatch(fetchPosts()).unwrap();

        setFormData({
          title: '',
          content: '',
          excerpt: '',
          featuredImage: '',
          published: false,
          categoryId: '',
        });
        setImagePreview('');
        if (editor) {
          editor.commands.clearContent();
        }

        Swal.fire({
          title: 'Created',
          text: 'Post created successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        onClose();

      }
    } catch (error) {
      console.error('Error saving post:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error saving post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!post?.id) {
      setFormData({ ...formData, published: !formData.published });
      return;
    }

    try {
      setLoading(true);
      const newPublishedState = !formData.published;
      await dispatch(updatePost({ 
        id: post.id, 
        data: { published: newPublishedState } 
      })).unwrap();
      setFormData({ ...formData, published: newPublishedState });
    } catch (error) {
      console.error('Error toggling publish status:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update publish status',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {post ? 'Edit Post' : 'Create New Post'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Blog Title * (Required)
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Featured Image
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
                  Recommended: 1200x630px, max 2MB. Uploads to Supabase Storage.
                </p>
                {loading && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading image...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Excerpt (Brief Summary)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Short summary for preview cards..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content * (Required)
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent bg-white">  
              {editor && (
                <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('bold') ? 'bg-gray-300' : ''
                    }`}
                    title="Bold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a3 3 0 000 6h2a3 3 0 000-6H5zM5 10a3 3 0 000 6h6a3 3 0 000-6H5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('italic') ? 'bg-gray-300' : ''
                    }`}
                    title="Italic"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 2h4M8 18h4M7 2l2 16" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('underline') ? 'bg-gray-300' : ''
                    }`}
                    title="Underline"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4h10M5 16h10M5 4v12" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('strike') ? 'bg-gray-300' : ''
                    }`}
                    title="Strikethrough"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 10h10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <div className="relative color-picker-container">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={`p-2 rounded hover:bg-gray-200 transition-colors relative ${
                        editor.isActive('textStyle') ? 'bg-gray-300' : ''
                      }`}
                      title="Text Color"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <div 
                        className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-white"
                        style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                      />
                    </button>
                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50">
                        <div className="grid grid-cols-4 gap-2 w-48">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => {
                                editor.chain().focus().setColor(color.value).run();
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <input
                            type="color"
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            onChange={(e) => {
                              editor.chain().focus().setColor(e.target.value).run();
                            }}
                            className="w-full h-8 cursor-pointer"
                            title="Custom Color"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <div className="relative link-input-container">
                    <button
                      type="button"
                      onClick={() => {
                        if (editor.isActive('link')) {
                          setLinkUrl(editor.getAttributes('link').href || '');
                        }
                        setShowLinkInput(!showLinkInput);
                      }}
                      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                        editor.isActive('link') ? 'bg-gray-300' : ''
                      }`}
                      title="Insert/Edit Link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    {showLinkInput && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 w-80">
                        <input
                          type="text"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="Enter URL (e.g., https://example.com)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSetLink();
                            }
                            if (e.key === 'Escape') {
                              setShowLinkInput(false);
                              setLinkUrl('');
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSetLink}
                            className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            {editor.isActive('link') ? 'Update' : 'Add'} Link
                          </button>
                          {editor.isActive('link') && (
                            <button
                              type="button"
                              onClick={handleRemoveLink}
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setShowLinkInput(false);
                              setLinkUrl('');
                            }}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
                    }`}
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                    }`}
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
                    }`}
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('bulletList') ? 'bg-gray-300' : ''
                    }`}
                    title="Bullet List"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="6" r="1.5" />
                      <circle cx="4" cy="10" r="1.5" />
                      <circle cx="4" cy="14" r="1.5" />
                      <path d="M8 6h8M8 10h8M8 14h8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('orderedList') ? 'bg-gray-300' : ''
                    }`}
                    title="Numbered List"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 6h1M4 10h1M4 14h1M8 6h8M8 10h8M8 14h8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('blockquote') ? 'bg-gray-300' : ''
                    }`}
                    title="Blockquote"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6 6l-2 4h2v4h8V10h2l-2-4H6z" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                      editor.isActive('codeBlock') ? 'bg-gray-300' : ''
                    }`}
                    title="Code Block"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 4l-2 2 2 2M14 4l2 2-2 2M4 10h12" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    className="p-2 rounded hover:bg-gray-200 transition-colors"
                    title="Clear Formatting"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              )}
              <EditorContent editor={editor} className="min-h-[300px]" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use the toolbar to format text: <strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, Headings (H1-H6), Lists, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Publish Status
                  </label>
                  <p className="text-xs text-gray-500">
                    {formData.published ? 'Published and visible' : 'Draft (not visible)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePublishToggle}
                  disabled={loading}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    formData.published ? 'bg-green-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      formData.published ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {post?.publishedAt && formData.published && (
                <p className="text-xs text-gray-500 mt-2">
                  Published: {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {post ? (
                <span>Last updated: {new Date(post.updatedAt).toLocaleString()}</span>
              ) : (
                <span>New post will be saved as draft</span>
              )}
            </div>
            <div className="flex items-center gap-3">
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
                {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
