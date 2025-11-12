export type Subject = 
  | 'Bahasa Indonesia'
  | 'Bahasa Inggris'
  | 'Bahasa Arab'
  | 'Matematika'
  | 'Fikih'
  | 'SKI (Sejarah Kebudayaan Islam)'
  | 'Al-Qur’an Hadis'
  | 'Akidah Akhlak'
  | 'IPA'
  | 'IPS'
  | 'Informatika'
  | 'PJOK (Penjas)'
  | 'Seni Budaya'
  | 'PKN'
  | 'Bahasa Sunda';

export type QuestionCount = 30 | 40 | 50;

export type Kelas = 7 | 8 | 9;

export type BentukSoal = 'Pilihan Ganda' | 'Benar atau Salah' | 'Pilihan Ganda Kompleks' | 'Menjodohkan' | 'Isian Singkat';


export interface FormState {
  subject: Subject;
  topic: string;
  questionCount: QuestionCount;
  kelas: Kelas;
  bentukSoal: BentukSoal[];
}

export interface IdentitasSoal {
  mataPelajaran: string;
  faseKelas: string;
  topikMateri: string;
  alokasiWaktu: string;
  jumlahSoal: number;
}

export interface KisiKisiItem {
  no: number;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  indikatorSoal: string;
  levelKognitif: string;
  bentukSoal: string;
  tingkatKesulitan: string;
  nomorSoal: string;
}

export interface SoalUjianItem {
  nomor: number;
  bentukSoal: string;
  soal: string;
  pilihan?: string[]; // For PG, PGK
  pernyataan?: string; // For BS
  pasangan?: { A: string; B: string }[]; // For Menjodohkan
  kunciJawaban: string | string[]; // string for most, string[] for PGK
  pembahasan: string;
}

export interface KunciJawabanTabelItem {
    no: number;
    bentukSoal: string;
    jawabanBenar: string | string[];
    pembahasanSingkat: string;
}

export interface GeneratedContent {
  identitasSoal: IdentitasSoal;
  tujuanPembelajaran: string[];
  kisiKisi: KisiKisiItem[];
  soalUjian: SoalUjianItem[];
  kunciJawabanTabel?: KunciJawabanTabelItem[];
}