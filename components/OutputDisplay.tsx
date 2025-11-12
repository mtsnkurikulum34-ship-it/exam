
import React from 'react';
import type { GeneratedContent, KisiKisiItem, SoalUjianItem, KunciJawabanTabelItem } from '../types';
import { CopyButton } from './CopyButton';

interface OutputDisplayProps {
  content: GeneratedContent;
}

const generateCopyableText = (content: GeneratedContent): string => {
  let text = '';

  // 1. Identitas Soal
  text += 'BAGIAN 1: IDENTITAS SOAL\n';
  text += '=========================\n';
  text += `Nama Mata Pelajaran: ${content.identitasSoal.mataPelajaran}\n`;
  text += `Fase/Kelas: ${content.identitasSoal.faseKelas}\n`;
  text += `Topik/Materi: ${content.identitasSoal.topikMateri}\n`;
  text += `Alokasi Waktu: ${content.identitasSoal.alokasiWaktu}\n`;
  text += `Jumlah Soal: ${content.identitasSoal.jumlahSoal} butir\n\n`;

  // 2. Tujuan Pembelajaran
  text += 'BAGIAN 2: TUJUAN PEMBELAJARAN\n';
  text += '==============================\n';
  content.tujuanPembelajaran.forEach((tujuan, index) => {
    text += `${index + 1}. ${tujuan}\n`;
  });
  text += '\n';

  // 3. Kisi-Kisi Soal
  text += 'BAGIAN 3: KISI-KISI SOAL\n';
  text += '========================\n';
  const kisiHeaders = ['No', 'Capaian Pembelajaran', 'Tujuan Pembelajaran', 'Indikator Soal', 'Level Kognitif', 'Bentuk Soal', 'Tingkat Kesulitan', 'Nomor Soal'];
  text += kisiHeaders.join('\t') + '\n';
  content.kisiKisi.forEach(item => {
    const row = [item.no, item.capaianPembelajaran, item.tujuanPembelajaran, item.indikatorSoal, item.levelKognitif, item.bentukSoal, item.tingkatKesulitan, item.nomorSoal];
    text += row.join('\t') + '\n';
  });
  text += '\n';

  // 4. Soal Ujian
  text += 'BAGIAN 4: SOAL UJIAN\n';
  text += '======================\n';
  content.soalUjian.forEach(soal => {
    text += `\n${soal.nomor}. (${soal.bentukSoal})\n`;
    text += `${soal.soal}\n`;
    if (soal.pilihan) {
      soal.pilihan.forEach(p => text += `${p}\n`);
    }
    text += `\nKunci Jawaban: ${Array.isArray(soal.kunciJawaban) ? soal.kunciJawaban.join(', ') : soal.kunciJawaban}\n`;
    text += `Pembahasan: ${soal.pembahasan}\n`;
  });
  text += '\n';

  // 5. Kunci Jawaban Tabel (if exists)
  if (content.kunciJawabanTabel) {
    text += 'BAGIAN 5: KUNCI JAWABAN DAN PEMBAHASAN\n';
    text += '========================================\n';
    const kunciHeaders = ['No', 'Bentuk Soal', 'Jawaban Benar', 'Pembahasan Singkat'];
    text += kunciHeaders.join('\t') + '\n';
    content.kunciJawabanTabel.forEach(item => {
        const jawaban = Array.isArray(item.jawabanBenar) ? item.jawabanBenar.join(', ') : item.jawabanBenar;
        const row = [item.no, item.bentukSoal, jawaban, item.pembahasanSingkat];
        text += row.join('\t') + '\n';
    });
  }

  return text;
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content }) => {
  const fullText = generateCopyableText(content);

  const renderSoal = (soal: SoalUjianItem) => {
    const { bentukSoal, soal: soalText, pilihan, kunciJawaban, pembahasan } = soal;
    return (
      <div key={soal.nomor} className="py-4 border-b border-slate-200 last:border-b-0">
        <p className="font-semibold text-slate-800">
          {soal.nomor}. ({bentukSoal})
        </p>
        <p className="mt-2 whitespace-pre-wrap">{soalText}</p>
        {pilihan && (
          <div className="mt-2 space-y-1">
            {pilihan.map((opt, i) => (
              <p key={i} className="text-slate-700">{opt}</p>
            ))}
          </div>
        )}
        <div className="mt-3 text-sm bg-indigo-50 p-3 rounded-md border border-indigo-200">
          <p><span className="font-semibold">Kunci Jawaban:</span> {Array.isArray(kunciJawaban) ? kunciJawaban.join(', ') : kunciJawaban}</p>
          <p className="mt-1"><span className="font-semibold">Pembahasan:</span> {pembahasan}</p>
        </div>
      </div>
    );
  };
  
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-indigo-500 pb-2 mb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="prose prose-slate max-w-none">
        <div className="flex justify-end mb-4">
             <CopyButton textToCopy={fullText} />
        </div>
      <Section title="Bagian 1: Identitas Soal">
        <ul className="list-disc list-inside space-y-1">
            <li><strong>Nama Mata Pelajaran:</strong> {content.identitasSoal.mataPelajaran}</li>
            <li><strong>Fase/Kelas:</strong> {content.identitasSoal.faseKelas}</li>
            <li><strong>Topik/Materi:</strong> {content.identitasSoal.topikMateri}</li>
            <li><strong>Alokasi Waktu:</strong> {content.identitasSoal.alokasiWaktu}</li>
            <li><strong>Jumlah Soal:</strong> {content.identitasSoal.jumlahSoal} butir</li>
        </ul>
      </Section>

      <Section title="Bagian 2: Tujuan Pembelajaran">
        <ul className="list-decimal list-inside space-y-1">
          {content.tujuanPembelajaran.map((tujuan, index) => (
            <li key={index}>{tujuan}</li>
          ))}
        </ul>
      </Section>
      
      <Section title="Bagian 3: Kisi-Kisi Soal">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="p-2">No</th>
                        <th className="p-2">Capaian Pembelajaran</th>
                        <th className="p-2">Indikator Soal</th>
                        <th className="p-2">Level Kognitif</th>
                        <th className="p-2">Bentuk Soal</th>
                        <th className="p-2">Nomor Soal</th>
                    </tr>
                </thead>
                <tbody>
                    {content.kisiKisi.map((item: KisiKisiItem) => (
                        <tr key={item.no} className="border-b">
                            <td className="p-2">{item.no}</td>
                            <td className="p-2">{item.capaianPembelajaran}</td>
                            <td className="p-2">{item.indikatorSoal}</td>
                            <td className="p-2">{item.levelKognitif}</td>
                            <td className="p-2">{item.bentukSoal}</td>
                            <td className="p-2">{item.nomorSoal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Section>
      
      <Section title="Bagian 4: Soal Ujian">
        <div>
          {content.soalUjian.map(renderSoal)}
        </div>
      </Section>
      
      {content.kunciJawabanTabel && (
        <Section title="Bagian 5: Kunci Jawaban dan Pembahasan">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-2">No</th>
                            <th className="p-2">Bentuk Soal</th>
                            <th className="p-2">Jawaban Benar</th>
                            <th className="p-2">Pembahasan Singkat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.kunciJawabanTabel.map((item: KunciJawabanTabelItem) => (
                            <tr key={item.no} className="border-b">
                                <td className="p-2">{item.no}</td>
                                <td className="p-2">{item.bentukSoal}</td>
                                <td className="p-2">{Array.isArray(item.jawabanBenar) ? item.jawabanBenar.join(', ') : item.jawabanBenar}</td>
                                <td className="p-2">{item.pembahasanSingkat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
      )}
    </div>
  );
};
