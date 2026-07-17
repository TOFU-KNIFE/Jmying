# Localisation guide

## Purpose before wording

This website is a professional profile for Jeremy (Lei) Ying, an Accounting (FinTech) student in Malaysia seeking an Audit & Assurance internship for February–April 2027. Its primary readers are recruiters, hiring teams and professional contacts.

Every translation should therefore help a native-language reader understand the same professional evidence quickly. It should sound calm, precise and modest rather than promotional, literary or machine-translated. Translate the intended function of a sentence, not its English word order.

## Facts and names that must remain stable

- Keep the name `Jeremy (Lei) Ying`, the February–April 2027 availability window and all verified education and experience facts unchanged.
- Keep official product, organisation and programme names such as LinkedIn, Excel, Oracle, ERP, American Heart Association and competition titles unless the organisation publishes an established local form.
- Keep `Bachelor of Accounting (FinTech) (Honours)` recognisable as the official degree. A natural local explanation may accompany it, but must not imply a different qualification.
- Keep outcome levels accurate: Top 10, semi-final, quarter-final and `Excellent Case Group` are not to be promoted to winners or awards.
- Preserve cautious capability language such as “exposure”, “supported” and “practised”. Do not turn it into claims of mastery, leadership or independent responsibility.

## Shared editorial rules

1. Start from the verified English meaning and the section's purpose in the reader journey.
2. Use the standard professional term in the target language for accounting, audit, assurance, taxation and financial reporting. Retain an English term only when it is the locally recognised industry form.
3. Prefer short main clauses, active constructions and familiar vocabulary. Avoid slogans that become vague when translated.
4. Follow the target language's punctuation, spacing, capitalisation, script and formality conventions.
5. Keep headings concise, but do not omit facts from descriptions merely to match the English line length.
6. Read the result as a native-language professional profile, then compare it back to the English source for factual equivalence.
7. Check the rendered interface at mobile and desktop widths. Translation quality includes wrapping, reading order, control labels and screen-reader language metadata.

## Language decisions and references

These references guide clarity and native written usage; they are not sources of profile content and their prose is not copied.

| Locale    | Editorial decision                                                                                                                                                             | Reference                                                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zh-Hans` | Use neutral simplified Chinese professional vocabulary and simplified punctuation. Display the language as `简体中文 / Chinese (Simplified)`, never as a geographic region.    | [Chinese Wikipedia](https://zh.wikipedia.org/wiki/中文维基百科), [Chinese punctuation](https://zh.wikipedia.org/wiki/标点符号)                                                                                                                                                                                              |
| `zh-Hant` | Use traditional characters and Taiwan-appropriate professional wording where it improves fluency. Display the language as `繁體中文 / Chinese (Traditional)`.                  | [Chinese Wikipedia](https://zh.wikipedia.org/wiki/中文维基百科), [Chinese punctuation](https://zh.wikipedia.org/wiki/標點符號)                                                                                                                                                                                              |
| `ms`      | Use standard Malaysian Malay, including `perakaunan`, `latihan industri` and `jaminan`; avoid Indonesian forms and unnecessary English.                                        | [Wikipedia Bahasa Melayu writing guidance](https://ms.wikipedia.org/wiki/Wikipedia:Garis_panduan_penulisan_yang_lebih_baik)                                                                                                                                                                                                 |
| `id`      | Use formal, effective Indonesian and Indonesian professional terms such as `akuntansi`, `magang` and `asurans`; avoid Malaysian forms.                                         | [Wikipedia Bahasa Indonesia writing guidance](https://id.wikipedia.org/wiki/Wikipedia:Menulis_artikel_yang_lebih_baik)                                                                                                                                                                                                      |
| `th`      | Use natural formal Thai for the narrative and established Thai audit terminology; retain proper names and tool names in Latin script where expected.                           | [Thai Wikipedia writing guidance](https://th.wikipedia.org/wiki/วิกิพีเดีย:แนวทางการเขียนบทความให้ดียิ่งขึ้น)                                                                                                                                                                                                               |
| `vi`      | Use concise Vietnamese professional prose, normal sentence case and established accounting terminology; avoid word-for-word English noun chains.                               | [Vietnamese Wikipedia editing manual](https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn)                                                                                                                                                                                                                           |
| `ja`      | Use natural mixed-script Japanese and polite interface wording. Prefer direct, concrete sentences and avoid unnecessary katakana when an established Japanese term is clearer. | [Japanese notation guide](https://ja.wikipedia.org/wiki/Wikipedia:表記ガイド), [Japanese article guidance](https://ja.wikipedia.org/wiki/Wikipedia:素晴らしい記事を書くには), [Agency for Cultural Affairs: foreign-word notation](https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/gairai/index.html) |
| `ko`      | Use concise formal written Korean, familiar professional vocabulary and straightforward factual statements; avoid essay-like or overly promotional phrasing.                   | [Korean encyclopedic writing guidance](https://ko.wikipedia.org/wiki/도움말:백과사전적_글쓰기)                                                                                                                                                                                                                              |
| `fr`      | Use clear professional French, sentence case and accepted French equivalents such as `apprentissage automatique`; avoid unnecessary English business jargon.                   | [French article-writing guidance](https://fr.wikipedia.org/wiki/Aide:Comment_rédiger_un_bon_article), [French typography](https://fr.wikipedia.org/wiki/Typographie)                                                                                                                                                        |
| `de`      | Prefer short, clear standard-German sentences with the key point in the main clause. Translate general accounting roles while retaining recognised specialist names.           | [German article-writing guidance](https://de.wikipedia.org/wiki/Wikipedia:Wie_schreibe_ich_gute_Artikel)                                                                                                                                                                                                                    |
| `es`      | Use neutral international Spanish, consistent terminology and clear prose. Prefer `auditoría y aseguramiento` to an unexplained English service-line label.                    | [Spanish Manual of Style](https://es.wikipedia.org/wiki/Wikipedia:Manual_de_estilo)                                                                                                                                                                                                                                         |
| `pt-BR`   | Use Brazilian Portuguese vocabulary and syntax, including `estágio`, `contabilidade` and `asseguração`; do not mix European Portuguese forms.                                  | [Portuguese Wikipedia style guide](https://pt.wikipedia.org/wiki/Wikipédia:Livro_de_estilo)                                                                                                                                                                                                                                 |
| `ar`      | Use clear, concise Modern Standard Arabic with a right-to-left reading order. Localise general concepts while keeping recognised proper names and acronyms legible.            | [Arabic Wikipedia style guide](https://ar.wikipedia.org/wiki/ويكيبيديا:دليل_الأسلوب)                                                                                                                                                                                                                                        |

English is the source locale and resilient HTML fallback. It uses plain international professional English and avoids culture-specific idioms.

## Chinese locale identifiers

The bundle IDs remain `zh-CN` and `zh-TW` for backward-compatible URLs and saved preferences. Runtime document language metadata uses the script tags `zh-Hans` and `zh-Hant`, so `Intl.DisplayNames` presents script-based names such as “Chinese (Simplified)” instead of region-based labels. Browser values such as `zh-CN`, `zh-SG`, `zh-TW`, `zh-HK`, `zh-Hans` and `zh-Hant` are still normalised to the appropriate bundle.

## Review loop for future changes

1. Write or amend the English source with the underlying fact and reader purpose made explicit.
2. Mark protected names, dates, result levels and deliberately cautious verbs.
3. Translate by locale, applying the table above rather than reusing one language's sentence structure for another.
4. Back-compare every locale to the English source for omissions, additions and inflated claims.
5. Run `npm run format` and `npm test`; the internationalisation audit checks keys, BCP 47 tags and manifest metadata.
6. Inspect a long-text Latin locale, a complex-script locale and Arabic at desktop and mobile widths before release.
7. When a phrase has more than one equally accurate local style, record the chosen wording here so later updates remain consistent.
