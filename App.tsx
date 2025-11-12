import React, { useState } from 'react';
import { GeneratorForm } from './components/GeneratorForm';
import { OutputDisplay } from './components/OutputDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BookIcon, SparklesIcon } from './components/Icons';
import { generateExamContent } from './services/geminiService';
import type { FormState, GeneratedContent } from './types';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    subject: 'Bahasa Indonesia',
    topic: 'Teks Eksplanasi',
    questionCount: 40,
    kelas: 7,
    bentukSoal: ['Pilihan Ganda', 'Isian Singkat'],
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const content = await generateExamContent(formState);
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              MTs Exam Generator
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
             <span>Powered by</span>
             <SparklesIcon className="h-5 w-5 text-indigo-500" />
             <span className="font-semibold">Gemini</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80">
            <GeneratorForm
              formState={formState}
              setFormState={setFormState}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {generatedContent && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80">
                 <OutputDisplay content={generatedContent} />
              </div>
            )}
             {!isLoading && !generatedContent && !error && (
                <div className="text-center py-16 px-6 bg-slate-100 rounded-2xl border border-slate-200/80">
                    <BookIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">Ready to Generate Your Exam?</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Fill out the form above to create a complete exam package in seconds.
                    </p>
                </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} MTs Exam Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;