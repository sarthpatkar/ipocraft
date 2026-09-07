import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/qib-hni-retail-explained");
const enUrl = canonicalUrl("/qib-hni-retail-explained");
const mrUrl = canonicalUrl("/mr/qib-hni-retail-explained");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "QIB बनाम HNI बनाम Retail निवेशक - पूरा IPO कैटेगरी ब्रेकडाउन | IPOCraft",
  description:
    "QIB, HNI (NII), और Retail निवेशक कैटेगरी, उनका अलॉटमेंट कोटा, सब्सक्रिप्शन पर असर, और अलॉटमेंट में फ़र्क़ — हिंदी में पूरी गाइड।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function QibHniRetailHindiPage() {
  return (
    <div
      lang="hi"
      className="min-h-screen scroll-smooth bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C317A] dark:text-blue-400">
          IPO लर्निंग गाइड
        </p>

        <h1
          className="mt-3 text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          QIB बनाम HNI बनाम Retail निवेशक - पूरा IPO कैटेगरी ब्रेकडाउन ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          किसी Initial Public Offering (IPO) में, शेयरों को अलग-अलग निवेशक कैटेगरी में बांटा जाता
          है: Qualified Institutional Buyers (QIB), High Net-worth Individuals (HNI/NII), और
          Retail Individual Investors (RII)। हर कैटेगरी का एक तय कोटा, अलॉटमेंट तरीक़ा और
          सब्सक्रिप्शन डायनामिक्स होता है। इन फ़र्क़ों को समझने से निवेशकों को अलॉटमेंट की
          संभावना और डिमांड के रुझान का ज़्यादा सटीक अंदाज़ा लगाने में मदद मिलती है।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-6 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            त्वरित तुलना: QIB बनाम HNI बनाम Retail
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#f8fafc] dark:bg-[#090B0F] rounded-lg p-3 border border-[#e2e8f0] dark:border-[#252A31]">
              <p className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Retail (RII)</p>
              <ul className="mt-2 list-disc pr-4 pl-4 space-y-1 text-[#475569] dark:text-[#9AA1AA]">
                <li>₹2 लाख तक का आवेदन</li>
                <li>~35% अलॉटमेंट</li>
                <li>लॉटरी-आधारित अलॉटमेंट</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#090B0F] rounded-lg p-3 border border-[#e2e8f0] dark:border-[#252A31]">
              <p className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">HNI / NII</p>
              <ul className="mt-2 list-disc pr-4 pl-4 space-y-1 text-[#475569] dark:text-[#9AA1AA]">
                <li>₹2 लाख से ऊपर</li>
                <li>~15% अलॉटमेंट</li>
                <li>आनुपातिक अलॉटमेंट</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#090B0F] rounded-lg p-3 border border-[#e2e8f0] dark:border-[#252A31]">
              <p className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">QIB</p>
              <ul className="mt-2 list-disc pr-4 pl-4 space-y-1 text-[#475569] dark:text-[#9AA1AA]">
                <li>संस्थागत निवेशक</li>
                <li>~50% अलॉटमेंट</li>
                <li>बुक-बिल्डिंग आधारित</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-3">इस पेज पर</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#overview" className="text-[#1C317A] dark:text-blue-400 hover:underline">कैटेगरी ओवरव्यू</a>
            <a href="#retail" className="text-[#1C317A] dark:text-blue-400 hover:underline">Retail निवेशक</a>
            <a href="#hni" className="text-[#1C317A] dark:text-blue-400 hover:underline">HNI / NII</a>
            <a href="#qib" className="text-[#1C317A] dark:text-blue-400 hover:underline">QIB</a>
            <a href="#allocation" className="text-[#1C317A] dark:text-blue-400 hover:underline">अलॉटमेंट नियम</a>
            <a href="#impact" className="text-[#1C317A] dark:text-blue-400 hover:underline">लिस्टिंग पर असर</a>
          </div>
        </div>

        <div className="mt-10 space-y-16">
          <Section id="overview" title="IPO निवेशक कैटेगरी ओवरव्यू (मेनबोर्ड बनाम SME)">
            <p>
              भारत में IPO अलॉटमेंट को संरचित निवेशक बकेट में बांटा जाता है ताकि संस्थागत और
              गैर-संस्थागत निवेशकों के बीच निष्पक्ष भागीदारी सुनिश्चित हो सके। एक सामान्य मेनबोर्ड
              IPO में, अलॉटमेंट आमतौर पर इस तरह बंटा होता है:
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><strong>QIB (Qualified Institutional Buyers):</strong> ~50%</li>
              <li><strong>Retail Individual Investors (RII):</strong> ~35%</li>
              <li><strong>HNI / NII (Non-Institutional Investors):</strong> ~15%</li>
            </ul>
            <p>
              हालाँकि, SME IPO में यह संरचना काफ़ी अलग होती है। SME इश्यू में अक्सर Retail
              अलॉटमेंट कहीं ज़्यादा होता है और एक अलग Market Maker हिस्सा होता है। मेनबोर्ड IPO
              के मुक़ाबले संस्थागत भागीदारी कम हो सकती है।
            </p>
            <p>सब्सक्रिप्शन डेटा समझने से पहले यह जानना ज़रूरी है कि कोई IPO SME है या मेनबोर्ड।</p>
          </Section>

          <Section id="retail" title="Retail Individual Investors (RII) - लॉटरी आधारित अलॉटमेंट">
            <p>
              Retail निवेशक मेनबोर्ड IPO में ₹2 लाख तक आवेदन कर सकते हैं। अगर Retail कैटेगरी
              ओवरसब्सक्राइब हो जाती है, तो अलॉटमेंट एक कंप्यूटराइज़्ड लॉटरी सिस्टम से होता है।
            </p>
            <p>
              उदाहरण: मान लीजिए Retail कोटे में 10 लाख शेयर उपलब्ध हैं और 1 करोड़ शेयरों के लिए
              आवेदन आते हैं। यानी Retail 10 गुना सब्सक्राइब हुआ।
            </p>
            <p>
              अगर 5 लाख वैध Retail आवेदन हैं और सिर्फ़ 1 लाख आवेदनों को न्यूनतम लॉट मिल सकता है,
              तो असल संभावना बनती है:
            </p>
            <p className="font-medium">1,00,000 ÷ 5,00,000 = 20% अलॉटमेंट संभावना</p>
            <p>यही वजह है कि मज़बूत IPO में भी ज़्यादातर Retail निवेशकों को अलॉटमेंट नहीं मिलता।</p>
          </Section>

          <Section id="hni" title="HNI / NII - लीवरेज असर के साथ आनुपातिक अलॉटमेंट">
            <p>HNI निवेशक ₹2 लाख से ऊपर आवेदन करते हैं। Retail के उलट, HNI अलॉटमेंट आनुपातिक होता है।</p>
            <p>
              उदाहरण: अगर HNI कैटेगरी 30 गुना सब्सक्राइब हुई है, और कोई निवेशक 300 लॉट के लिए
              आवेदन करता है, तो असल अलॉटमेंट घटकर लगभग 10 लॉट रह सकता है।
            </p>
            <p>मज़बूत IPO में, HNI सब्सक्रिप्शन अक्सर लीवरेज्ड फंडिंग से बढ़ी होती है। इससे असल डिमांड का ग़लत अंदाज़ा लग सकता है।</p>
          </Section>

          <Section id="qib" title="QIB - भरोसे के संकेतक के रूप में संस्थागत डिमांड">
            <p>QIB में म्यूचुअल फंड, बीमा कंपनियाँ, बैंक और विदेशी संस्थागत निवेशक शामिल हैं। इन्हें मेनबोर्ड IPO में आमतौर पर 50% अलॉटमेंट मिलता है।</p>
            <p>
              मज़बूत QIB सब्सक्रिप्शन, ख़ासकर दूसरे और तीसरे दिन, अक्सर संस्थागत भरोसे का संकेत
              देता है। कई विश्लेषक लिस्टिंग की मज़बूती आंकते समय Retail ओवरसब्सक्रिप्शन के मुक़ाबले
              QIB भागीदारी को ज़्यादा भरोसेमंद मानते हैं।
            </p>
          </Section>

          <Section id="allocation" title="विस्तृत अलॉटमेंट गणित उदाहरण">
            <p>मान लीजिए किसी IPO का कुल इश्यू साइज़ 1 करोड़ शेयर है।</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>QIB: 50 लाख शेयर</li>
              <li>Retail: 35 लाख शेयर</li>
              <li>HNI: 15 लाख शेयर</li>
            </ul>
            <p>अगर सब्सक्रिप्शन स्तर ये हैं:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>QIB: 8x</li>
              <li>Retail: 20x</li>
              <li>HNI: 50x</li>
            </ul>
            <p>तो असल प्रतिस्पर्धा हर कैटेगरी में नाटकीय रूप से अलग होती है। ज़्यादा मल्टीपल के बावजूद Retail की संभावना QIB से कम हो सकती है।</p>
          </Section>

          <Section id="case-study" title="असली ओवरसब्सक्रिप्शन केस स्टडी लॉजिक">
            <p>एक मज़बूत मेनबोर्ड IPO पर विचार करें जहाँ Retail सब्सक्रिप्शन 25x, HNI 120x, और QIB 15x तक पहुँचा।</p>
            <p>
              भले ही HNI 120x दिखाता है, इसका ज़्यादातर हिस्सा शॉर्ट-टर्म लीवरेज से फंडेड हो सकता
              है। QIB की 15x भागीदारी अक्सर लॉन्ग-टर्म संस्थागत रुचि का ज़्यादा मज़बूत संकेत देती
              है।
            </p>
            <p>ऐसे IPO में लिस्टिंग गेन अक्सर तभी सपोर्ट होता है जब QIB डिमांड मज़बूत बनी रहती है।</p>
          </Section>

          <Section id="probability" title="कैटेगरी के अनुसार संभावना की तुलना">
            <p>Retail की संभावना लॉटरी-आधारित है। HNI की संभावना आनुपातिक रूप से घटती है। QIB अलॉटमेंट बुक-बिल्डिंग और संस्थागत बोली पैटर्न पर निर्भर करता है।</p>
            <p>भारी ओवरसब्सक्राइब्ड IPO में, Retail संभावना 5% से नीचे गिर सकती है, जबकि HNI को आंशिक अलॉटमेंट मिल सकता है।</p>
          </Section>

          <Section id="flow-diagram" title="IPO सब्सक्रिप्शन कैटेगरी में कैसे फ़्लो होता है (विज़ुअल गाइड)">
            <p>सब्सक्रिप्शन प्रक्रिया एक तय फ़्लो में चलती है — बोलियाँ कैटेगरी-वार इकट्ठा होती हैं, रोज़ गिनी जाती हैं, और इश्यू बंद होने पर अलॉटमेंट लॉजिक लागू होने से पहले फ़ाइनल की जाती हैं।</p>
            <div className="mt-6 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-6 overflow-x-auto">
              <svg viewBox="0 0 800 200" className="min-w-[600px] w-full h-auto">
                <defs>
                  <marker id="arrow-hi" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#1C317A" />
                  </marker>
                </defs>
                <rect x="20" y="70" width="180" height="50" rx="8" fill="#eef2ff" stroke="#1C317A" />
                <text x="110" y="100" textAnchor="middle" fontSize="14" fill="#0f172a">निवेशक बोलियाँ</text>
                <line x1="200" y1="95" x2="320" y2="95" stroke="#1C317A" strokeWidth="2" markerEnd="url(#arrow-hi)" />
                <rect x="320" y="70" width="180" height="50" rx="8" fill="#f1f5f9" stroke="#1C317A" />
                <text x="410" y="90" textAnchor="middle" fontSize="13" fill="#0f172a">कैटेगरी-वार</text>
                <text x="410" y="108" textAnchor="middle" fontSize="13" fill="#0f172a">गिनती (QIB / HNI / Retail)</text>
                <line x1="500" y1="95" x2="620" y2="95" stroke="#1C317A" strokeWidth="2" markerEnd="url(#arrow-hi)" />
                <rect x="620" y="70" width="160" height="50" rx="8" fill="#eef2ff" stroke="#1C317A" />
                <text x="700" y="100" textAnchor="middle" fontSize="14" fill="#0f172a">अलॉटमेंट लॉजिक</text>
              </svg>
            </div>
            <p className="mt-4">बिडिंग बंद होने के बाद, हर कैटेगरी का अलग-अलग आकलन होता है। Retail लॉटरी अलॉटमेंट फॉलो करता है, HNI आनुपातिक अलॉटमेंट फॉलो करता है, और QIB अलॉटमेंट संस्थागत बुक-बिल्डिंग पर निर्भर करता है।</p>
          </Section>

          <Section id="impact" title="उन्नत व्याख्या रणनीतियाँ">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>बिडिंग विंडो के आख़िर में मज़बूत QIB डिमांड एक सकारात्मक संकेत है।</li>
              <li>QIB मज़बूती के बिना सिर्फ़ Retail ओवरसब्सक्रिप्शन अटकलों पर आधारित रुचि का संकेत हो सकता है।</li>
              <li>SME IPO कम लिक्विडिटी और मार्केट मेकर संरचना की वजह से अलग व्यवहार करते हैं।</li>
              <li>सब्सक्रिप्शन की तुलना हमारे <Link href="/hi/gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP ट्रैकर</Link> पर Grey Market Premium रुझानों से करें।</li>
            </ul>
          </Section>

          <Section id="institutional" title="संस्थागत व्यवहार की जानकारी">
            <p>संस्थाएँ अक्सर शुरुआत में सतर्क और बंद होने के क़रीब आक्रामक तरीक़े से बोली लगाती हैं। रोज़ाना सब्सक्रिप्शन ब्रेकडाउन देखने से संस्थागत मंशा समझने में मदद मिलती है।</p>
            <p>IPO खुलने से पहले QIB एंकर अलॉटमेंट भी लिस्टिंग के बाद की स्थिरता को प्रभावित करता है।</p>
          </Section>

          <Section id="data" title="डेटा पारदर्शिता और स्रोत संदर्भ">
            <p>IPO सब्सक्रिप्शन के आँकड़े एक्सचेंज खुलासों और IPO बिडिंग अवधि के दौरान जारी आधिकारिक बिड डेटा से लिए जाते हैं। निवेशकों को फ़ैसला लेने से पहले हमेशा आधिकारिक फाइलिंग से सब्सक्रिप्शन संख्या सत्यापित करनी चाहिए।</p>
            <p>IPOCraft केवल सूचनात्मक और शोध उद्देश्यों के लिए सार्वजनिक रूप से उपलब्ध डेटा इकट्ठा करता है।</p>
          </Section>

          <Section id="comparison-table" title="मेनबोर्ड बनाम SME IPO कोटा तुलना तालिका">
            <p>मेनबोर्ड और SME IPO के बीच अलॉटमेंट संरचना काफ़ी अलग होती है। सब्सक्रिप्शन डेटा का विश्लेषण करते समय इस संरचनात्मक फ़र्क़ को समझना ज़रूरी है।</p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-[#e2e8f0] dark:border-[#252A31]">
                <thead className="bg-[#f1f5f9] dark:bg-[#171B20]">
                  <tr>
                    <th className="text-left px-4 py-2 border">कैटेगरी</th>
                    <th className="text-left px-4 py-2 border">मेनबोर्ड IPO</th>
                    <th className="text-left px-4 py-2 border">SME IPO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="px-4 py-2 border font-medium">QIB</td><td className="px-4 py-2 border">~50%</td><td className="px-4 py-2 border">कम या वैकल्पिक</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">Retail</td><td className="px-4 py-2 border">~35%</td><td className="px-4 py-2 border">अक्सर 40%+</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">HNI / NII</td><td className="px-4 py-2 border">~15%</td><td className="px-4 py-2 border">मौजूद</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">Market Maker</td><td className="px-4 py-2 border">लागू नहीं</td><td className="px-4 py-2 border">अनिवार्य हिस्सा</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">SME IPO में आमतौर पर लॉट साइज़ बड़ा और लिस्टिंग के बाद लिक्विडिटी कम होती है, जिससे मेनबोर्ड IPO के मुक़ाबले कैटेगरी की व्याख्या अलग हो जाती है।</p>
          </Section>

          <Section id="historical-example" title="ऐतिहासिक IPO उदाहरण - संस्थागत बनाम Retail डिमांड">
            <p>Tempsens Instruments (2026) जैसे हाल के मेनबोर्ड IPO पर विचार करें। इस IPO में QIB सब्सक्रिप्शन 300x से ज़्यादा रहा, जो इसके लगभग 61x के Retail सब्सक्रिप्शन से काफ़ी आगे था, और आख़िरी बिडिंग दिन सभी कैटेगरी में मज़बूत भागीदारी रही।</p>
            <p>भारी Retail ओवरसब्सक्रिप्शन के बावजूद, संस्थागत भागीदारी ने लिस्टिंग सेंटिमेंट को लेकर ज़्यादा भरोसा दिया। यह उदाहरण बताता है कि विश्लेषक अक्सर सिर्फ़ Retail मल्टीपल से ज़्यादा QIB डिमांड को क्यों तरजीह देते हैं।</p>
            <p>ऐतिहासिक उदाहरण दिखाते हैं कि QIB और Retail कैटेगरी में संतुलित डिमांड ज़्यादा स्थिर लिस्टिंग नतीजे देती है।</p>
          </Section>

          <Section id="visual-allocation" title="विज़ुअल अलॉटमेंट ब्रेकडाउन उदाहरण">
            <p>मान लीजिए किसी IPO में अलॉटमेंट के लिए कुल 10 लाख शेयर उपलब्ध हैं:</p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-[#e2e8f0] dark:border-[#252A31]">
                <thead className="bg-[#f8fafc] dark:bg-[#090B0F]">
                  <tr>
                    <th className="text-left px-4 py-2 border">कैटेगरी</th>
                    <th className="text-left px-4 py-2 border">आवंटित शेयर</th>
                    <th className="text-left px-4 py-2 border">सब्सक्रिप्शन</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="px-4 py-2 border font-medium">QIB</td><td className="px-4 py-2 border">5,00,000</td><td className="px-4 py-2 border">12x</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">Retail</td><td className="px-4 py-2 border">3,50,000</td><td className="px-4 py-2 border">25x</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">HNI</td><td className="px-4 py-2 border">1,50,000</td><td className="px-4 py-2 border">80x</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">यह सरल ब्रेकडाउन दिखाता है कि अलॉटमेंट प्रतिशत तय होने के बावजूद हर कैटेगरी में ओवरसब्सक्रिप्शन का स्तर कैसे अलग होता है।</p>
          </Section>

          <Section id="faqs" title="अक्सर पूछे जाने वाले सवाल (निवेशक कैटेगरी)">
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">क्या ज़्यादा QIB सब्सक्रिप्शन लिस्टिंग गेन की गारंटी देता है?</h3>
                <p className="mt-2 text-[#475569] dark:text-[#9AA1AA]">नहीं। मज़बूत QIB डिमांड अक्सर संस्थागत भरोसा दिखाती है, लेकिन लिस्टिंग प्रदर्शन वैल्यूएशन, बाज़ार की स्थिति और कुल डिमांड संतुलन पर निर्भर करता है।</p>
              </div>
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">HNI सब्सक्रिप्शन कभी-कभी इतना ज़्यादा क्यों होता है?</h3>
                <p className="mt-2 text-[#475569] dark:text-[#9AA1AA]">HNI सब्सक्रिप्शन लीवरेज्ड फंडिंग की वजह से बहुत ज़्यादा दिख सकता है, जहाँ निवेशक बड़ी मात्रा में आवेदन के लिए पूंजी उधार लेते हैं।</p>
              </div>
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">क्या Retail अलॉटमेंट पूरी तरह लॉटरी पर आधारित है?</h3>
                <p className="mt-2 text-[#475569] dark:text-[#9AA1AA]">हाँ। ओवरसब्सक्राइब्ड IPO में, वैध Retail आवेदन एक कंप्यूटराइज़्ड लॉटरी सिस्टम में जाते हैं जहाँ आवेदकों के बीच न्यूनतम लॉट निष्पक्ष रूप से बांटे जाते हैं।</p>
              </div>
            </div>
          </Section>

          <Section id="cross-links" title="संबंधित IPO लर्निंग रिसोर्स">
            <p>सब्सक्रिप्शन दूसरे IPO मेट्रिक्स से कैसे जुड़ता है यह समझने के लिए देखें:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
              <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट कैसे होता है</Link></li>
              <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP क्या है</Link></li>
              <li><Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट गाइड</Link></li>
              <li><Link href="/hi/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">एंकर निवेशक लॉक-इन पीरियड</Link></li>
              <li><Link href="/hi/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">Cut-off Price का मतलब</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट प्रोबेबिलिटी कैलकुलेटर</Link></li>
            </ul>
          </Section>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "क्या QIB और Retail निवेशक में फ़र्क़ है?", acceptedAnswer: { "@type": "Answer", text: "QIB संस्थागत निवेशक होते हैं जिन्हें 50% अलॉटमेंट मिलता है, जबकि Retail निवेशक ₹2 लाख तक आवेदन करते हैं और उन्हें 35% अलॉटमेंट मिलता है।" } },
              { "@type": "Question", name: "क्या HNI अलॉटमेंट लॉटरी पर आधारित है?", acceptedAnswer: { "@type": "Answer", text: "नहीं। HNI अलॉटमेंट आवेदन किए गए शेयरों की संख्या के आधार पर आनुपातिक होता है।" } },
              { "@type": "Question", name: "IPO में 20x सब्सक्रिप्शन का क्या मतलब है?", acceptedAnswer: { "@type": "Answer", text: "20x सब्सक्रिप्शन का मतलब है कि निवेशकों ने उस कैटेगरी में उपलब्ध शेयरों से 20 गुना ज़्यादा शेयरों के लिए आवेदन किया है।" } },
              { "@type": "Question", name: "क्या ज़्यादा QIB सब्सक्रिप्शन मज़बूत लिस्टिंग का संकेत है?", acceptedAnswer: { "@type": "Answer", text: "ज़्यादा QIB सब्सक्रिप्शन अक्सर संस्थागत भरोसा दिखाता है, जो लिस्टिंग सेंटिमेंट को सपोर्ट कर सकता है, लेकिन यह लिस्टिंग गेन की गारंटी नहीं है।" } },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}
