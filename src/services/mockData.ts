import { GameIssue, RequestType } from "../types";

export const MOCK_GENERATE_ISSUE_RESPONSE: any = {
  case_id: 1,
  title: "Proyek: Kebocoran Menara Zenith",
  brief: "Pada tanggal 17 Juni 2013, lima pria berpakaian rapi tertangkap basah di markas Aliansi Fajar (Menara Zenith) pukul 02.27 dini hari. Polisi setempat menyebutnya 'pembobolan gedung biasa', namun para pelaku ditemukan di ruang telekomunikasi dengan peralatan spionase militer RF-72.",
  opening_narrative: "SELAMAT DATANG DI PUSAT OPERASI 'REDAKSI' // OPERATOR: DEMO_MODE.\n\nSaya adalah Pemimpin Redaksi Anda. Kota ini sedang di ambang kekacauan, dan insiden Menara Zenith adalah kuncinya. Lima pria tertangkap membobol lantai B2 markas Aliansi Fajar pukul 02.27 dini hari.\n\nMISI ANDA:\nBongkar konspirasi di balik pembobolan ini. Hubungkan titik-titik antara pelaku, dana taktis istana, dan penyadapan ilegal. Kita harus membuktikan bahwa ini bukan sekadar perampokan biasa.\n\nPROTOKOL OPERASI:\n1. Buka [EVIDENCE_STORAGE] melalui taskbar (Ikon Dokumen) untuk mengakses basis data bukti kita.\n2. Analisis setiap bukti. Perhatikan nomor seri uang dan log telepon.\n3. Gunakan [PUBLICATION_TERMINAL] untuk menyusun narasi artikel Anda.\n4. Pantau [LIVE_PULSE] untuk melihat gelombang opini publik.",
  first_article_prompt: "MISI 01: Publikasikan artikel pertama tentang kejanggalan pembobolan Menara Zenith. Tekankan pada penggunaan peralatan spionase militer RF-72.",
  initial_world_state: {
    public_tension: 40,
    media_trust: 65,
    political_pressure: 50,
    misinformation_spread: 20,
    institutional_trust: 55,
    public_sentiment_toward_subject: 30
  },
  active_chain_reactions: [],
  evidence_files: [
    {
      id: "EVD_001",
      category: "Keterangan Saksi & TKP",
      title: "POLICE_REPORT_0617.txt",
      content: "LAPORAN KEPOLISIAN: Lima pria (James McCord dkk) ditangkap di Menara Zenith B2. Ditemukan penyadap RF-72 dan uang tunai $5.300 dengan nomor seri berurutan.",
      source: "Arsip Kepolisian",
      reliability: "TINGGI",
      truth_contribution: 10,
      asset: "/POLICE_REPORT_0617.txt"
    },
    {
      id: "EVD_002",
      category: "Keuangan & Perbankan",
      title: "CRP_LEDGER_CONFIDENTIAL.decrypt",
      content: "DECRYPTED LEDGER: Menunjukkan aliran dana $25.000 dengan kode OPS-ZNT dari rekening cangkang Xylos yang diotorisasi oleh 'W.H.'",
      source: "Audit Forensik Siber",
      reliability: "TINGGI",
      truth_contribution: 20,
      asset: "/CRP_LEDGER_CONFIDENTIAL.decrypt"
    },
    {
      id: "EVD_003",
      category: "Log Komunikasi",
      title: "WHITEHOUSE_TELECOM_LOG.txt",
      content: "LOG TELEPON: Terdeteksi panggilan antara Gedung Putih (R.J. Hartono) dan Hotel Zenith Kamar 214 sebelum kejadian.",
      source: "Informan Anonim",
      reliability: "SEDANG",
      truth_contribution: 15,
      asset: "/WHITEHOUSE_TELECOM_LOG.txt"
    },
    {
      id: "EVD_004",
      category: "Log Fasilitas",
      title: "HOTEL_LOG_JUNE.xlsx",
      content: "RESEPSIONIS HOTEL ZENITH: Kamar 214 disewa oleh Edy H. Kusuma dan Gery G. Lanjuti. Terlihat keluar membawa tas laptop pukul 23.00.",
      source: "Investigasi Lapangan",
      reliability: "TINGGI",
      truth_contribution: 10,
      asset: "/HOTEL_LOG_JUNE.xlsx"
    },
    {
      id: "EVD_005",
      category: "Catatan & Dokumen",
      title: "NOTEBOOK_EXHIBIT_C.png",
      content: "CATATAN MCCORD: Nama 'Haldeman' dan nomor ekstensi 7741-B ditemukan di buku catatan pelaku.",
      source: "Penyitaan Forensik",
      reliability: "VERIFIED",
      truth_contribution: 15,
      asset: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "EVD_006",
      category: "Intersepsi & Sadapan",
      title: "WIRE_AUDIO_0616.txt",
      content: "TRANSKRIP SADAPAN: Percakapan antara Liddy dan Hunt tentang pemasangan alat di lantai B2 dan dana untuk McCord.",
      source: "Intelijen Sinyal",
      reliability: "TINGGI",
      truth_contribution: 15,
      asset: "/WIRE_AUDIO_0616.txt"
    },
    {
      id: "EVD_007",
      category: "Intervensi Hukum",
      title: "INTEROFFICE_MEMO_CIA.png",
      content: "MEMO CIA: Instruksi dari Kepala Staf Istana (W.H.) untuk menghentikan pelacakan FBI terhadap rekening Xylos.",
      source: "Kebocoran Dokumen Internal",
      reliability: "TINGGI",
      truth_contribution: 15,
      asset: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "EVD_008",
      category: "Audio & Intersepsi",
      title: "TAPES_OVAL_OFFICE_0623.txt",
      content: "OVAL OFFICE TAPES: Rekaman Presiden mendiskusikan penggunaan uang Xylos untuk membungkam para pembobol.",
      source: "Arsip Rahasia Negara",
      reliability: "VERIFIED",
      truth_contribution: 20,
      asset: "/TAPES_OVAL_OFFICE_0623.txt"
    },
    {
      id: "EVD_009",
      category: "Keuangan & Perbankan",
      title: "XYLOS_BANK_TRANS.png",
      content: "LOG BANK XYLOS: Transfer $25.000 dari 'GdgAbu-7' dan penarikan tunai yang nomor serinya cocok dengan uang di TKP.",
      source: "Otoritas Jasa Keuangan",
      reliability: "TINGGI",
      truth_contribution: 15,
      asset: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

export const MOCK_EVALUATION_RESPONSE: any = {
  evaluation: {
    verdict: "ARTIKEL DITERBITKAN",
    verdict_reason: "Artikel Anda memicu diskusi publik yang signifikan.",
    truth_exposure_delta: 15,
    accuracy_score: 85,
    public_impact: 20
  },
  world_state_update: {
    public_tension: 55,
    media_freedom: 60,
    political_stability: 45,
    government_trust: 50,
    last_update_log: "Public tension rising after your article."
  },
  social_media: {
    platforms: {
      nusantaraX: {
        platform_name: "NusantaraX",
        comments: [
          { username: "RakyatKritis", content: "Penyadapan di Menara Zenith? Ini gila!", sentiment: "NEGATIVE", likes: 120, avatar_initial: "R", avatar_color: "#ff4444" }
        ]
      }
    }
  },
  next_article_brief: {
    info: "Bagus. Sekarang selidiki hubungan Haldeman dengan James McCord.",
    new_evidence_unlocked: []
  }
};
