import Link from "next/link";
import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/ipo-grey-market-guide");
const enUrl = canonicalUrl("/ipo-grey-market-guide");
const hiUrl = canonicalUrl("/hi/ipo-grey-market-guide");

export const metadata: Metadata = {
  title: "IPO ग्रे मार्केट मार्गदर्शक - संपूर्ण माहिती (Authority Edition) | IPOCraft",
  description:
    "GMP कसा तयार होतो, तो लिस्टिंग कामगिरीशी कसा जोडलेला असतो, ऐतिहासिक पॅटर्न, SME विरुद्ध मेनबोर्ड फरक, आणि संभाव्यतेचा योग्य अर्थ — मराठीत सविस्तर मार्गदर्शक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function IpoGreyMarketGuideMarathiPage() {
  const lastUpdatedISO = "2026-08-27T00:00:00.000Z";
  const lastUpdatedReadable = "27 ऑगस्ट 2026";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "लिस्टिंग नफ्याचा अंदाज घेण्यासाठी IPO GMP अचूक आहे का?", acceptedAnswer: { "@type": "Answer", text: "GMP बाजाराची भावना दर्शवते पण लिस्टिंग किंमतीची हमी देत नाही. सबस्क्रिप्शन डेटा, संस्थात्मक मागणी आणि व्यापक बाजार परिस्थितीसोबत त्याचे विश्लेषण करावे." } },
      { "@type": "Question", name: "SME IPO GMP अधिक अस्थिर का असतो?", acceptedAnswer: { "@type": "Answer", text: "SME IPO मध्ये इश्यू आकार लहान आणि तरलता कमी असते, ज्यामुळे ग्रे मार्केटमधील भावना-आधारित चढ-उतार वाढतात." } },
      { "@type": "Question", name: "जास्त GMP म्हणजे नेहमी ओव्हरसबस्क्रिप्शन असते का?", acceptedAnswer: { "@type": "Answer", text: "जास्त GMP अनेकदा मजबूत सबस्क्रिप्शनशी जुळते, पण नेहमी नाही. संस्थात्मक सहभाग आणि बाजाराचे वातावरणही महत्त्वाची भूमिका बजावतात." } },
      { "@type": "Question", name: "ग्रे मार्केट ट्रेडिंग कायदेशीर आहे का?", acceptedAnswer: { "@type": "Answer", text: "ग्रे मार्केट क्रिया अधिकृत एक्स्चेंज प्रणालीबाहेर चालते आणि ती नियंत्रित नाही. गुंतवणूकदारांनी GMP ला फक्त भावना निर्देशक म्हणून पाहावे." } },
      { "@type": "Question", name: "गुंतवणूकदारांनी GMP चा जबाबदारीने वापर कसा करावा?", acceptedAnswer: { "@type": "Answer", text: "GMP चा वापर संभाव्य भावना संकेत म्हणून करावा, हमखास लिस्टिंग अंदाज म्हणून नाही. याला सबस्क्रिप्शन ताकद आणि जोखीम व्यवस्थापन तत्त्वांसोबत जोडून पाहावे." } },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IPO ग्रे मार्केट मार्गदर्शक - संपूर्ण माहिती",
    dateModified: lastUpdatedISO,
    inLanguage: "mr",
    author: { "@type": "Organization", name: "IPOCraft" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "IPO ग्रे मार्केट मार्गदर्शक", item: mrUrl },
    ],
  };

  return (
    <div lang="mr" className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            शैक्षणिक संशोधन मार्गदर्शक
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
            IPO ग्रे मार्केट मार्गदर्शक - संपूर्ण माहिती
          </h1>
          <p className="mt-4 text-sm sm:text-[14.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
            IPO ग्रे मार्केट लिस्टिंगपूर्वी गुंतवणूकदारांच्या अपेक्षांना आकार देण्यात एक शक्तिशाली
            मानसिक भूमिका बजावते. हे मार्गदर्शक स्पष्ट करते की Grey Market Premium (GMP) कसा तयार
            होतो, तो लिस्टिंग कामगिरीशी कसा संबंधित आहे, ऐतिहासिक वर्तणुकीचे नमुने, SME मधील फरक
            आणि निश्चिततेऐवजी संभाव्यतेचा अर्थ कसा लावायचा.
          </p>
          <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
            Also available in{" "}
            <Link href="/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
            and{" "}
            <Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">हिंदी</Link>.
          </p>
          <p className="mt-3 text-xs text-gray-500 dark:text-[#6B7280]">शेवटचे अद्ययावत: {lastUpdatedReadable}</p>
        </div>
      </section>

      <div className="sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border-b border-gray-200 dark:border-[#252A31]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm flex flex-wrap gap-4">
          <a href="#how-it-works" className="text-blue-600 dark:text-blue-400 hover:underline">हे कसे काम करते</a>
          <a href="#case-study" className="text-blue-600 dark:text-blue-400 hover:underline">केस स्टडी</a>
          <a href="#historical" className="text-blue-600 dark:text-blue-400 hover:underline">ऐतिहासिक नमुने</a>
          <a href="#correlation" className="text-blue-600 dark:text-blue-400 hover:underline">सहसंबंध सारणी</a>
          <a href="#probability" className="text-blue-600 dark:text-blue-400 hover:underline">संभाव्यता तर्कशास्त्र</a>
          <a href="#sme" className="text-blue-600 dark:text-blue-400 hover:underline">SME विरुद्ध मेनबोर्ड</a>
          <a href="#gmp-trend" className="text-blue-600 dark:text-blue-400 hover:underline">GMP ट्रेंड उदाहरण</a>
          <a href="#faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQs</a>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <Section id="how-it-works" title="IPO ग्रे मार्केट कसे कार्य करते">
          <p>कंपनी शेअर बाजारात सूचीबद्ध होण्यापूर्वी IPO ग्रे मार्केट अनौपचारिकपणे चालते. सहभागी इश्यू किमतीपेक्षा प्रीमियम (किंवा सवलतीत) दराने शेअर्सचा व्यवहार करण्यास सहमत असतात. हा प्रीमियम लिस्टिंगच्या मागणीबद्दलच्या सामूहिक अपेक्षा दर्शवतो.</p>
          <p>GMP सबस्क्रिप्शन गती, संस्थात्मक सहभाग, अँकर गुंतवणूकदारांचा आत्मविश्वास, क्षेत्रातील ट्रेंड आणि एकूण बाजार परिस्थितीमुळे प्रभावित होतो. एक्सचेंज किंमतीच्या विपरीत, ग्रे मार्केट किंमत भावना-आधारित असते.</p>
          <p>हे समजून घेणे महत्त्वाचे आहे की GMP हमीशीर किंमत दर्शवत नाही. तो मागणीच्या संकेतांवर आधारित अंदाजित संभाव्यता दर्शवतो.</p>
        </Section>

        <Section id="case-study" title="वास्तववादी IPO केस स्टडी">
          <p>₹150 किंमतीचा एक IPO विचारात घ्या. लिस्टिंगपूर्वी, एकूण सबस्क्रिप्शन 100x ओलांडल्यामुळे आणि QIB भाग मोठ्या प्रमाणात ओव्हरसबस्क्राइब झाल्यामुळे GMP हळूहळू ₹20 वरून ₹55 पर्यंत वाढतो. लिस्टिंगच्या दिवशी, स्टॉक ₹198 वर उघडतो — जो GMP च्या अपेक्षित किमतीच्या जवळ असतो.</p>
          <p>याउलट, ₹60 GMP असलेला पण कमकुवत संस्थात्मक मागणी असलेला दुसरा IPO फक्त ₹170 वर लिस्ट होतो. हे दर्शवते की संस्थात्मक सहभाग सहसंबंधाची विश्वासार्हता वाढवतो.</p>
        </Section>

        <Section id="historical" title="ऐतिहासिक GMP विरुद्ध लिस्टिंग वर्तन">
          <p>ऐतिहासिकदृष्ट्या, मजबूत QIB सबस्क्रिप्शन (अनेकदा 20x पेक्षा जास्त) असलेले IPO GMP आणि लिस्टिंग किंमतीत जवळचे साम्य दाखवतात. जेव्हा सबस्क्रिप्शन Retail-केंद्रित असते पण संस्थात्मक मागणी कमकुवत असते, तेव्हा लिस्टिंग किंमत मोठ्या प्रमाणात वेगळी होऊ शकते.</p>
          <p>लिस्टिंगच्या दिवसापूर्वीची बाजारातील अस्थिरता देखील निकालांवर परिणाम करते. अचानक निर्देशांक सुधारणा मजबूत GMP असूनही लिस्टिंग नफा कमी करू शकते.</p>
        </Section>

        <Section id="correlation" title="GMP विरुद्ध लिस्टिंग सहसंबंध सारणी">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#e2e8f0] dark:border-[#252A31] text-sm">
              <thead className="bg-[#f1f5f9] dark:bg-[#171B20]">
                <tr>
                  <th className="p-3 border">परिस्थिती</th>
                  <th className="p-3 border">GMP ट्रेंड</th>
                  <th className="p-3 border">सबस्क्रिप्शन प्रोफाइल</th>
                  <th className="p-3 border">लिस्टिंग जुळणी</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-3 border">प्रबळ संस्थात्मक मागणी</td><td className="p-3 border">वाढती</td><td className="p-3 border">QIB 20x+</td><td className="p-3 border">उच्च शक्यता जुळणी</td></tr>
                <tr><td className="p-3 border">केवळ Retail-आधारित</td><td className="p-3 border">उंच पण अस्थिर</td><td className="p-3 border">कमकुवत QIB</td><td className="p-3 border">अनिश्चित</td></tr>
                <tr><td className="p-3 border">बाजार सुधारणा</td><td className="p-3 border">स्थिर</td><td className="p-3 border">प्रबळ</td><td className="p-3 border">GMP पेक्षा कमी कामगिरी होऊ शकते</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="probability" title="संभाव्यता अर्थ लावण्याची रणनीती">
          <p>GMP ला निश्चित अंदाजाऐवजी संभाव्यता संकेत म्हणून पाहिले पाहिजे. अनेक दिवस वाढणारा GMP ट्रेंड + मजबूत QIB सबस्क्रिप्शन + स्थिर व्यापक बाजार = लिस्टिंग जुळणीची जास्त शक्यता.</p>
          <p>लिस्टिंगपूर्वी घसरणारा GMP कमकुवत होत जाणाऱ्या भावनांचे संकेत असू शकतो. गुंतवणूकदारांनी एका दिवसाच्या प्रीमियम मूल्याऐवजी ट्रेंडच्या दिशेवर लक्ष केंद्रित केले पाहिजे.</p>
        </Section>

        <Section id="sme" title="SME विरुद्ध मेनबोर्ड ग्रे मार्केट वर्तन">
          <p>SME IPO मध्ये साधारणपणे इश्यू आकार लहान आणि गुंतवणूकदारांचा गट मर्यादित असतो. यामुळे अनेकदा GMP मध्ये तीव्र वाढ आणि घट होते. मेनबोर्ड IPO, व्यापक सहभागामुळे, तुलनेने सौम्य भावना निर्माण दाखवतात.</p>
          <p>लिस्टिंगनंतर SME ची तरलता कमी असल्याने, किंमतीतील चढ-उतार कोणत्याही दिशेने GMP च्या अपेक्षांपेक्षा जास्त असू शकतात.</p>
        </Section>

        <Section id="gmp-trend" title="GMP ट्रेंड उदाहरण (दृश्य स्पष्टीकरण)">
          <p>खाली एक सोपे स्पष्टीकरण आहे की मजबूत सबस्क्रिप्शन गतीदरम्यान GMP कसा वरच्या दिशेने जाऊ शकतो.</p>
          <div className="mt-6 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 400 180" className="w-full max-w-md mx-auto">
              <polyline fill="none" stroke="#1C317A" strokeWidth="3" points="10,150 80,120 150,90 220,70 300,40 380,30" />
              <text x="10" y="165" fontSize="10" fill="#64748b">दिवस 1</text>
              <text x="150" y="165" fontSize="10" fill="#64748b">मध्य सबस्क्रिप्शन</text>
              <text x="320" y="165" fontSize="10" fill="#64748b">लिस्टिंगपूर्व</text>
            </svg>
          </div>
          <p className="mt-4">अनेक दिवस वाढणारा GMP ट्रेंड बहुतेकदा वाढत्या मागणी दृश्यमानतेशी जुळतो. तथापि, अचानक उलटफेर भावना बदलाचे संकेत देऊ शकतात.</p>
        </Section>

        <Section id="faq" title="वारंवार विचारले जाणारे प्रश्न">
          <div className="space-y-4">
            {[
              { q: "लिस्टिंग नफ्याच्या अंदाजासाठी IPO GMP विश्वसनीय आहे का?", a: "GMP भावना दर्शवते पण लिस्टिंग कामगिरीची हमी देत नाही. सबस्क्रिप्शन ताकद आणि बाजार परिस्थितीसोबत त्याचा विचार करावा." },
              { q: "SME IPO मध्ये GMP मध्ये जास्त चढ-उतार का दिसतात?", a: "SME IPO मध्ये तरलता कमी आणि इश्यू आकार लहान असतो, ज्यामुळे भावना-आधारित हालचाली वाढतात." },
              { q: "गुंतवणूकदारांनी फक्त GMP वरच अवलंबून राहावे का?", a: "नाही. GMP हे संभाव्यतेचे निर्देशक आहे, निश्चिततेचे संकेत नाही. संस्थात्मक सबस्क्रिप्शन आणि व्यापक बाजार स्थिरता महत्त्वाची आहे." },
            ].map((item, index) => (
              <details key={index} className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 group">
                <summary className="cursor-pointer font-medium text-[#0f172a] dark:text-[#F1F5F9]">{item.q}</summary>
                <p className="mt-3 text-sm text-[#475569] dark:text-[#9AA1AA] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section title="आणखी वाचा">
          <ul className="list-disc pr-6 pl-6 space-y-2 text-sm">
            <li><Link href="/mr/gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO GMP ट्रॅकर</Link></li>
            <li><Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO कॅलेंडर</Link></li>
            <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO वाटप मार्गदर्शक</Link></li>
            <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO GMP म्हणजे काय</Link></li>
            <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
            <li><Link href="/mr/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 hover:underline">कोस्तक दर म्हणजे काय</Link></li>
            <li><Link href="/mr/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 hover:underline">अँकर गुंतवणूकदार लॉक-इन कालावधी</Link></li>
            <li><Link href="/ipo-profit-calculator" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO लिस्टिंग नफा कॅल्क्युलेटर</Link></li>
          </ul>
        </Section>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft हे एक माहितीपूर्ण व्यासपीठ आहे आणि ते SEBI कडे नोंदणीकृत नाही. सामग्री केवळ शैक्षणिक उद्देशासाठी आहे आणि ती गुंतवणूक सल्ला नाही.
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
