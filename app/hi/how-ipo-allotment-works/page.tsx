import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/how-ipo-allotment-works");
const enUrl = canonicalUrl("/how-ipo-allotment-works");
const mrUrl = canonicalUrl("/mr/how-ipo-allotment-works");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "भारत में IPO अलॉटमेंट कैसे होता है? पूरी प्रक्रिया (Retail, HNI, QIB) | IPOCraft",
  description:
    "भारत में IPO अलॉटमेंट कैसे तय होता है — रिटेल कोटा, HNI अलॉटमेंट, ओवरसब्सक्रिप्शन नियम, लॉटरी सिस्टम, और रिफंड प्रोसेस — हिंदी में पूरी गाइड।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function HowIpoAllotmentWorksHindiPage() {
  return (
    <div
      lang="hi"
      className="min-h-screen scroll-smooth bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] tracking-[0.22em] uppercase text-[#1C317A] dark:text-blue-400 font-semibold mb-4">
          IPO लर्निंग गाइड
        </p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          भारत में IPO अलॉटमेंट कैसे होता है? पूरी प्रक्रिया ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPO अलॉटमेंट वह प्रक्रिया है जिसके ज़रिए बिडिंग अवधि ख़त्म होने के बाद निवेशकों को शेयर
          बांटे जाते हैं। जब डिमांड सप्लाई से ज़्यादा हो जाती है (ओवरसब्सक्रिप्शन), तो अलॉटमेंट
          स्टॉक एक्सचेंज और SEBI के नियमों से तय संरचित तरीक़े से होता है।
        </p>

        <p className="mt-4 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          सब्सक्रिप्शन अनुपात और{" "}
          <Link href="/hi/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            IPO GMP
          </Link>{" "}
          से IPO की डिमांड ट्रैक करने वाले निवेशक अक्सर यह समझना चाहते हैं कि शेयर असल में कैसे
          बंटते हैं। यह गाइड Retail, HNI और QIB कैटेगरी के लिए पूरा अलॉटमेंट तंत्र समझाती है।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-8 sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-3">इस पेज पर</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#timeline" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO टाइमलाइन</a>
            <a href="#retail" className="text-[#1C317A] dark:text-blue-400 hover:underline">Retail अलॉटमेंट</a>
            <a href="#hni" className="text-[#1C317A] dark:text-blue-400 hover:underline">HNI अलॉटमेंट</a>
            <a href="#qib" className="text-[#1C317A] dark:text-blue-400 hover:underline">QIB अलॉटमेंट</a>
            <a href="#probability" className="text-[#1C317A] dark:text-blue-400 hover:underline">प्रोबेबिलिटी उदाहरण</a>
            <a href="#comparison" className="text-[#1C317A] dark:text-blue-400 hover:underline">अलॉटमेंट बनाम GMP बनाम लिस्टिंग</a>
          </div>
        </div>

        <div className="mt-10 space-y-12">
          <div id="timeline">
            <Section title="IPO अलॉटमेंट टाइमलाइन">
              <ul className="list-disc pr-6 pl-6 space-y-2">
                <li>IPO सब्सक्रिप्शन के लिए खुलता है</li>
                <li>बिडिंग अवधि के बाद IPO बंद होता है</li>
                <li>Basis of Allotment फ़ाइनल होता है</li>
                <li>शेयर डीमैट अकाउंट में क्रेडिट होते हैं</li>
                <li>जिन्हें अलॉटमेंट नहीं मिला उनका रिफंड शुरू होता है</li>
                <li>स्टॉक एक्सचेंज पर लिस्टिंग होती है</li>
              </ul>
              <p>
                आप{" "}
                <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
                  IPO कैलेंडर
                </Link>{" "}
                के ज़रिए आगामी IPO टाइमलाइन ट्रैक कर सकते हैं।
              </p>
            </Section>
          </div>

          <Section title="IPO अलॉटमेंट कैटेगरी">
            <p>IPO शेयर तय कैटेगरी में बांटे जाते हैं:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>Retail Individual Investors (RII)</li>
              <li>High Net-worth Individuals (HNI / NII)</li>
              <li>Qualified Institutional Buyers (QIB)</li>
              <li>Anchor Investors (कुछ IPO में)</li>
            </ul>
          </Section>

          <div id="retail">
            <Section title="Retail IPO अलॉटमेंट कैसे काम करता है">
              <p>
                Retail कैटेगरी में, IPO ओवरसब्सक्राइब होने पर अलॉटमेंट अक्सर लॉटरी सिस्टम से होता
                है। मक़सद है व्यक्तिगत निवेशकों के बीच बराबर बंटवारा सुनिश्चित करना।
              </p>
              <p>
                अगर कोई IPO Retail में 10 गुना सब्सक्राइब होता है, तो सिर्फ़ कुछ हिस्से के
                आवेदकों को ही एक लॉट मिलेगा। आमतौर पर कोशिश यह रहती है कि ज़्यादा से ज़्यादा
                निवेशकों को कम से कम एक लॉट मिल जाए।
              </p>
            </Section>
          </div>

          <div id="hni">
            <Section title="HNI (NII) अलॉटमेंट कैसे काम करता है">
              <p>HNI अलॉटमेंट लॉटरी की बजाय आनुपातिक होता है। शेयर आवेदन की गई संख्या के अनुपात में आवंटित होते हैं।</p>
              <p>अगर HNI सब्सक्रिप्शन 5 गुना है, तो आवेदकों को उनकी मांगी गई मात्रा का लगभग एक-पांचवां हिस्सा मिल सकता है।</p>
            </Section>
          </div>

          <div id="qib">
            <Section title="QIB अलॉटमेंट कैसे काम करता है">
              <p>QIB अलॉटमेंट पूरी तरह आनुपातिक होता है। संस्थागत निवेशकों को कुल संस्थागत डिमांड के मुक़ाबले उनके आवेदन के आकार के आधार पर अलॉटमेंट मिलता है।</p>
            </Section>
          </div>

          <Section title="Basis of Allotment क्या है?">
            <p>Basis of Allotment वह फ़ाइनल अलॉटमेंट डॉक्यूमेंट है जिसे स्टॉक एक्सचेंज मंज़ूरी देता है। यह बताता है कि शेयर कैटेगरी में कैसे बंटे।</p>
          </Section>

          <Section title="IPO में रिफंड प्रोसेस">
            <p>अगर शेयर अलॉट नहीं होते, तो ASBA में ब्लॉक की गई रकम निवेशक के बैंक अकाउंट में वापस जारी कर दी जाती है। रिफंड आमतौर पर लिस्टिंग से पहले हो जाता है।</p>
          </Section>

          <Section title="सामान्य IPO अलॉटमेंट परिदृश्य">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>अंडरसब्सक्राइब्ड IPO - पूरा अलॉटमेंट</li>
              <li>मध्यम ओवरसब्सक्रिप्शन - आंशिक अलॉटमेंट</li>
              <li>भारी ओवरसब्सक्रिप्शन - लॉटरी (Retail)</li>
            </ul>
          </Section>

          <Section title="एडवांस्ड इनसाइट: ओवरसब्सक्राइब्ड IPO में प्रोबेबिलिटी">
            <p>Retail अलॉटमेंट की संभावना कुल उपलब्ध Retail लॉट को कुल Retail आवेदनों से भाग देकर अनुमानित की जा सकती है। हालाँकि, असल अलॉटमेंट वैध बिड और कैटेगरी नियमों पर निर्भर करता है।</p>
          </Section>

          <Section title="IPO अलॉटमेंट प्रोबेबिलिटी कैलकुलेशन लॉजिक">
            <p>आप एक आसान फ़ॉर्मूले से Retail अलॉटमेंट प्रोबेबिलिटी का अंदाज़ा लगा सकते हैं:</p>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium">
              प्रोबेबिलिटी (%) = (उपलब्ध Retail लॉट ÷ Retail आवेदन) × 100
            </div>
            <p>उदाहरण:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>Retail लॉट: 15,000</li>
              <li>आवेदन: 1,50,000</li>
              <li>प्रोबेबिलिटी ≈ 10%</li>
            </ul>
            <p>यह अनुमान बराबर लॉट बंटवारे और वैध आवेदनों को मानकर चलता है। असल अलॉटमेंट कैटेगरी एडजस्टमेंट के हिसाब से बदल सकता है।</p>
          </Section>

          <Section title="SME IPO अलॉटमेंट में अंतर">
            <p>SME IPO में अक्सर लॉट साइज़ बड़ा और लिक्विडिटी कम होती है। अलॉटमेंट फिर भी संरचित तरीक़े से हो सकता है, लेकिन छोटे निवेशक पूल का असर पड़ सकता है।</p>
          </Section>

          <div id="probability">
            <Section title="विस्तृत Retail लॉटरी उदाहरण (गणित के साथ)">
              <p>मान लीजिए किसी IPO में Retail निवेशकों के लिए 10,00,000 शेयर आरक्षित हैं, और लॉट साइज़ 50 शेयर है। यानी 20,000 Retail लॉट उपलब्ध हैं।</p>
              <p>अगर 2,00,000 वैध Retail आवेदन आते हैं, तो IPO Retail कैटेगरी में 10 गुना ओवरसब्सक्राइब हुआ।</p>
              <p>चूंकि सिर्फ़ 20,000 लॉट उपलब्ध हैं लेकिन 2,00,000 लोगों ने आवेदन किया, तो एक लॉट मिलने की संभावना लगभग इतनी बनती है:</p>
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium text-[#0f172a] dark:text-[#F1F5F9]">
                प्रोबेबिलिटी ≈ 20,000 ÷ 2,00,000 = 10%
              </div>
              <p>ऐसे मामलों में, अलॉटमेंट स्टॉक एक्सचेंज से मंज़ूर एक कंप्यूटराइज़्ड लॉटरी सिस्टम से होता है।</p>
            </Section>
          </div>

          <div id="comparison">
            <Section title="अलॉटमेंट बनाम GMP बनाम लिस्टिंग - क्या फ़र्क़ है?">
              <p>IPO अलॉटमेंट, Grey Market Premium (GMP), और लिस्टिंग गेन अक्सर एक-दूसरे से गड्डमड्ड हो जाते हैं, लेकिन ये IPO लाइफ़साइकल के अलग-अलग चरण हैं।</p>
              <ul className="list-disc pr-6 pl-6 space-y-2">
                <li><strong>अलॉटमेंट:</strong> IPO बंद होने के बाद शेयरों का बंटवारा।</li>
                <li><strong>GMP:</strong> लिस्टिंग से पहले माने गए डिमांड का अनौपचारिक प्रीमियम।</li>
                <li><strong>लिस्टिंग:</strong> स्टॉक एक्सचेंज पर ट्रेडिंग का पहला दिन।</li>
              </ul>
              <p>GMP सेंटिमेंट दिखाता है, अलॉटमेंट नियमों को दिखाता है, और लिस्टिंग सप्लाई-डिमांड पर आधारित असली बाज़ार भाव दिखाती है।</p>
            </Section>
          </div>

          <Section title="असली ओवरसब्सक्रिप्शन केस परिदृश्य">
            <p>कई लोकप्रिय IPO में, Retail सब्सक्रिप्शन 30x या 50x से भी ऊपर जा सकता है। ऐसे में सिर्फ़ थोड़े से आवेदकों को एक न्यूनतम लॉट मिलता है।</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>Retail कैटेगरी लॉटरी-आधारित अलॉटमेंट इस्तेमाल करती है</li>
              <li>HNI कैटेगरी आनुपातिक अलॉटमेंट फॉलो करती है</li>
              <li>QIB कैटेगरी पूरी तरह आनुपातिक बंटवारा इस्तेमाल करती है</li>
            </ul>
            <p>मज़बूत मार्केट सेंटिमेंट के बावजूद, भारी ओवरसब्सक्राइब्ड IPO में Retail अलॉटमेंट की संभावना काफ़ी घट जाती है।</p>
          </Section>

          <Section title="स्टेप-बाय-स्टेप ASBA प्रोसेस">
            <p>ASBA (Application Supported by Blocked Amount) भारत में IPO आवेदन के लिए इस्तेमाल होने वाला तंत्र है।</p>
            <ol className="list-decimal pr-6 pl-6 space-y-2">
              <li>निवेशक बैंक या ब्रोकर के ज़रिए IPO के लिए आवेदन करता है।</li>
              <li>आवेदन की रकम बैंक अकाउंट में ब्लॉक हो जाती है।</li>
              <li>अगर शेयर अलॉट होते हैं, तो रकम डेबिट हो जाती है।</li>
              <li>अगर अलॉट नहीं होते, तो ब्लॉक रकम रिलीज़ हो जाती है।</li>
            </ol>
            <p>यह सिस्टम सुनिश्चित करता है कि फ़ाइनल अलॉटमेंट तय होने तक निवेशक का पैसा सुरक्षित रहे।</p>
          </Section>

          <Section title="IPO अलॉटमेंट स्टेटस कैसे चेक करें">
            <p>निवेशक अलॉटमेंट डेट के बाद आधिकारिक रजिस्ट्रार वेबसाइट या स्टॉक एक्सचेंज पोर्टल से अलॉटमेंट स्टेटस चेक कर सकते हैं।</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>रजिस्ट्रार की वेबसाइट पर जाएँ</li>
              <li>IPO का नाम चुनें</li>
              <li>PAN / आवेदन नंबर डालें</li>
              <li>अलॉटमेंट रिज़ल्ट देखें</li>
            </ul>
            <p>
              आप{" "}
              <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO कैलेंडर
              </Link>{" "}
              से भी IPO टाइमलाइन ट्रैक कर सकते हैं।
            </p>
          </Section>

          <Section title="अक्सर पूछे जाने वाले सवाल (FAQs)">
            <h3 className="font-semibold mt-4">IPO अलॉटमेंट कैसे तय होता है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">अलॉटमेंट कैटेगरी के सब्सक्रिप्शन और एक्सचेंज-मंज़ूर अलॉटमेंट नियमों के आधार पर तय होता है।</p>

            <h3 className="font-semibold mt-4">क्या IPO अलॉटमेंट रैंडम होता है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">Retail ओवरसब्सक्रिप्शन के मामलों में, अलॉटमेंट एक कंप्यूटराइज़्ड लॉटरी सिस्टम से हो सकता है।</p>

            <h3 className="font-semibold mt-4">IPO अलॉटमेंट डेट कब होती है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">आमतौर पर IPO बंद होने के 2-3 कार्य दिवसों के भीतर।</p>
          </Section>

          <Section title="संबंधित IPO लर्निंग रिसोर्स">
            <p>अलॉटमेंट, सब्सक्रिप्शन, GMP और कैटेगरी डिमांड से कैसे जुड़ता है यह समझने के लिए देखें:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP क्या है</Link></li>
              <li><Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट गाइड</Link></li>
              <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
              <li><Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB बनाम HNI बनाम Retail</Link></li>
              <li><Link href="/hi/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">DRHP बनाम RHP</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट प्रोबेबिलिटी कैलकुलेटर</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवल जानकारी देने के उद्देश्य से यह कंटेंट प्रदान करता है और SEBI के पास
          रजिस्टर्ड नहीं है। यह गाइड शैक्षणिक और रिसर्च उद्देश्य के लिए है और निवेश सलाह नहीं है।
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "IPO अलॉटमेंट कैसे तय होता है?", acceptedAnswer: { "@type": "Answer", text: "अलॉटमेंट कैटेगरी के सब्सक्रिप्शन स्तर और एक्सचेंज-मंज़ूर अलॉटमेंट नियमों के आधार पर तय होता है।" } },
              { "@type": "Question", name: "क्या Retail निवेशकों के लिए IPO अलॉटमेंट रैंडम है?", acceptedAnswer: { "@type": "Answer", text: "ओवरसब्सक्राइब्ड IPO में, Retail अलॉटमेंट निष्पक्षता सुनिश्चित करने के लिए एक कंप्यूटराइज़्ड लॉटरी सिस्टम से किया जाता है।" } },
              { "@type": "Question", name: "मैं IPO अलॉटमेंट स्टेटस कैसे चेक कर सकता हूँ?", acceptedAnswer: { "@type": "Answer", text: "अलॉटमेंट डेट के बाद PAN या आवेदन नंबर का इस्तेमाल कर आधिकारिक रजिस्ट्रार वेबसाइट पर IPO अलॉटमेंट स्टेटस चेक किया जा सकता है।" } },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
