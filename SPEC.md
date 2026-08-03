# Spesifikasi Teknis — Indonesian Stemmer & Plugin Lunr (`lunr.id.js`)

| | |
|---|---|
| **Modul** | `lunr.id.js` (sumber), `min/lunr.id.min.js` (hasil build) |
| **Bahasa target** | Bahasa Indonesia (Indonesian) |
| **Ekosistem** | [lunr-languages](https://github.com/mlengse/lunr-languages) — plugin language support untuk Lunr.js |
| **Standar acuan** | Snowball JavaScript Library v0.3 (Oleg Mazko), algoritma stemming Indonesian snowball |
| **Lisensi** | MPL-1.1 |
| **Status** | Produksi (versi paket `1.18.0`) |

Dokumen ini mendeskripsikan perilaku yang **harus** dipenuhi modul `lunr.id`. Semua
ketentuan algoritme di sini diturunkan dari implementasi `lunr.id.js` saat ini dan
merupakan kontrak yang harus dijaga kompatibelnya oleh perubahan apa pun ke depannya.

---

## 1. Tujuan

Plugin `lunr.id` menyediakan empat kemampuan pada index Lunr untuk teks berbahasa
Indonesia:

1. **Trimmer** — membatasi token ke karakter kata (word characters).
2. **Stemmer** — mereduksi kata berimbuhan ke bentuk dasarnya (stem).
3. **Stop-word filter** — membuang kata-kata yang tidak memiliki nilai pencarian.
4. **Registrasi pipeline** — memasang ketiga fungsi di atas ke pipeline index.

Tujuan stemming: kata berimbuhan (prefiks/sufiks/partikel) dan bentuk turunannya harus
diindeks dengan stem yang sama, sehingga pencarian dengan bentuk kata apa pun menemukan
dokumen yang sama.

---

## 2. Ruang Lingkup

Dokumen ini mencakup:

- Algoritma stemming Indonesian (pengukuran, penghapusan partikel/posesif/sufiks/prefiks).
- Daftar afiks yang dikenali beserta kondisi aplikasinya.
- Stop-word filter.
- API modul dan perilaku integrasi dengan Lunr.
- Matriks kompatibilitas versi Lunr.
- Kriteria penerimaan (acceptance criteria) dan strategi pengujian.

Di luar lingkup:

- Tokenisasi karakter (CJK/Thai) — memakai `tinyseg`/`wordcut` bila diperlukan.
- Stemmer bahasa lain (di modul `lunr.<xx>.js` lain).
- Konfigurasi accent folding (khusus `lunr.es`).

---

## 3. Definisi & Terminologi

| Istilah | Definisi |
|---|---|
| **Stem** | Bentuk dasar kata hasil stemming. Belum tentu berupa kata utuh KBBI (mis. `ajar` dari `pelajar`). |
| **I_measure** | Jumlah gugus vokal (runs of vowels) dari awal kata. Ambang aktivasi stemming adalah `> 2`. |
| **I_prefix** | Kode hasil penghapusan prefiks, digunakan untuk *gating* penghapusan sufiks. Nilai: `1`, `2`, `3`, `4`. |
| **Afiks** | Imbuhan: prefiks (awalan), sufiks (akhiran), partikel, kata ganti posesif. |
| **First-order prefix** | Prefiks orde satu: `di-`, `ke-`, `me-`, `mem-`, `men-`, `meng-`, `meny-`, `pem-`, `pen-`, `peng-`, `peny-`, `ter-`. |
| **Second-order prefix** | Prefiks orde dua: `be-`, `belajar-`, `ber-`, `pe-`, `pelajar-`, `per-`. |
| **Token** | Unit hasil tokenisasi; input dan output fungsi pipeline Lunr. |

---

## 4. Arsitektur & Struktur Modul

```
lunr.id.js
│
├── factory(lunr)                     → dipanggil via AMD / CommonJS / browser global
│   ├── guard: lunr wajib ada
│   ├── guard: lunr.stemmerSupport wajib ada
│   ├── lunr.id()                     → pemasang pipeline (plugin)
│   ├── lunr.id.wordCharacters        → charset trimmer
│   ├── lunr.id.trimmer               → dibangkitkan oleh lunr.trimmerSupport.generateTrimmer
│   ├── lunr.id.stemmer               → IndonesianStemmer (wrapped)
│   │     ├── SnowballProgram base
│   │     ├── daftar Among: a_0..a_4  → partikel, posesif, sufiks, prefiks orde-1, prefiks orde-2
│   │     ├── g_vowel                 → {a, e, i, o, u}
│   │     ├── r_*()                   → sub-rutin aturan
│   │     └── stem()                  → rutin utama
│   └── lunr.id.stopWordFilter        → filter stop-word statis
│
└── registrasi fungsi pipeline:
    ├── 'trimmer-id'
    ├── 'stemmer-id'
    └── 'stopWordFilter-id'
```

Alur load: modul dieksekusi **sebagai fungsi** yang menerima objek `lunr`
(`require('../lunr.id.js')(lunr)` atau `<script>` setelah `lunr.js` dan
`lunr.stemmer.support.js`). Tanpa `lunr` atau `lunr.stemmerSupport`, modul melempar
`Error`.

---

## 5. Spesifikasi Algoritma Stemmer

Stemmer menerapkan varian Algoritma Nazief-Adriani / snowball Indonesian yang
disederhanakan: **tanpa kamus kata dasar** (dictionary-free). Akibatnya hasil bisa
berupa bentuk yang bukan kata sah (mis. `jaran` dari `belajaran`).

### 5.1 Vokal dan Pengukuran (`I_measure`)

- Himpunan vokal: `a, e, i, o, u` (`g_vowel`).
- `I_measure` = jumlah gugus vokal yang berurutan dari posisi awal kata. Setiap kali
  penunjuk berpindah dari non-vokal ke vokal, `I_measure += 1`.
- **Pra-kondisi aktivasi:** jika `I_measure <= 2`, kata **tidak** diproses lebih lanjut
  (stem = kata asli). Contoh: `rumah` (ru-mah → 2) tidak di-stem; `berlari`
  (ber-la-ri → 3) diproses.

### 5.2 Penghapusan Partikel (`r_remove_particle`)

Dihapus dari akhir kata bila cocok dengan salah satu:

| Partikel | I_measure |
|---|---|
| `-kah` | `-1` |
| `-lah` | `-1` |
| `-pun` | `-1` |

Paling lama satu partikel dihapus per pemanggilan (aturannya *once*, bukan loop).

### 5.3 Penghapusan Kata Ganti Posesif (`r_remove_possessive_pronoun`)

Dihapus dari akhir kata bila cocok:

| Sufiks | I_measure |
|---|---|
| `-nya` | `-1` |
| `-ku` | `-1` |
| `-mu` | `-1` |

Diterapkan **setelah** partikel. Tidak dilakukan secara loop.

### 5.4 Penghapusan Sufiks (`r_remove_suffix`)

Dihapus dari akhir kata bila cocok, dengan **kondisi** berikut:

| Sufiks | Kondisi wajib | Kode prefix yang mengizinkan |
|---|---|---|
| `-kan` | `I_prefix != 3` **dan** `I_prefix != 2` (`r_SUFFIX_KAN_OK`) | `0`, `1`, `4` |
| `-an` | `I_prefix != 1` (`r_SUFFIX_AN_OK`) | `0`, `2`, `3`, `4` |
| `-i` | `I_prefix <= 2` **dan** huruf sebelum `-i` bukan `s` (`r_SUFFIX_I_OK`) | `0`, `1`, `2` |

Setiap penghapusan menurunkan `I_measure` sebesar `1`.

> Catatan aturan `-i`: larangan `...si` mencegah kesalahan pada kata seperti `lipsi`
> (i.e. tidak menghapus `-i` bila terbentuk `...si`).

### 5.5 Penghapusan Prefiks Orde Satu (`r_remove_first_order_prefix`)

Dihapus dari awal kata. Urutan prioritas dalam daftar `a_3` (pencocokan terpanjang
menang; `mem` memperluas `me`, `men` memperluas `me`, `meng`/`meny` memperluas `men`,
dst.):

| Prefiks | Kondisi tambahan | Aksi | `I_prefix` | `I_measure` |
|---|---|---|---|---|
| `di` | – | hapus | `1` | `-1` |
| `ke` | – | hapus | `3` | `-1` |
| `me` | – | hapus | `1` | `-1` |
| `mem` | – | hapus; jika karakter berikut vokal → ganti `mem` → `p` | `1` | `-1` |
| `men` | – | hapus | `1` | `-1` |
| `meng` | – | hapus | `1` | `-1` |
| `meny` | karakter berikut **vokal** (`r_VOWEL`) | ganti `meny` → `s` | `1` | `-1` |
| `pem` | – | hapus; jika karakter berikut vokal → ganti `pem` → `p` | `3` | `-1` |
| `pen` | – | hapus | `3` | `-1` |
| `peng` | – | hapus | `3` | `-1` |
| `peny` | karakter berikut **vokal** (`r_VOWEL`) | ganti `peny` → `s` | `3` | `-1` |
| `ter` | – | hapus | `1` | `-1` |

Contoh hasil: `menyanyi` → `sanyi`; `memasak` → `pasak`; `membaca` → `baca`;
`penyebut` → `sebut`; `pembangun` → `bangun`; `terlupa` → `lupa`.

### 5.6 Penghapusan Prefiks Orde Dua (`r_remove_second_order_prefix`)

| Prefiks | Kondisi tambahan | Aksi | `I_prefix` | `I_measure` |
|---|---|---|---|---|
| `be` | karakter setelah `be` **non-vokal**, lalu langsung `er` (`r_KER`; pola `be + C + er`) | hapus | `4` | `-1` |
| `belajar` | – | ganti → `ajar` | `4` | `-1` |
| `ber` | – | hapus | `4` | `-1` |
| `pe` | – | hapus | `2` | `-1` |
| `pelajar` | – | ganti → `ajar` | `4` | `-1` |
| `per` | – | hapus | `2` | `-1` |

Contoh: `berlari` → `lari`; `bekerja` → `kerja` (`be` + `k` + `er`); `belajar` → `ajar`;
`pelajar` → `ajar`; `perbesar` → `besar`.

> Catatan: `belajar`/`pelajar` dicocokkan lebih dulu daripada `be`/`pe` (di daftar
> sebelum `ber`/`per`), sehingga kata berimbuhan belajar/pelajar selalu direduksi ke
> `ajar`, bukan dipenggal `belajar`/`pelajar`-nya.

### 5.7 Urutan Eksekusi `stem()`

```
1.  I_measure = jumlah gugus vokal (loop gopast dari awal kata)
2.  jika I_measure <= 2 → selesai (kata tidak di-stem)
3.  I_prefix = 0
4.  [arah mundur dari akhir kata]
5.  hapus partikel (-kah/-lah/-pun)      # sekali
6.  jika I_measure <= 2 → selesai
7.  hapus posesif (-nya/-ku/-mu)         # sekali
8.  jika I_measure <= 2 → selesai
9.  [arah maju dari awal kata]
10. coba jalur A:
      hapus prefiks orde satu
      jika I_measure > 2 → hapus sufiks
      jika I_measure > 2 → hapus prefiks orde dua
    jika berhasil → selesai
11. jalur B (fallback):
      hapus prefiks orde dua
      jika I_measure > 2 → hapus sufiks
12. selesai; token = buffer saat ini
```

**Perilaku parsial saat gate gagal:** bila alur dihentikan di langkah 6 atau 8 karena
`I_measure <= 2`, kata yang sudah terpotong partikel/posesifnya **tetap dikembalikan**
sebagai hasil (buffer termutasi walau `stem()` mengembalikan `false`). Contoh nyata:
`apakah` → `apa`, `bukunya` → `buku` (lihat 5.8).

### 5.8 Contoh Vektor

| Input | Proses | Output |
|---|---|---|
| `berlari` | hapus `ber` → `lari` | `lari` |
| `pembelajaran` | `pem` diikuti `b` (non-vokal) → hapus → `belajaran`; `-an` (I_prefix=3 ≠ 1) → `belajar`; `belajar` → `ajar` | `ajar` |
| `dibaca` | hapus `di` → `baca` | `baca` |
| `membaca` | `mem` diikuti `b` (non-vokal) → hapus → `baca` | `baca` |
| `menyanyi` | `meny` + vokal → `s` → `sanyi` | `sanyi` |
| `katakanlah` | hapus `-lah` → `katakan`; hapus `-kan` (I_prefix=0) → `kata` | `kata` |
| `apakah` | hapus `-kah` → `apa` (gate `I_measure<=2` berhenti, buffer tetap `apa`) | `apa` |
| `tertulis` | hapus `ter` → `tulis` | `tulis` |

---

## 6. Stop-Word Filter

- `lunr.id.stopWordFilter` dibangkitkan dari daftar statis (758 entri) via
  `lunr.generateStopWordFilter`, terdaftar sebagai `'stopWordFilter-id'`.
- Daftar berisi stop-word standar Bahasa Indonesia: pronomina, partikel, konjungsi,
  kata tanya, adverbia frekuensi, kata kerja/kopula umum (`adalah`, `ada`, `dengan`,
  `yang`, `untuk`, `dari`, `ke`, `di`, `pada`, `bisa`, `tidak`, dst.) serta bentuk
  berimbuhnya (mis. `dibuat`, `diberikan`, `berakhir`, `memberikan`).
- Token yang masuk daftar **dibuang** dari pipeline (tidak diindeks, tidak dicari).
- Daftar dapat diganti/diperluas pengguna dengan menimpa
  `lunr.id.stopWordFilter.stopWords`.

---

## 7. API & Integrasi Lunr

### 7.1 Pemasangan plugin

```js
// Node / CommonJS
const lunr = require('lunr');
require('lunr-languages/lunr.stemmer.support.js')(lunr);
require('lunr-languages/lunr.id.js')(lunr);

const idx = lunr(function () {
  this.use(lunr.id);          // pasang pipeline: trimmer, stopWordFilter, stemmer
  this.field('title', { boost: 10 });
  this.field('body');
});
```

### 7.2 Fungsi yang diekspos pada objek `lunr.id`

| Nama | Tipe | Deskripsi |
|---|---|---|
| `lunr.id()` | `function` | Plugin: reset & pasang pipeline `trimmer → stopWordFilter → stemmer`. Untuk Lunr v2, `stemmer` juga ditambahkan ke `searchPipeline`. |
| `lunr.id.wordCharacters` | `string` (regex class) | Charset karakter kata untuk trimmer. |
| `lunr.id.trimmer` | `function` | Trimmer, terdaftar `'trimmer-id'`. |
| `lunr.id.stemmer` | `function` | Stemmer. Untuk v2 menerima `Token` dan menggunakan `token.update()`; untuk v1 menerima string. Terdaftar `'stemmer-id'`. |
| `lunr.id.stopWordFilter` | `function` | Stop-word filter, terdaftar `'stopWordFilter-id'`. |

### 7.3 Kontrak token

- **Lunr v2+:** `stemmer` menerima objek `Token` dan mengembalikan token baru hasil
  `token.update(fn)`. Berperilaku *token-aware*.
- **Lunr v1:** `stemmer` menerima `string` mentah.
- `stemWord` internal (`st['stemWord']`) menerima `string` → `string`, tersedia untuk
  uji/pemakaian langsung.

### 7.4 Prasyarat

- `lunr` harus dimuat **sebelum** modul (jika tidak → `Error: Lunr is not present...`).
- `lunr.stemmerSupport` harus dimuat sebelum modul (jika tidak →
  `Error: Lunr stemmer support is not present...`).

---

## 8. Kompatibilitas Versi Lunr

Modul diuji lintas versi Lunr berikut (lihat `test/VersionsAndLanguagesTest.js`):

| Versi Lunr | File asset | Catatan |
|---|---|---|
| 0.6.0 | `lunr-0.6.0.min` | Uji dasar pencarian multi-bahasa |
| 0.7.0 | `lunr-0.7.0.min` | idem |
| 1.0.0 | `lunr-1.0.0.min` | idem |
| 2.0.1 | `lunr-2.0.1` | token-aware stemmer + searchPipeline |
| 2.3.5 | `lunr-2.3.5` | idem |
| 2.3.9 | `lunr` (paket) | versi baseline devDependency |

Perbedaan perilaku antar versi yang **harus** dijaga:

1. Search pipeline: pada v2, kueri juga di-stem; pada v1 tidak perlu (pipeline biasa).
2. `Token.update` digunakan pada v2; branch string untuk v1.
3. Wildcard `...*` tersedia pada v2 saja (uji hanya dijalankan untuk v2).

---

## 9. Kriteria Penerimaan (Acceptance Criteria)

Setiap perubahan harus meloloskan `npm test` (mocha, `test/*Test.js`), minimal:

1. `berlari` → dicari sebagai `lari` → **ditemukan** (1 dokumen).
2. `pembelajaran` → dicari sebagai `ajar` → **ditemukan**.
3. `dibaca` → dicari sebagai `baca` → **ditemukan**.
4. Kata yang tidak ada (`inexistent`) → **0 hasil**.
5. Dokumen berbahasa Indonesia tetap ditemukan untuk semua istilah kunci di data uji
   (`test/testdata/id.js`).
6. Numerik & wildcard tetap bekerja bila trimmer bahasa aktif (uji bersama `de`, `ru`).
7. Pemuatan `lunr.id` tidak mengubah index bahasa lain dalam proses yang sama
   (uji `en + ru`, multi-language).

### Matriks data uji (dari `test/testdata/id.js`)

| Kueri | Hasil yang diharapkan | Sumber dokumen |
|---|---|---|
| `lari` | 1 hasil | `berlari` (dok. Olahraga) |
| `ajar` | 1 hasil | `pembelajaran` (dok. Pembagian administratif) |
| `baca` | 1 hasil | `membaca` / `dibaca` (dok. Kata kerja) |
| `inexistent` | 0 hasil | — (kata tidak ada) |

---

## 10. Keterbatasan & Masalah Terbuka

1. **Tanpa kamus kata dasar** — algoritma murni berdasarkan aturan afiks; dapat
   menghasilkan bentuk non-kata (mis. `jaran` dari `belajaran`). Peningkatan akurasi
   memerlukan kamus KBBI/kata dasar sebagai validasi pasca-stem.
2. **Over-stemming** pada kata yang diawali kombinasi afiks tak lazim atau yang
   kebetulan mengandung prefiks (mis. `mem` di `mempelai`).
3. **Gate `I_measure`** bisa menghentikan pemrosesan sufiks/partikel pada kata pendek,
   menghasilkan stem parsial (lihat 5.7).
4. **Stop-word list statis** perlu pemeliharaan; kata baru yang bermakna tidak akan
   otomatis masuk.
5. **Kasus kombinasi afiks ganda** (mis. `ke-an`, `pe-an`, `ber-kan`) tidak ditangani
   eksplisit; perilakunya hasil komposisi urutan 5.7, terkadang tidak ideal
   (mis. `pendidikan`).
6. **Kata serapan/asing** yang mengandung pola afiks berpotensi salah stem.

---

## 11. Referensi

- Implementasi acuan: `lunr.id.js` (modul ini).
- Snowball JavaScript Library v0.3 — Oleg Mazko (basis kode stemmer).
- Lunr.js — pipeline, tokenizer, `generateStopWordFilter`, `trimmerSupport`.
- Data uji: `test/testdata/id.js`, `test/VersionsAndLanguagesTest.js`.
- Paket: `package.json` (skrip `build`, `test`; versi `lunr` devDependency).
