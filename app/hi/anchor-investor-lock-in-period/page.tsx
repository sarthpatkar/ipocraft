import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/anchor-investor-lock-in-period");
const enUrl = canonicalUrl("/anchor-investor-lock-in-period");
const mrUrl = canonicalUrl("/mr/anchor-investor-lock-in-period");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO में एंकर निवेशक लॉक-इन अवधि क्या है? नियम और महत्व | IPOCraft",
  description:
    "एंकर निवेशक लॉक-इन अवधि क्या है, SEBI के 30/90 दिन के नियम, और लॉक-इन ख़त्म होने की तारीख़ शेयर की क़ीमत को क्यों प्रभावित करती है — हिंदी में समझें।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function AnchorLockInHindiPage() {
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
          IPO में एंकर निवेशक लॉक-इन अवधि: नियम और यह क्यों मायने रखता है ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          एंकर निवेशक — बड़े संस्थागत निवेशक जिन्हें IPO खुलने से एक दिन पहले शेयर अलॉट होते हैं
          — SEBI के नियमों के तहत एक तय अवधि तक अपने शेयर बेच नहीं सकते। इस{" "}
          <strong>एंकर निवेशक लॉक-इन अवधि</strong> पर बारीक़ी से नज़र रखी जाती है, क्योंकि इसकी
          समाप्ति से नए लिस्ट हुए स्टॉक में बिकवाली और क़ीमत में उतार-चढ़ाव आ सकता है।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/mr/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">मराठी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="who" title="एंकर निवेशक कौन होते हैं?">
            <p>
              एंकर निवेशक Qualified Institutional Buyers (QIB) होते हैं — म्यूचुअल फंड, बीमा
              कंपनियाँ, विदेशी पोर्टफोलियो निवेशक जैसे बड़े संस्थान — जिन्हें IPO खुलने से एक दिन
              पहले, इश्यूअर द्वारा तय भाव पर, IPO के शेयरों का एक हिस्सा अलॉट किया जाता है।
            </p>
          </Section>

          <Section id="rules" title="SEBI का एंकर लॉक-इन नियम">
            <p>मौजूदा SEBI ICDR नियमों के तहत, एंकर निवेशक के शेयर अलॉटमेंट की तारीख़ से दो हिस्सों में लॉक-इन रहते हैं:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><strong>50% एंकर अलॉटमेंट</strong> — 90 दिन का लॉक-इन</li>
              <li><strong>बाक़ी 50%</strong> — 30 दिन का लॉक-इन</li>
            </ul>
            <p>
              SEBI इन लॉक-इन नियमों को पहले भी बदल चुका है और आगे भी बदल सकता है — हमेशा किसी
              ख़ास IPO के RHP और नवीनतम SEBI सर्कुलर से सटीक ट्रैंच बंटवारा जाँच लें।
            </p>
          </Section>

          <Section title="निवेशकों के लिए लॉक-इन ख़त्म होने की तारीख़ क्यों मायने रखती है">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>अनलॉक तारीख़ पर उपलब्ध फ़्लोट और ट्रेडिंग वॉल्यूम तेज़ी से बढ़ सकता है</li>
              <li>कुछ एंकर निवेशक अनलॉक होते ही तुरंत मुनाफ़ा बुक कर लेते हैं, जिससे भाव पर दबाव बनता है</li>
              <li>दूसरे (ख़ासकर लॉन्ग-ओनली म्यूचुअल फंड) लॉक-इन के बाद भी काफ़ी समय तक बने रह सकते हैं</li>
              <li>SME IPO में लिस्टिंग के बाद कम लिक्विडिटी की वजह से यह असर और साफ़ दिखता है</li>
            </ul>
          </Section>

          <Section id="faqs" title="अक्सर पूछे जाने वाले सवाल">
            <h3 className="font-semibold mt-4">एंकर निवेशक लॉक-इन अवधि कितने दिन की होती है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">मौजूदा SEBI नियमों के तहत, 50% एंकर शेयर 90 दिन के लिए और बाक़ी 50% अलॉटमेंट की तारीख़ से 30 दिन के लिए लॉक-इन रहते हैं।</p>
            <h3 className="font-semibold mt-4">क्या एंकर लॉक-इन ख़त्म होने से हमेशा क़ीमत गिरती है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">हमेशा नहीं — यह इस पर निर्भर करता है कि एंकर निवेशक बेचना चाहते हैं या नहीं। इससे उस तारीख़ को बिकवाली योग्य फ़्लोट ज़रूर बढ़ जाता है, जिससे बिकवाली होने पर क़ीमत पर दबाव बन सकता है।</p>
            <h3 className="font-semibold mt-4">किसी IPO के एंकर अलॉटमेंट की जानकारी कहाँ मिलेगी?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">एंकर निवेशक अलॉटमेंट लिस्ट आमतौर पर IPO खुलने से एक दिन पहले एक्सचेंज (BSE/NSE) से जारी होती है, और कंपनी के RHP व लिस्टिंग खुलासों में भी इसका ज़िक्र होता है।</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO लर्निंग रिसोर्स">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP क्या है</Link></li>
              <li><Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट गाइड</Link></li>
              <li><Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB बनाम HNI बनाम Retail</Link></li>
              <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवल जानकारी देने के उद्देश्य से यह कंटेंट प्रदान करता है और SEBI के पास
          रजिस्टर्ड नहीं है। लॉक-इन नियम SEBI द्वारा समय-समय पर बदले जाते हैं — हमेशा ऑफ़र
          डॉक्यूमेंट से पुष्टि करें।
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO में एंकर निवेशक लॉक-इन अवधि: नियम और यह क्यों मायने रखता है",
            description: "SEBI के एंकर निवेशक लॉक-इन नियम, 30/90 दिन का ट्रैंच बंटवारा, और अनलॉक तारीख़ नए लिस्ट हुए स्टॉक की क़ीमत को क्यों प्रभावित करती है।",
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
              { "@type": "Question", name: "एंकर निवेशक लॉक-इन अवधि कितने दिन की होती है?", acceptedAnswer: { "@type": "Answer", text: "मौजूदा SEBI नियमों के तहत, 50% एंकर शेयर 90 दिन के लिए और बाक़ी 50% अलॉटमेंट की तारीख़ से 30 दिन के लिए लॉक-इन रहते हैं।" } },
              { "@type": "Question", name: "एंकर निवेशक कौन होते हैं?", acceptedAnswer: { "@type": "Answer", text: "एंकर निवेशक बड़े Qualified Institutional Buyers होते हैं जिन्हें IPO खुलने से एक दिन पहले, इश्यूअर द्वारा तय भाव पर शेयर अलॉट किए जाते हैं।" } },
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
