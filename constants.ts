import type { Subject, QuestionCount, Kelas, BentukSoal } from './types';

export const MATA_PELAJARAN: Subject[] = [
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Bahasa Arab',
  'Matematika',
  'Fikih',
  'SKI (Sejarah Kebudayaan Islam)',
  'Al-Qur’an Hadis',
  'Akidah Akhlak',
  'IPA',
  'IPS',
  'Informatika',
  'PJOK (Penjas)',
  'Seni Budaya',
  'PKN',
  'Bahasa Sunda',
];

export const JUMLAH_SOAL_OPTIONS: QuestionCount[] = [30, 40, 50];

export const KELAS_OPTIONS: Kelas[] = [7, 8, 9];

export const BENTUK_SOAL_OPTIONS: { value: BentukSoal; label: string }[] = [
    { value: 'Pilihan Ganda', label: 'Pilihan Ganda (PG)' },
    { value: 'Benar atau Salah', label: 'Benar / Salah (BS)' },
    { value: 'Pilihan Ganda Kompleks', label: 'Pilihan Ganda Kompleks (PGK)' },
    { value: 'Menjodohkan', label: 'Menjodohkan (MJ)' },
    { value: 'Isian Singkat', label: 'Isian Singkat (IS)' },
];