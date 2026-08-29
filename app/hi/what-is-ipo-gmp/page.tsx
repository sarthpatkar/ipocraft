import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/what-is-ipo-gmp");
const enUrl = canonicalUrl("/what-is-ipo-gmp");
const mrUrl = canonicalUrl("/mr/what-is-ipo-gmp");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO GMP क्या है? Grey Market Premium का अर्थ, गणना और जोखिम | IPOCraft",
  description:
    "IPO GMP (Grey Market Premium) क्या है, इसकी गणना कैसे होती है, यह रोज़ क्यों बदलता है, और निवेशक इससे लिस्टिंग गेन का अंदाज़ा कैसे लगाते हैं — हिंदी में पूरी गाइड।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function WhatIsIpoGmpHindiPage() {
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
          IPO GMP क्या है? Grey Market Premium का अर्थ, गणना और जोखिम ({CURRENT_YEAR} गाइड)
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPO GMP का मतलब ग्रे मार्केट प्रीमियम है। यह उस प्रीमियम को संदर्भित करता है जिस पर IPO
          शेयरों का स्टॉक एक्सचेंज में लिस्टिंग से पहले अनौपचारिक रूप से कारोबार किया जाता है।
          निवेशक संभावित लिस्टिंग लाभ का अनुमान लगाने के लिए IPO GMP को ट्रैक करते हैं, लेकिन यह
          समझना महत्वपूर्ण है कि ग्रे मार्केट विनियमित नहीं है और आधिकारिक एक्सचेंजों के बाहर
          संचालित होता है।
        </p>

        <p className="mt-4 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPOCraft पर, निवेशक सदस्यता डेटा और{" "}
          <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
            IPO कैलेंडर
          </Link>{" "}
          टाइमलाइन के साथ{" "}
          <Link href="/hi/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            GMP डेटा
          </Link>{" "}
          की निगरानी कर सकते हैं। हालाँकि, GMP की हमेशा सावधानी से व्याख्या की जानी चाहिए और इसे
          गारंटीकृत लिस्टिंग प्रदर्शन के रूप में नहीं माना जाना चाहिए।
        </p>

        <p className="mt-4 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <div className="mt-8 sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-3 uppercase tracking-wide">
            इस पेज पर
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <a href="#what-is-gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO GMP क्या है</a>
            <a href="#calculation" className="text-[#1C317A] dark:text-blue-400 hover:underline">GMP की गणना कैसे होती है</a>
            <a href="#reliability" className="text-[#1C317A] dark:text-blue-400 hover:underline">क्या GMP भरोसेमंद है?</a>
            <a href="#mainboard-vs-sme" className="text-[#1C317A] dark:text-blue-400 hover:underline">मेनबोर्ड बनाम SME</a>
            <a href="#strategies" className="text-[#1C317A] dark:text-blue-400 hover:underline">उन्नत रणनीतियाँ</a>
            <a href="#faqs" className="text-[#1C317A] dark:text-blue-400 hover:underline">FAQs</a>
          </div>
        </div>

        <div className="mt-10 space-y-12">
          <Section id="what-is-gmp" title="IPO GMP क्या है?">
            <p>
              IPO GMP अनौपचारिक ग्रे मार्केट में IPO इश्यू मूल्य से अधिक वह राशि है जो निवेशक
              भुगतान करने के लिए तैयार हैं। उदाहरण के लिए, यदि IPO मूल्य बैंड ₹100 से ₹110 है और
              GMP ₹25 है, तो अपेक्षित लिस्टिंग मूल्य लगभग ₹135 हो सकता है।
            </p>
            <p>
              ग्रे मार्केट लेनदेन लिस्टिंग से पहले होते हैं और मांग, अटकलों और बाजार की धारणा पर
              आधारित होते हैं। ये सौदे खरीदारों और विक्रेताओं के बीच निजी समझौते होते हैं।
            </p>
          </Section>

          <Section id="calculation" title="IPO GMP की गणना कैसे की जाती है">
            <p>अनुमानित लिस्टिंग मूल्य निकालने का सामान्य फॉर्मूला है:</p>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium text-[#0f172a] dark:text-[#F1F5F9]">
              अनुमानित लिस्टिंग मूल्य = इश्यू मूल्य + GMP
            </div>
            <p className="mt-4">
              उदाहरण: इश्यू मूल्य ₹110, GMP ₹25, अनुमानित लिस्टिंग मूल्य लगभग ₹135 है।
            </p>
            <p>यह सूत्र केवल एक सांकेतिक अनुमान प्रदान करता है, गारंटीकृत परिणाम नहीं।</p>
          </Section>

          <Section title="IPO GMP हर दिन क्यों बदलता है">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>बाजार की धारणा और समग्र सूचकांक की गतिविधि</li>
              <li>सदस्यता स्तर (Retail, HNI, QIB मांग)</li>
              <li>एंकर निवेशक भागीदारी</li>
              <li>कंपनी की बुनियादी बातें और सेक्टर का दृष्टिकोण</li>
              <li>समाचार और व्यापक आर्थिक कारक</li>
            </ul>
            <p>
              उच्च सदस्यता, विशेष रूप से QIB या HNI से, GMP को सकारात्मक रूप से प्रभावित कर सकती
              है। हालाँकि, यदि व्यापक बाजार नकारात्मक हो जाते हैं तो GMP जल्दी उलट सकता है।
            </p>
          </Section>

          <Section title="निवेशक IPO GMP का उपयोग कैसे करते हैं">
            <p>
              निवेशक आवेदन करने से पहले अक्सर GMP की तुलना आधिकारिक सदस्यता डेटा से करते हैं। आप{" "}
              <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO कैलेंडर
              </Link>{" "}
              का उपयोग करके आगामी IPO समयसीमा ट्रैक कर सकते हैं और व्यक्तिगत IPO पृष्ठों के माध्यम
              से IPO विवरणों का विश्लेषण कर सकते हैं।
            </p>
            <p>
              GMP का उपयोग आमतौर पर अल्पकालिक लिस्टिंग लाभों का अनुमान लगाने के लिए किया जाता है।
              दीर्घकालिक निवेशक आमतौर पर ग्रे मार्केट के रुझानों की तुलना में कंपनी की बुनियादी
              बातों पर अधिक ध्यान केंद्रित करते हैं।
            </p>
          </Section>

          <Section id="reliability" title="क्या IPO GMP भरोसेमंद है?">
            <p>
              IPO GMP अनौपचारिक और अनुमान-आधारित है। यह SEBI या स्टॉक एक्सचेंजों द्वारा विनियमित नहीं है।
              हालांकि यह भावना का संकेत दे सकता है, वास्तविक लिस्टिंग कीमतें काफी भिन्न हो सकती
              हैं।
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2 mt-3">
              <li>ग्रे मार्केट लेनदेन निजी और अनियमित होते हैं</li>
              <li>कोई आधिकारिक रिपोर्टिंग या गारंटी मौजूद नहीं है</li>
              <li>लिस्टिंग से पहले कीमतों में तेज़ी से उतार-चढ़ाव हो सकता है</li>
            </ul>
          </Section>

          <Section title="IPO GMP और सब्सक्रिप्शन डेटा के बीच अंतर">
            <p>
              सब्सक्रिप्शन डेटा Retail निवेशकों, HNI और QIB से आधिकारिक मांग को दर्शाता है। यह IPO
              बोली अवधि के दौरान एक्सचेंजों द्वारा जारी किया जाता है।
            </p>
            <p>
              दूसरी ओर, GMP अनौपचारिक बाजार की भावना को दर्शाता है। दोनों का संयोजन मांग के रुझानों
              को समझने के लिए बेहतर संदर्भ प्रदान करता है।
            </p>
          </Section>

          <Section title="ग्रे मार्केट प्रीमियम के जोखिम">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>अनियमित व्यापारिक माहौल</li>
              <li>निजी लेन-देन में प्रतिपक्ष जोखिम</li>
              <li>अचानक कीमत में सुधार की संभावना</li>
              <li>अल्पकालिक अटकलों पर अत्यधिक निर्भरता</li>
            </ul>
          </Section>

          <Section title="वास्तविक दुनिया का IPO GMP केस स्टडी">
            <p>
              एक काल्पनिक IPO पर विचार करें जिसकी कीमत ₹150 है और लिस्टिंग से पहले ग्रे मार्केट
              प्रीमियम ₹40 है। बाजार की धारणा मजबूत थी, सब्सक्रिप्शन 50 गुना पार कर गया, और
              संस्थागत भागीदारी उच्च थी।
            </p>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium text-[#0f172a] dark:text-[#F1F5F9]">
              अनुमानित लिस्टिंग मूल्य = ₹150 + ₹40 = ₹190
            </div>
            <p className="mt-4">
              लिस्टिंग के दिन, स्टॉक ₹185 पर खुला, जो अनुमानित GMP मूल्य से थोड़ा कम था। यह दर्शाता
              है कि जबकि GMP भावना को दर्शाता है, वास्तविक लिस्टिंग मूल्य व्यापक बाजार तरलता और
              मूल्य खोज के दौरान अंतिम मांग पर निर्भर करता है।
            </p>
          </Section>

          <Section title="ऐतिहासिक GMP बनाम वास्तविक लिस्टिंग तुलना">
            <p>
              ऐतिहासिक रूप से, IPO GMP अक्सर लिस्टिंग की गति को ट्रैक करता है लेकिन पूरी सटीकता के
              साथ नहीं। तेजी वाले बाजारों में, मजबूत GMP वाले IPO अक्सर GMP-समायोजित अपेक्षाओं के
              करीब या उससे थोड़ा नीचे सूचीबद्ध होते हैं।
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>मजबूत QIB मांग GMP रुझानों को मान्य करती है</li>
              <li>कमजोर द्वितीयक बाजार की भावना लिस्टिंग लाभ को कम कर सकती है</li>
              <li>अत्यधिक गरम GMP लिस्टिंग के दिन सामान्य हो सकता है</li>
            </ul>
            <p>
              इसलिए, GMP की व्याख्या सदस्यता अनुपात और क्षेत्र के दृष्टिकोण के साथ की जानी चाहिए,
              अकेले नहीं।
            </p>
          </Section>

          <Section id="mainboard-vs-sme" title="मेनबोर्ड और SME IPO GMP के बीच अंतर">
            <p>
              SME IPO में आमतौर पर मेनबोर्ड IPO की तुलना में कम इश्यू आकार और सीमित तरलता होती है।
              नतीजतन, SME IPO GMP अधिक अस्थिर और भावना-संचालित हो सकता है।
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>SME IPO GMP लिस्टिंग के पास तेज़ी से घट-बढ़ सकता है</li>
              <li>SME IPO में लॉट का आकार आमतौर पर बड़ा होता है</li>
              <li>लिस्टिंग के बाद तरलता मूल्य स्थिरता को प्रभावित कर सकती है</li>
            </ul>
            <p>
              SME IPO GMP पर नज़र रखने वाले निवेशकों को मेनबोर्ड IPO की तुलना में कम तरलता और व्यापक
              स्प्रेड के लिए तैयार रहना चाहिए।
            </p>
          </Section>

          <Section id="strategies" title="उन्नत व्याख्या रणनीतियाँ">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>एकल मान के बजाय कई दिनों में GMP प्रवृत्ति की तुलना करें</li>
              <li>सदस्यता की गति के साथ दोबारा जांच करें (Retail बनाम QIB)</li>
              <li>एंकर निवेशक आवंटन की निगरानी करें</li>
              <li>लिस्टिंग से पहले व्यापक बाज़ार की दिशा का मूल्यांकन करें</li>
            </ul>
            <p>पेशेवर निवेशक GMP को एक मूल्यांकन मॉडल नहीं, बल्कि एक भावना संकेतक के रूप में मानते हैं।</p>
          </Section>

          <Section title="डेटा स्रोत पारदर्शिता">
            <p>
              IPOCraft सार्वजनिक रूप से उपलब्ध एक्सचेंज फाइलिंग और रजिस्ट्रार खुलासों से IPO
              समयरेखा, सदस्यता अपडेट और लिस्टिंग जानकारी एकत्रित करता है। ग्रे मार्केट प्रीमियम के
              आंकड़े अनौपचारिक बाजार की भावना को दर्शाते हैं और केवल सूचनात्मक उद्देश्यों के लिए
              प्रस्तुत किए जाते हैं।
            </p>
            <p>
              उपयोगकर्ताओं को वित्तीय निर्णय लेने से पहले आधिकारिक स्टॉक एक्सचेंज घोषणाओं के साथ
              सीधे विवरणों को सत्यापित करने के लिए प्रोत्साहित किया जाता है।
            </p>
          </Section>

          <Section title="वर्तमान IPO जहाँ GMP ट्रैक किया जा रहा है">
            <p>
              ग्रे मार्केट प्रीमियम तभी सार्थक होता है जब इसे लाइव IPO डेटा के साथ देखा जाए। आप{" "}
              <Link href="/ipo" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO लिस्टिंग पेज
              </Link>{" "}
              पर वर्तमान में सक्रिय सार्वजनिक इश्यू देख सकते हैं और{" "}
              <Link href="/hi/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO GMP ट्रैकर
              </Link>{" "}
              के माध्यम से वास्तविक समय की भावना की निगरानी कर सकते हैं।
            </p>
            <p>
              लाइव सब्सक्रिप्शन मांग, मूल्य बैंड और ग्रे मार्केट की गतिविधि की तुलना करने से GMP को
              अलग-थलग देखने की तुलना में बेहतर संदर्भ मिलता है।
            </p>
          </Section>

          <Section id="faqs" title="अक्सर पूछे जाने वाले सवाल (FAQs)">
            <h3 className="font-semibold mt-4">सकारात्मक GMP क्या दर्शाता है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              एक सकारात्मक GMP से पता चलता है कि निवेशक उम्मीद करते हैं कि IPO इश्यू मूल्य से ऊपर
              सूचीबद्ध होगा।
            </p>

            <h3 className="font-semibold mt-4">क्या IPO GMP नकारात्मक हो सकता है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              हाँ। नकारात्मक GMP इश्यू मूल्य से नीचे अपेक्षित लिस्टिंग का संकेत देता है।
            </p>

            <h3 className="font-semibold mt-4">क्या IPO GMP कानूनी है?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              ग्रे मार्केट गतिविधि अनौपचारिक रूप से मौजूद है। यह आधिकारिक एक्सचेंज तंत्र का हिस्सा
              नहीं है।
            </p>

            <h3 className="font-semibold mt-4">GMP के लाइव अपडेट कहां देखे जा सकते हैं?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              आप{" "}
              <Link href="/hi/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO GMP ट्रैकर
              </Link>{" "}
              पर अपडेटेड मूल्य देख सकते हैं।
            </p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO लर्निंग रिसोर्स">
            <p>GMP सदस्यता, अलॉटमेंट और कैटेगरी मांग से कैसे जुड़ता है, इस बारे में गहराई से जानने के लिए, देखें:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट गाइड</Link></li>
              <li><Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सब्सक्रिप्शन का मतलब</Link></li>
              <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट कैसे होता है</Link></li>
              <li><Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB बनाम HNI बनाम Retail</Link></li>
              <li><Link href="/hi/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">कोस्तक रेट क्या है</Link></li>
              <li><Link href="/ipo-profit-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO लिस्टिंग प्रॉफिट कैलकुलेटर</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवल जानकारी प्रदान करता है और SEBI के साथ पंजीकृत नहीं है। IPO GMP अनौपचारिक
          बाजार जानकारी है और इसे निवेश सलाह नहीं माना जाना चाहिए। निवेशकों को आधिकारिक एक्सचेंज
          फाइलिंग से विवरण सत्यापित करना चाहिए और योग्य सलाहकारों से परामर्श करना चाहिए।
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO GMP क्या है? Grey Market Premium का अर्थ, गणना और जोखिम",
            description:
              "IPO Grey Market Premium की पूरी व्याख्या, गणना, ऐतिहासिक तुलना, SME अंतर और जोखिम — हिंदी में।",
            inLanguage: "hi",
            author: { "@type": "Organization", name: "IPOCraft Research Team" },
            publisher: {
              "@type": "Organization",
              name: "IPOCraft",
              logo: { "@type": "ImageObject", url: "https://ipocraft.com/logo2.png" },
            },
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
              {
                "@type": "Question",
                name: "सकारात्मक GMP क्या दर्शाता है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "एक सकारात्मक GMP से पता चलता है कि निवेशक उम्मीद करते हैं कि IPO इश्यू मूल्य से ऊपर सूचीबद्ध होगा।",
                },
              },
              {
                "@type": "Question",
                name: "क्या IPO GMP नकारात्मक हो सकता है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "हाँ। नकारात्मक GMP इश्यू मूल्य से नीचे अपेक्षित लिस्टिंग का संकेत देता है।",
                },
              },
              {
                "@type": "Question",
                name: "क्या IPO GMP कानूनी है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ग्रे मार्केट गतिविधि अनौपचारिक रूप से मौजूद है और यह आधिकारिक एक्सचेंज तंत्र का हिस्सा नहीं है।",
                },
              },
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
