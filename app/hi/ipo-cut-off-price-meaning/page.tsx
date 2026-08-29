import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/ipo-cut-off-price-meaning");
const enUrl = canonicalUrl("/ipo-cut-off-price-meaning");
const mrUrl = canonicalUrl("/mr/ipo-cut-off-price-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO Cut-off Price का मतलब क्या है? कौन इस्तेमाल कर सकता है | IPOCraft",
  description:
    "IPO में cut-off price विकल्प का मतलब, इसे कौन इस्तेमाल कर सकता है, पैसा ब्लॉक होने और रिफंड का तरीक़ा, और निवेशक इसे क्यों चुनते हैं — हिंदी में समझें।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function CutOffPriceHindiPage() {
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
          IPO Cut-off Price का मतलब क्या है? कौन इस्तेमाल कर सकता है ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <strong>Cut-off price</strong> विकल्प किसी निवेशक को प्राइस बैंड के भीतर कोई ख़ास भाव
          चुनने की बजाय, जो भी फ़ाइनल IPO भाव तय हो उस पर बोली लगाने देता है। यह सिर्फ़ Retail
          Individual Investors (RII) के लिए उपलब्ध है और बहुत कम क़ीमत की वजह से बोली रिजेक्ट
          होने से बचने का सबसे आसान तरीक़ा है।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/mr/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">मराठी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="what-is-cutoff" title="Cut-off पर बोली लगाने का क्या मतलब है?">
            <p>
              हर IPO का एक प्राइस बैंड होता है — जैसे ₹100 से ₹110। इस बैंड के भीतर कोई भाव चुनने
              की बजाय, निवेशक Cut-off Price चुन सकता है, जो कि कंपनी द्वारा बुक-बिल्डिंग से तय
              किए गए फ़ाइनल भाव पर ख़रीदने का निर्देश है — भले ही वह बैंड का ऊपरी सिरा, ₹110, ही
              क्यों न हो।
            </p>
          </Section>

          <Section title="Cut-off विकल्प कौन इस्तेमाल कर सकता है?">
            <p>
              सिर्फ़ <strong>Retail Individual Investors</strong> (₹2 लाख तक का आवेदन) ही
              cut-off price पर बोली लगा सकते हैं। QIB और NII/HNI निवेशकों को बैंड के भीतर एक तय
              भाव पर बोली लगानी होती है — वे cut-off विकल्प इस्तेमाल नहीं कर सकते। पूरी कैटेगरी
              संरचना{" "}
              <Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">
                यहाँ देखें
              </Link>
              ।
            </p>
          </Section>

          <Section title="पैसा ब्लॉक होने और रिफंड का तरीक़ा">
            <p>
              जब आप cut-off पर बोली लगाते हैं, तो आपके बैंक अकाउंट में ब्लॉक की गई रकम (ASBA के
              ज़रिए) प्राइस बैंड के <strong>ऊपरी सिरे</strong> पर, यानी सबसे ख़राब स्थिति मानकर,
              कैलकुलेट होती है। अगर फ़ाइनल इश्यू भाव उससे कम तय होता है, तो अलॉटमेंट के बाद अंतर
              की रकम अपने आप अनब्लॉक या रिफंड हो जाती है।
            </p>
            <p>
              उदाहरण: प्राइस बैंड ₹100–₹110, लॉट साइज़ 100 शेयर। Cut-off पर बोली ₹11,000 ब्लॉक
              करती है। अगर फ़ाइनल भाव ₹105 तय होता है, तो असल में सिर्फ़ ₹10,500 डेबिट होंगे और
              ₹500 वापस रिलीज़ होंगे।
            </p>
          </Section>

          <Section title="निवेशक Cut-off Price क्यों चुनते हैं">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>बहुत कम भाव की वजह से बोली रिजेक्ट होने का जोखिम ख़त्म हो जाता है</li>
              <li>आवेदन आसान हो जाता है — डिमांड कहाँ सेटल होगी, यह अंदाज़ा लगाने की ज़रूरत नहीं</li>
              <li>आमतौर पर सिर्फ़ लिस्टिंग गेन के लिए आवेदन करने वाले Retail निवेशकों को यही सलाह दी जाती है</li>
            </ul>
          </Section>

          <Section id="faqs" title="अक्सर पूछे जाने वाले सवाल">
            <h3 className="font-semibold mt-4">क्या HNI या QIB cut-off price पर बोली लगा सकते हैं?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">नहीं। Cut-off विकल्प सिर्फ़ Retail Individual Investors के लिए है।</p>
            <h3 className="font-semibold mt-4">अगर फ़ाइनल भाव बैंड के ऊपरी सिरे से कम हो तो क्या होता है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">फ़ाइनल इश्यू भाव और अलॉटमेंट तय होने के बाद अतिरिक्त ब्लॉक की गई रकम अपने आप रिफंड या अनब्लॉक हो जाती है।</p>
            <h3 className="font-semibold mt-4">क्या cut-off पर बोली लगाना बैंड के सबसे ऊँचे भाव पर बोली लगाने जैसा ही है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">फंड-ब्लॉकिंग के लिहाज़ से दोनों मिलते-जुलते हैं, लेकिन cut-off का मतलब है &ldquo;जो भी फ़ाइनल भाव तय हो&rdquo;, जबकि सबसे ऊँचा भाव मैन्युअल चुनना उसी तय संख्या पर एक फ़िक्स्ड बोली है।</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO लर्निंग रिसोर्स">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB बनाम HNI बनाम Retail</Link></li>
              <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट कैसे होता है</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट प्रोबेबिलिटी कैलकुलेटर</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवल जानकारी देने के उद्देश्य से यह कंटेंट प्रदान करता है और SEBI के पास
          रजिस्टर्ड नहीं है। सटीक बिडिंग प्रक्रिया के लिए आधिकारिक RHP और अपने ब्रोकर का ऐप देखें।
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO Cut-off Price का मतलब क्या है? कौन इस्तेमाल कर सकता है",
            description: "IPO cut-off price विकल्प, सिर्फ़ Retail के लिए उपलब्धता, और फ़ाइनल भाव कम होने पर रिफंड कैसे काम करता है — यह समझाया गया है।",
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
              { "@type": "Question", name: "IPO Cut-off Price का मतलब क्या है?", acceptedAnswer: { "@type": "Answer", text: "Cut-off price एक बिडिंग विकल्प है जिसमें निवेशक जो भी फ़ाइनल भाव बुक-बिल्डिंग से तय हो, उस पर शेयर अलॉट होने का निर्देश देता है, ख़ास भाव चुनने की बजाय।" } },
              { "@type": "Question", name: "Cut-off price पर कौन बोली लगा सकता है?", acceptedAnswer: { "@type": "Answer", text: "सिर्फ़ Retail Individual Investors (₹2 लाख तक आवेदन) cut-off price पर बोली लगा सकते हैं। QIB और NII/HNI को तय भाव पर बोली लगानी होती है।" } },
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
