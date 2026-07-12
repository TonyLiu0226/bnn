'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [editedText, setEditedText] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrompt, setEditedPrompt] = useState('')
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setArticle(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to trigger generation');
      }

      toast.success('News article generated successfully!');
      setArticle(data.data);
      setEditedText(data.data?.output?.text || '');
      setEditedTitle(data.data?.output?.title || '');
      setPrompt('');
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedText.trim()) return;

    setIsSaving(true);

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editedText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article');
      }

      toast.success('Article saved successfully!');
      setArticle(null);
      setEditedText('');
      setEditedTitle('');
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editedPrompt.trim()) return;

    setIsEditing(true);

    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: editedText, prompt: editedPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to edit article');
      }

      toast.success('Article edited with AI successfully!');

      setEditedText(data.data?.output?.text || '');
      setEditedTitle(data.data?.output?.title || '');
      setEditedPrompt('');
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsEditing(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-white tracking-wide">BNN Admin</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {!article ? (<div className="rounded-lg bg-gray-800 p-8 shadow-xl border border-gray-700">
              <h1 className="text-2xl font-semibold text-white mb-6">Generate News Article</h1>
              <p className="text-gray-400 mb-8">
                Enter a prompt below to generate a new article using AI.
              </p>
              <form onSubmit={handleGenerate}>
                <div className="mb-4">
                  <label htmlFor="prompt" className="sr-only">
                    Article Prompt
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="block w-full rounded-md border-0 bg-gray-700 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-lg sm:leading-6"
                    placeholder="E.g., Write a breaking news report about a new scientific discovery on Mars..."
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="inline-flex justify-center rounded-md bg-indigo-600 py-3 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Article'
                    )}
                  </button>
                </div>
              </form>
            </div>) : (
              <div className="mt-10 border-t border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-white mb-4">Generated Result:</h2>
                <p className="text-gray-400 mb-8">
                  Your article has been generated successfully. Please make any edits below before saving.
                </p>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <form onSubmit={handleSave}>
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                        Article Title
                      </label>
                      <textarea
                        id="title"
                        name="title"
                        rows={1}
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-lg sm:leading-6"
                        required
                      />
                      <label htmlFor="text" className="block text-sm font-medium text-gray-200 mb-2">
                        Article Text
                      </label>
                      <textarea
                        id="text"
                        name="text"
                        rows={10}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-lg sm:leading-6"
                        required
                      />
                      <label htmlFor="prompt" className="block text-sm font-medium text-gray-200 mb-2">
                        Alternatively, use AI to help with edits
                      </label>
                      <textarea
                        id="prompt"
                        name="prompt"
                        rows={6}
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-lg sm:leading-6"
                      />
                      <button onClick={handleEdit} disabled={isEditing || isSaving || !editedPrompt.trim()} className="inline-flex justify-center rounded-md bg-indigo-600 py-3 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors duration-200">
                        {isEditing ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Please wait...
                          </span>
                        ) : (
                          'Edit Article'
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving || isEditing}
                        className="inline-flex justify-center rounded-md bg-indigo-600 py-3 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors duration-200"
                      >
                        {isSaving ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Please wait...
                          </span>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
