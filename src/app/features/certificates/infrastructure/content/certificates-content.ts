import type { CertificateDto } from './to-certificates';

/**
 * Static certificates content: professional certifications, completed
 * courses and hackathons. PDFs ship with the site in public/certificates;
 * Stepik entries link to the external verification pages.
 */
export const certificatesContent: readonly CertificateDto[] = [
  {
    title: {
      en: 'AL-1702: Astra Linux Special Edition 1.7 Administration',
      ru: 'AL-1702 «Администрирование ОС Astra Linux Special Edition 1.7»',
    },
    issuer: { en: 'Astra Linux (RusBITech-Astra)', ru: 'Astra Linux (РусБИТех-Астра)' },
    category: 'professional',
    issued: { year: 2025, month: 4 },
    artifact: { kind: 'pdf', path: 'certificates/astra-linux-1702.pdf' },
  },
  {
    title: {
      en: 'AL-1703: Astra Linux Special Edition 1.7 Advanced Administration',
      ru: 'AL-1703 «Развёртывание и сопровождение ОС Astra Linux Special Edition 1.7»',
    },
    issuer: { en: 'Astra Linux (RusBITech-Astra)', ru: 'Astra Linux (РусБИТех-Астра)' },
    category: 'professional',
    issued: { year: 2025, month: 4 },
    artifact: { kind: 'pdf', path: 'certificates/astra-linux-1703.pdf' },
  },
  {
    title: { en: 'VESNA 2025 Hackathon — participant', ru: 'Хакатон ВЕСНА 2025 — участник' },
    issuer: {
      en: 'XVI Forum of Software Developers, Rostov-on-Don',
      ru: 'XVI Форум программных разработчиков Ростова-на-Дону',
    },
    category: 'hackathon',
    issued: { year: 2025, month: 4 },
    artifact: { kind: 'pdf', path: 'certificates/hackathon-2025.pdf' },
  },
  {
    title: {
      en: '"Generation Python": Beginner Course',
      ru: '«Поколение Python»: курс для начинающих',
    },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2022, month: 6 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/1560586' },
  },
  {
    title: {
      en: '"Generation Python": Advanced Course',
      ru: '«Поколение Python»: курс для продвинутых',
    },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2023, month: 1 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/1909905' },
  },
  {
    title: {
      en: '"Generation Python": Professional Course',
      ru: '«Поколение Python»: курс для профессионалов',
    },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2023, month: 7 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/2136212' },
  },
  {
    title: {
      en: '"Generation Python": OOP Course',
      ru: '«Поколение Python»: ООП',
    },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2023, month: 8 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/2157118' },
  },
  {
    title: {
      en: 'Indie Python Programming Course',
      ru: 'Инди-курс программирования на Python',
    },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2023, month: 2 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/1932793' },
  },
  {
    title: { en: 'Introduction to Linux', ru: 'Введение в Linux' },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2023, month: 5 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/2074813' },
  },
  {
    title: {
      en: 'Java from Zero to Junior + Interview Preparation',
      ru: 'Java с нуля до Junior + Подготовка к собеседованию',
    },
    issuer: { en: 'Stepik', ru: 'Stepik' },
    category: 'course',
    issued: { year: 2024, month: 2 },
    artifact: { kind: 'link', url: 'https://stepik.org/cert/2360757' },
  },
];
