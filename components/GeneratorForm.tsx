import React from 'react';
import type { FormState, BentukSoal } from '../types';
import { MATA_PELAJARAN, JUMLAH_SOAL_OPTIONS, KELAS_OPTIONS, BENTUK_SOAL_OPTIONS } from '../constants';
import { SparklesIcon } from './Icons';

interface GeneratorFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ formState, setFormState, onSubmit, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: (name === 'questionCount' || name === 'kelas') ? parseInt(value, 10) : value,
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const selectedBentuk = value as BentukSoal;

    setFormState(prevState => {
      const currentBentukSoal = prevState.bentukSoal;
      if (checked) {
        // Add the value if it's not already there
        return {
          ...prevState,
          bentukSoal: [...currentBentukSoal, selectedBentuk],
        };
      } else {
        // Remove the value
        return {
          ...prevState,
          bentukSoal: currentBentukSoal.filter(item => item !== selectedBentuk),
        };
      }
    });
  };


  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Mata Pelajaran
          </label>
          <select
            id="subject"
            name="subject"
            value={formState.subject}
            onChange={handleInputChange}
            className="block w-full rounded-md border-green-200 bg-green-50 px-3 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white sm:text-sm transition-colors duration-150"
            aria-label="Pilih Mata Pelajaran"
          >
            {MATA_PELAJARAN.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="kelas" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Kelas
          </label>
          <select
            id="kelas"
            name="kelas"
            value={formState.kelas}
            onChange={handleInputChange}
            className="block w-full rounded-md border-green-200 bg-green-50 px-3 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white sm:text-sm transition-colors duration-150"
            aria-label="Pilih Kelas"
          >
            {KELAS_OPTIONS.map(kelas => (
              <option key={kelas} value={kelas}>{kelas}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Topik / Materi
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formState.topic}
            onChange={handleInputChange}
            placeholder="e.g., Persamaan Linear"
            className="block w-full rounded-md border-green-200 bg-green-50 px-3 py-2.5 text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white sm:text-sm transition-colors duration-150"
            required
            aria-label="Masukkan Topik atau Materi"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Jumlah Soal
          </label>
          <fieldset className="mt-2">
            <legend className="sr-only">Pilih jumlah soal</legend>
            <div className="flex items-center space-x-4">
              {JUMLAH_SOAL_OPTIONS.map(count => (
                <div key={count} className="flex items-center">
                  <input
                    id={`questionCount-${count}`}
                    name="questionCount"
                    type="radio"
                    value={count}
                    checked={formState.questionCount === count}
                    onChange={handleInputChange}
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`questionCount-${count}`} className="ml-2 block text-sm text-slate-900">
                    {count} butir
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700">
                Bentuk Soal (Pilih minimal satu)
            </label>
            <fieldset className="mt-2">
                <legend className="sr-only">Pilih bentuk soal</legend>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {BENTUK_SOAL_OPTIONS.map(option => (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={`bentukSoal-${option.value}`}
                                name="bentukSoal"
                                type="checkbox"
                                value={option.value}
                                checked={formState.bentukSoal.includes(option.value)}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`bentukSoal-${option.value}`} className="ml-2 block text-sm text-slate-900">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || formState.bentukSoal.length === 0}
          className="w-full flex justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
             <>
                <SparklesIcon className="h-5 w-5"/>
                Generate Exam Package
             </>
          )}
        </button>
      </div>
    </form>
  );
};