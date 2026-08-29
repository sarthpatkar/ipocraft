import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/drhp-vs-rhp-difference");
const enUrl = canonicalUrl("/drhp-vs-rhp-difference");
const mrUrl = canonicalUrl("/mr/drhp-vs-rhp-difference");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "DRHP बनाम RHP: फुल फॉर्म, मतलब और अंतर | IPOCraft",
  description:
    "DRHP का फुल फॉर्म Draft Red Herring Prospectus है, RHP का फुल फॉर्म Red Herring Prospectus है। दोनों में क्या अंतर है, हर एक में क्या होता है — हिंदी में समझें।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function DrhpVsRhpHindiPage() {
  return (
    <div
      lang="hi"
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-sm uppercase text-blue-600 font-semibold mb-4">IPO लर्निंग गाइड</p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          DRHP बनाम RHP: फुल फॉर्म, मतलब और अंतर ({CURRENT_YEAR} गाइड)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <strong>DRHP का फुल फॉर्म</strong> है Draft Red Herring Prospectus, और{" "}
          <strong>RHP का फुल फॉर्म</strong> है Red Herring Prospectus। दोनों ही IPO ऑफ़र
          डॉक्यूमेंट हैं जो SEBI और स्टॉक एक्सचेंज में दाख़िल होते हैं, लेकिन अलग-अलग स्टेज पर —
          और एक बड़ा फ़र्क़ यह है कि सिर्फ़ RHP में फ़ाइनल प्राइस बैंड होता है।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/mr/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">मराठी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="drhp" title="DRHP क्या है?">
            <p>
              Draft Red Herring Prospectus (DRHP) वह पहला ऑफ़र डॉक्यूमेंट है जिसे कंपनी IPO की
              योजना बनाते समय SEBI में दाख़िल करती है। इसमें कंपनी का बिज़नेस, फाइनेंशियल्स, रिस्क
              फैक्टर, प्रमोटर और इश्यू का मक़सद बताया जाता है — लेकिन इसमें फ़ाइनल प्राइस बैंड या
              ऑफ़र किए जा रहे शेयरों की सटीक संख्या नहीं होती। कंपनी के आगे बढ़ने से पहले SEBI और
              जनता को दाख़िल DRHP पर टिप्पणी करने के लिए लगभग 21 दिन मिलते हैं।
            </p>
          </Section>

          <Section id="rhp" title="RHP क्या है?">
            <p>
              Red Herring Prospectus (RHP) IPO के बिडिंग के लिए खुलने से ठीक पहले दाख़िल किया जाता
              है। यह DRHP का अपडेटेड, लगभग फ़ाइनल वर्ज़न है, जिसमें अब प्राइस बैंड, लॉट साइज़,
              इश्यू साइज़ और SEBI की टिप्पणियों के जवाब में किए गए बदलाव शामिल होते हैं।
            </p>
          </Section>

          <Section title="DRHP बनाम RHP: मुख्य फ़र्क़">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#e2e8f0] dark:border-[#252A31] rounded-lg overflow-hidden">
                <thead className="bg-[#f1f5f9] dark:bg-[#171B20] text-left">
                  <tr>
                    <th className="p-3 font-semibold">पहलू</th>
                    <th className="p-3 font-semibold">DRHP</th>
                    <th className="p-3 font-semibold">RHP</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-[#e2e8f0] dark:[&>tr]:border-[#252A31]">
                  <tr><td className="p-3">कब दाख़िल होता है</td><td className="p-3">IPO रोडशो से पहले, SEBI और जनता की समीक्षा के लिए</td><td className="p-3">IPO बिडिंग के लिए खुलने से ठीक पहले</td></tr>
                  <tr><td className="p-3">प्राइस बैंड</td><td className="p-3">शामिल नहीं</td><td className="p-3">शामिल</td></tr>
                  <tr><td className="p-3">इश्यू साइज़ / लॉट साइज़</td><td className="p-3">सिर्फ़ संकेतात्मक</td><td className="p-3">फ़ाइनल</td></tr>
                  <tr><td className="p-3">मक़सद</td><td className="p-3">रेगुलेटरी और सार्वजनिक टिप्पणी</td><td className="p-3">निवेशक बिडिंग संदर्भ</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="निवेशकों के लिए यह क्यों मायने रखता है">
            <p>
              आवेदन करने से पहले सिर्फ़ DRHP नहीं बल्कि RHP पढ़ना ज़रूरी है, क्योंकि यही एकमात्र
              डॉक्यूमेंट है जिसमें वह असल क़ीमत होती है जो आप चुकाएँगे। IPOCraft का{" "}
              <Link href="/drhp-analyzer" className="text-[#1C317A] dark:text-blue-400 underline">
                DRHP Analyzer
              </Link>{" "}
              इन ऑफ़र डॉक्यूमेंट्स की मुख्य बातें और रिस्क फैक्टर का सार निकालकर देता है, ताकि
              आपको सैकड़ों पन्ने ख़ुद न पढ़ने पड़ें।
            </p>
          </Section>

          <Section id="faqs" title="अक्सर पूछे जाने वाले सवाल">
            <h3 className="font-semibold mt-4">DRHP और RHP का फुल फॉर्म क्या है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">DRHP का मतलब है Draft Red Herring Prospectus। RHP का मतलब है Red Herring Prospectus।</p>
            <h3 className="font-semibold mt-4">क्या DRHP में IPO की क़ीमत होती है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">नहीं। प्राइस बैंड सिर्फ़ RHP में फ़ाइनल होकर आता है, जो IPO खुलने की तारीख़ के नज़दीक दाख़िल होता है।</p>
            <h3 className="font-semibold mt-4">क्या RHP दाख़िल होने से पहले DRHP की जानकारी बदल सकती है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">हाँ। SEBI की टिप्पणियाँ, बाज़ार की स्थितियाँ या अपडेटेड फाइनेंशियल्स — ये सब DRHP और फ़ाइनल RHP के बीच बदलाव ला सकते हैं।</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO लर्निंग रिसोर्स">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP क्या है</Link></li>
              <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
              <li><Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB बनाम HNI बनाम Retail</Link></li>
              <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट कैसे होता है</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवल जानकारी देने के उद्देश्य से यह कंटेंट प्रदान करता है और SEBI के पास
          रजिस्टर्ड नहीं है। हमेशा आधिकारिक DRHP/RHP दस्तावेज़ SEBI, BSE या NSE की वेबसाइट पर देखें।
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "DRHP बनाम RHP: फुल फॉर्म, मतलब और अंतर",
            description: "DRHP (Draft Red Herring Prospectus) और RHP (Red Herring Prospectus) में फ़र्क़, हर एक में क्या होता है, और कब दाख़िल होते हैं।",
            author: { "@type": "Organization", name: "IPOCraft Research Team" },
            publisher: { "@type": "Organization", name: "IPOCraft", logo: { "@type": "ImageObject", url: "https://ipocraft.com/logo2.png" } },
            datePublished: `${CURRENT_YEAR}-01-01`,
            dateModified: new Date().toISOString(),
            mainEntityOfPage: { "@type": "WebPage", "@id": hiUrl },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "DRHP और RHP का फुल फॉर्म क्या है?", acceptedAnswer: { "@type": "Answer", text: "DRHP का मतलब Draft Red Herring Prospectus है। RHP का मतलब Red Herring Prospectus है।" } },
              { "@type": "Question", name: "क्या DRHP में IPO की क़ीमत होती है?", acceptedAnswer: { "@type": "Answer", text: "नहीं, प्राइस बैंड सिर्फ़ RHP में फ़ाइनल होकर आता है, जो IPO खुलने की तारीख़ के नज़दीक दाख़िल होता है।" } },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-40 sm:scroll-mt-44">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
