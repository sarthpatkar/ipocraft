import Link from "next/link";
import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/ipo-grey-market-guide");
const enUrl = canonicalUrl("/ipo-grey-market-guide");
const mrUrl = canonicalUrl("/mr/ipo-grey-market-guide");

export const metadata: Metadata = {
  title: "IPO ग्रे मार्केट गाइड - पूरा विवरण (Authority Edition) | IPOCraft",
  description:
    "GMP कैसे बनता है, यह लिस्टिंग परफॉर्मेंस से कैसे जुड़ा है, ऐतिहासिक पैटर्न, SME बनाम मेनबोर्ड अंतर, और संभावना की सही व्याख्या — हिंदी में पूरी गाइड।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function IpoGreyMarketGuideHindiPage() {
  const lastUpdatedISO = "2026-08-27T00:00:00.000Z";
  const lastUpdatedReadable = "27 अगस्त 2026";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "क्या लिस्टिंग गेन का अनुमान लगाने के लिए IPO GMP सटीक है?", acceptedAnswer: { "@type": "Answer", text: "GMP बाज़ार की भावना दर्शाता है लेकिन लिस्टिंग भाव की गारंटी नहीं देता। इसे सब्सक्रिप्शन डेटा, संस्थागत डिमांड और व्यापक बाज़ार स्थितियों के साथ मिलाकर देखना चाहिए।" } },
      { "@type": "Question", name: "SME IPO GMP ज़्यादा अस्थिर क्यों होता है?", acceptedAnswer: { "@type": "Answer", text: "SME IPO में इश्यू साइज़ छोटा और लिक्विडिटी कम होती है, जिससे ग्रे मार्केट में भावना-आधारित उतार-चढ़ाव बढ़ जाता है।" } },
      { "@type": "Question", name: "क्या ज़्यादा GMP का मतलब हमेशा ओवरसब्सक्रिप्शन होता है?", acceptedAnswer: { "@type": "Answer", text: "ज़्यादा GMP अक्सर मज़बूत सब्सक्रिप्शन से मेल खाता है, लेकिन हमेशा नहीं। संस्थागत भागीदारी और बाज़ार का माहौल भी अहम भूमिका निभाते हैं।" } },
      { "@type": "Question", name: "क्या ग्रे मार्केट ट्रेडिंग कानूनी है?", acceptedAnswer: { "@type": "Answer", text: "ग्रे मार्केट गतिविधि आधिकारिक एक्सचेंज सिस्टम से बाहर चलती है और इसे रेगुलेट नहीं किया जाता। निवेशकों को GMP को सिर्फ़ भावना संकेतक की तरह देखना चाहिए।" } },
      { "@type": "Question", name: "निवेशकों को GMP का ज़िम्मेदारी से इस्तेमाल कैसे करना चाहिए?", acceptedAnswer: { "@type": "Answer", text: "GMP को एक संभाव्य भावना संकेत के तौर पर इस्तेमाल करना चाहिए, गारंटीशुदा लिस्टिंग भविष्यवाणी के तौर पर नहीं। इसे सब्सक्रिप्शन ताक़त और रिस्क मैनेजमेंट सिद्धांतों के साथ मिलाकर देखें।" } },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IPO ग्रे मार्केट गाइड - पूरा विवरण",
    dateModified: lastUpdatedISO,
    inLanguage: "hi",
    author: { "@type": "Organization", name: "IPOCraft" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "IPO ग्रे मार्केट गाइड", item: hiUrl },
    ],
  };

  return (
    <div lang="hi" className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            शैक्षणिक रिसर्च गाइड
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
            IPO ग्रे मार्केट गाइड - पूरा विवरण
          </h1>
          <p className="mt-4 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
            IPO ग्रे मार्केट लिस्टिंग से पहले निवेशकों की उम्मीदों को आकार देने में एक ताक़तवर
            मनोवैज्ञानिक भूमिका निभाता है। यह गाइड बताती है कि Grey Market Premium (GMP) कैसे
            बनता है, यह लिस्टिंग परफॉर्मेंस से कैसे जुड़ा है, ऐतिहासिक व्यवहार पैटर्न, SME अंतर,
            और निश्चितता की बजाय संभावना की व्याख्या कैसे करें।
          </p>
          <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
            Also available in{" "}
            <Link href="/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
            and{" "}
            <Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">मराठी</Link>.
          </p>
          <p className="mt-3 text-xs text-gray-500 dark:text-[#6B7280]">आख़िरी बार अपडेट: {lastUpdatedReadable}</p>
        </div>
      </section>

      <div className="sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm flex flex-wrap gap-4">
          <a href="#how-it-works" className="text-blue-600 dark:text-blue-400 hover:underline">यह कैसे काम करता है</a>
          <a href="#case-study" className="text-blue-600 dark:text-blue-400 hover:underline">केस स्टडी</a>
          <a href="#historical" className="text-blue-600 dark:text-blue-400 hover:underline">ऐतिहासिक पैटर्न</a>
          <a href="#correlation" className="text-blue-600 dark:text-blue-400 hover:underline">सहसंबंध तालिका</a>
          <a href="#probability" className="text-blue-600 dark:text-blue-400 hover:underline">प्रोबेबिलिटी लॉजिक</a>
          <a href="#sme" className="text-blue-600 dark:text-blue-400 hover:underline">SME बनाम मेनबोर्ड</a>
          <a href="#gmp-trend" className="text-blue-600 dark:text-blue-400 hover:underline">GMP ट्रेंड उदाहरण</a>
          <a href="#faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQs</a>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <Section id="how-it-works" title="IPO ग्रे मार्केट कैसे काम करता है">
          <p>IPO ग्रे मार्केट किसी कंपनी के स्टॉक एक्सचेंज पर लिस्ट होने से पहले अनौपचारिक रूप से चलता है। भागीदार इश्यू मूल्य पर प्रीमियम (या डिस्काउंट) पर शेयर ट्रेड करने के लिए सहमत होते हैं। यह प्रीमियम लिस्टिंग डिमांड को लेकर सामूहिक उम्मीदों को दर्शाता है।</p>
          <p>GMP सब्सक्रिप्शन मोमेंटम, संस्थागत भागीदारी, एंकर निवेशक भरोसे, सेक्टर के रुझानों और कुल बाज़ार स्थितियों से प्रभावित होता है। एक्सचेंज प्राइसिंग के उलट, ग्रे मार्केट प्राइसिंग सेंटिमेंट-ड्रिवन होती है।</p>
          <p>यह समझना ज़रूरी है कि GMP गारंटीशुदा प्राइसिंग नहीं दर्शाता। यह डिमांड संकेतों के आधार पर अनुमानित संभावना दर्शाता है।</p>
        </Section>

        <Section id="case-study" title="वास्तविक जैसी IPO केस स्टडी">
          <p>मान लीजिए ₹150 पर प्राइस्ड एक IPO है। लिस्टिंग से पहले, GMP धीरे-धीरे ₹20 से बढ़कर ₹55 हो जाता है क्योंकि कुल सब्सक्रिप्शन 100x पार कर जाता है और QIB हिस्सा भारी ओवरसब्सक्राइब हो जाता है। लिस्टिंग के दिन, स्टॉक ₹198 पर खुलता है — GMP से अनुमानित उम्मीद के क़रीब।</p>
          <p>इसके उलट, ₹60 के GMP वाला लेकिन कमज़ोर संस्थागत डिमांड वाला दूसरा IPO सिर्फ़ ₹170 पर लिस्ट होता है। यह दिखाता है कि संस्थागत भागीदारी सहसंबंध की विश्वसनीयता को मज़बूत करती है।</p>
        </Section>

        <Section id="historical" title="ऐतिहासिक GMP बनाम लिस्टिंग व्यवहार">
          <p>ऐतिहासिक रूप से, मज़बूत QIB सब्सक्रिप्शन (अक्सर 20x से ऊपर) वाले IPO में GMP और लिस्टिंग भाव के बीच क़रीबी तालमेल दिखता है। जब सब्सक्रिप्शन Retail-भारी हो लेकिन संस्थागत डिमांड कमज़ोर हो, तो लिस्टिंग भाव तेज़ी से भटक सकता है।</p>
          <p>लिस्टिंग के दिन से पहले बाज़ार की अस्थिरता भी नतीजों को प्रभावित करती है। अचानक इंडेक्स करेक्शन मज़बूत GMP के बावजूद लिस्टिंग गेन घटा सकता है।</p>
        </Section>

        <Section id="correlation" title="GMP बनाम लिस्टिंग सहसंबंध तालिका">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#e2e8f0] dark:border-[#252A31] text-sm">
              <thead className="bg-[#f1f5f9] dark:bg-[#171B20]">
                <tr>
                  <th className="p-3 border">परिदृश्य</th>
                  <th className="p-3 border">GMP ट्रेंड</th>
                  <th className="p-3 border">सब्सक्रिप्शन प्रोफ़ाइल</th>
                  <th className="p-3 border">लिस्टिंग तालमेल</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-3 border">मज़बूत संस्थागत डिमांड</td><td className="p-3 border">बढ़ रहा</td><td className="p-3 border">QIB 20x+</td><td className="p-3 border">उच्च संभावना तालमेल</td></tr>
                <tr><td className="p-3 border">सिर्फ़ Retail-ड्रिवन</td><td className="p-3 border">ऊँचा पर अस्थिर</td><td className="p-3 border">कमज़ोर QIB</td><td className="p-3 border">अनिश्चित</td></tr>
                <tr><td className="p-3 border">मार्केट करेक्शन</td><td className="p-3 border">स्थिर</td><td className="p-3 border">मज़बूत</td><td className="p-3 border">GMP से कमज़ोर प्रदर्शन हो सकता है</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="probability" title="प्रोबेबिलिटी इंटरप्रिटेशन स्ट्रैटेजी">
          <p>GMP को एक तय भविष्यवाणी की बजाय एक संभाव्यता संकेत के रूप में देखा जाना चाहिए। कई दिनों तक बढ़ता GMP ट्रेंड + मज़बूत QIB सब्सक्रिप्शन + स्थिर व्यापक बाज़ार = लिस्टिंग तालमेल की ज़्यादा संभावना।</p>
          <p>लिस्टिंग से पहले गिरता GMP कमज़ोर होते सेंटिमेंट का संकेत हो सकता है। निवेशकों को एक दिन के प्रीमियम मूल्य की बजाय ट्रेंड की दिशा पर ध्यान देना चाहिए।</p>
        </Section>

        <Section id="sme" title="SME बनाम मेनबोर्ड ग्रे मार्केट व्यवहार">
          <p>SME IPO में आमतौर पर इश्यू साइज़ छोटा और निवेशक पूल सीमित होता है। इससे अक्सर GMP में तेज़ उछाल और गिरावट आती है। मेनबोर्ड IPO, व्यापक भागीदारी की वजह से, अपेक्षाकृत ज़्यादा स्मूद सेंटिमेंट दिखाते हैं।</p>
          <p>चूंकि लिस्टिंग के बाद SME की लिक्विडिटी कम होती है, कीमत में उतार-चढ़ाव किसी भी दिशा में GMP की उम्मीदों से ज़्यादा हो सकता है।</p>
        </Section>

        <Section id="gmp-trend" title="GMP ट्रेंड उदाहरण (विज़ुअल इलस्ट्रेशन)">
          <p>नीचे एक सरल चित्रण है कि मज़बूत सब्सक्रिप्शन मोमेंटम के दौरान GMP कैसे ऊपर की ओर ट्रेंड कर सकता है।</p>
          <div className="mt-6 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 400 180" className="w-full max-w-md mx-auto">
              <polyline fill="none" stroke="#1C317A" strokeWidth="3" points="10,150 80,120 150,90 220,70 300,40 380,30" />
              <text x="10" y="165" fontSize="10" fill="#64748b">पहला दिन</text>
              <text x="150" y="165" fontSize="10" fill="#64748b">मिड सब्सक्रिप्शन</text>
              <text x="320" y="165" fontSize="10" fill="#64748b">प्री-लिस्टिंग</text>
            </svg>
          </div>
          <p className="mt-4">कई दिनों तक बढ़ता GMP ट्रेंड अक्सर बढ़ती डिमांड विज़िबिलिटी से मेल खाता है। हालाँकि, अचानक उलटफेर सेंटिमेंट बदलाव का संकेत दे सकता है।</p>
        </Section>

        <Section id="faq" title="अक्सर पूछे जाने वाले सवाल">
          <div className="space-y-4">
            {[
              { q: "क्या लिस्टिंग गेन के अनुमान के लिए IPO GMP भरोसेमंद है?", a: "GMP सेंटिमेंट दर्शाता है लेकिन लिस्टिंग परफॉर्मेंस की गारंटी नहीं देता। इसे सब्सक्रिप्शन ताक़त और बाज़ार स्थितियों के साथ मिलाकर देखना चाहिए।" },
              { q: "SME IPO में GMP में ज़्यादा उतार-चढ़ाव क्यों दिखता है?", a: "SME IPO में लिक्विडिटी कम और इश्यू साइज़ छोटा होता है, जो सेंटिमेंट-ड्रिवन मूवमेंट को बढ़ा देता है।" },
              { q: "क्या निवेशकों को सिर्फ़ GMP पर निर्भर रहना चाहिए?", a: "नहीं। GMP एक संभाव्यता संकेतक है, निश्चितता का संकेत नहीं। संस्थागत सब्सक्रिप्शन और व्यापक बाज़ार स्थिरता अहम हैं।" },
            ].map((item, index) => (
              <details key={index} className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 group">
                <summary className="cursor-pointer font-medium text-[#0f172a] dark:text-[#F1F5F9]">{item.q}</summary>
                <p className="mt-3 text-sm text-[#475569] dark:text-[#9AA1AA] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section title="और पढ़ें">
          <ul className="list-disc pr-6 pl-6 space-y-2 text-sm">
            <li><Link href="/hi/gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO GMP ट्रैकर</Link></li>
            <li><Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO कैलेंडर</Link></li>
            <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO अलॉटमेंट गाइड</Link></li>
            <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO GMP क्या है</Link></li>
            <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
            <li><Link href="/hi/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 hover:underline">कोस्तक रेट क्या है</Link></li>
            <li><Link href="/hi/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 hover:underline">एंकर निवेशक लॉक-इन पीरियड</Link></li>
            <li><Link href="/ipo-profit-calculator" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO लिस्टिंग प्रॉफिट कैलकुलेटर</Link></li>
          </ul>
        </Section>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft एक सूचनात्मक प्लेटफ़ॉर्म है और SEBI के पास रजिस्टर्ड नहीं है। कंटेंट केवल शैक्षणिक उद्देश्य के लिए है और यह निवेश सलाह नहीं है।
        </div>
      </section>
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-40 sm:scroll-mt-44">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
        {title}
      </h2>
      <div className="space-y-4 text-sm sm:text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
