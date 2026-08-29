import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/kostak-rate-meaning");
const enUrl = canonicalUrl("/kostak-rate-meaning");
const mrUrl = canonicalUrl("/mr/kostak-rate-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO में कोस्टक रेट क्या है? GMP से कैसे अलग है | IPOCraft",
  description:
    "कोस्टक रेट का मतलब, यह GMP और सब्जेक्ट-टू-सौदा से कैसे अलग है, कोस्टक रेट क्यों मौजूद हैं, और इसके जोखिम — हिंदी में पूरी गाइड।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function KostakRateHindiPage() {
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
          IPO में कोस्टक रेट क्या है? GMP से फ़र्क़ ({CURRENT_YEAR} गाइड)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          कोस्टक रेट एक ग्रे मार्केट शब्द है — यह वह तय, एकमुश्त क़ीमत है जिस पर कोई IPO आवेदक
          अलॉटमेंट पता चलने से पहले ही अपना पूरा आवेदन किसी और ख़रीदार को बेच देता है। GMP के
          उलट, जो सिर्फ़ अलॉट हुए शेयरों पर मिलने वाला प्रति-शेयर प्रीमियम है, कोस्टक डील अलॉटमेंट
          के नतीजे की परवाह किए बिना हर हाल में मिलती है।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/mr/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">मराठी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="what-is-kostak" title="कोस्टक रेट का क्या मतलब है?">
            <p>
              ग्रे मार्केट की भाषा में, कोस्टक डील का मतलब है अपना IPO एप्लिकेशन फ़ॉर्म ही बेच
              देना — यानी उस पर जो कुछ भी अलॉट हो, उसका हक़ — एक ऐसी तय रकम पर जो पहले से तय हो
              चुकी है। ख़रीदार विक्रेता को कोस्टक रेट देता है, चाहे आवेदन को पूरा अलॉटमेंट मिले,
              आंशिक मिले, या बिल्कुल न मिले।
            </p>
            <p>
              यह GMP से मूल रूप से अलग है, जो सिर्फ़ असल में अलॉट हुए शेयर पर मिलता है। कोस्टक
              में अलॉटमेंट का पूरा जोखिम ख़रीदार पर चला जाता है।
            </p>
          </Section>

          <Section title="कोस्टक रेट बनाम GMP बनाम सब्जेक्ट-टू-सौदा">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><strong>GMP (Grey Market Premium):</strong> प्रति-शेयर प्रीमियम, सिर्फ़ असल में अलॉट हुए शेयरों पर मिलता है।</li>
              <li><strong>कोस्टक रेट:</strong> पूरे आवेदन के लिए एक तय एकमुश्त रकम, अलॉटमेंट हो या न हो।</li>
              <li><strong>सब्जेक्ट-टू-सौदा (STS):</strong> एक हाइब्रिड डील — कीमत प्रति लॉट तय होती है, लेकिन डील तभी लागू होती है जब न्यूनतम अलॉटमेंट मिले; कुछ भी अलॉट न हो तो डील रद्द हो जाती है।</li>
            </ul>
            <p>
              ये तीनों अनौपचारिक, अनियमित ग्रे मार्केट व्यवस्थाएं हैं और इनमें से किसी को भी
              किसी एक्सचेंज, रजिस्ट्रार या SEBI प्रक्रिया से मान्यता प्राप्त नहीं है।
            </p>
          </Section>

          <Section title="कोस्टक रेट क्यों मौजूद हैं">
            <p>
              कोस्टक डील किसी आवेदक को अलॉटमेंट की घोषणा से पहले ही एक तय मुनाफ़ा लॉक करने (या
              नुक़सान से बचने) देती है — ख़ासकर तब जब IPO भारी सब्सक्राइब हुआ हो और अलॉटमेंट की
              संभावना कम हो। ख़रीदार यह अंदाज़ा लगाता है कि आवेदन की उम्मीदी वैल्यू (अलॉटमेंट संभावना
              + अनुमानित लिस्टिंग गेन मिलाकर) उसके द्वारा दी जा रही कोस्टक क़ीमत से ज़्यादा है।
            </p>
          </Section>

          <Section id="risks" title="कोस्टक डील के जोखिम">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>पूरी तरह अनियमित — कोई एक्सचेंज, एस्क्रो या क़ानूनी सुरक्षा तंत्र नहीं</li>
              <li>काउंटरपार्टी जोखिम: कोई भी पक्ष बिना किसी उपाय के डिफ़ॉल्ट कर सकता है</li>
              <li>रेट मौखिक तय होते हैं और ब्रोकर/डीलर के हिसाब से काफ़ी अलग हो सकते हैं</li>
              <li>किसी भी तरह से आधिकारिक सब्सक्रिप्शन या अलॉटमेंट डेटा से नहीं जुड़ा</li>
            </ul>
            <p>
              IPOCraft कोस्टक लेन-देन को सुविधाजनक, सत्यापित या समर्थित नहीं करता। यह पेज सिर्फ़
              निवेशकों को यह शब्द समझाने के लिए है।
            </p>
          </Section>

          <Section id="faqs" title="अक्सर पूछे जाने वाले सवाल">
            <h3 className="font-semibold mt-4">क्या कोस्टक रेट और GMP एक ही चीज़ है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              नहीं। GMP अलॉट हुए शेयरों पर मिलने वाला प्रति-शेयर प्रीमियम है; कोस्टक अलॉटमेंट की
              परवाह किए बिना पूरे आवेदन के लिए दी जाने वाली एकमुश्त रकम है।
            </p>
            <h3 className="font-semibold mt-4">क्या कोस्टक डील में ट्रेडिंग करना क़ानूनी है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              कोस्टक डील आधिकारिक एक्सचेंज तंत्र से बाहर की अनौपचारिक ग्रे-मार्केट व्यवस्थाएं
              हैं। इन्हें कोई रेगुलेटरी मान्यता या सुरक्षा नहीं मिलती।
            </p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO लर्निंग रिसोर्स">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP क्या है</Link></li>
              <li><Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट गाइड</Link></li>
              <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
              <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट कैसे होता है</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवल जानकारी देने के उद्देश्य से यह कंटेंट प्रदान करता है और SEBI के पास
          रजिस्टर्ड नहीं है। ग्रे मार्केट गतिविधि अनौपचारिक और जोखिम भरी होती है — इसे निवेश
          सलाह न समझें।
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO में कोस्टक रेट क्या है? GMP से फ़र्क़",
            description: "कोस्टक रेट, GMP और सब्जेक्ट-टू-सौदा में फ़र्क़, और ग्रे मार्केट ट्रेडिंग के जोखिम समझाए गए।",
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
              { "@type": "Question", name: "कोस्टक रेट क्या है?", acceptedAnswer: { "@type": "Answer", text: "कोस्टक रेट वह तय, एकमुश्त ग्रे मार्केट रकम है जिस पर IPO आवेदक अलॉटमेंट के नतीजे की परवाह किए बिना अपना पूरा आवेदन किसी ख़रीदार को बेचता है।" } },
              { "@type": "Question", name: "क्या कोस्टक रेट और GMP एक ही चीज़ है?", acceptedAnswer: { "@type": "Answer", text: "नहीं, GMP प्रति-शेयर प्रीमियम है जो सिर्फ़ अलॉट हुए शेयरों पर मिलता है, जबकि कोस्टक पूरे आवेदन के लिए एकमुश्त रकम है।" } },
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
