import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/kostak-rate-meaning");
const enUrl = canonicalUrl("/kostak-rate-meaning");
const hiUrl = canonicalUrl("/hi/kostak-rate-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO मध्ये कोस्टक दर म्हणजे काय? GMP पेक्षा कसा वेगळा | IPOCraft",
  description:
    "कोस्टक दराचा अर्थ, तो GMP आणि सब्जेक्ट-टू-सौदा यांच्यापेक्षा कसा वेगळा आहे, कोस्टक दर का अस्तित्वात आहेत, आणि त्यातील जोखीम — मराठीत सविस्तर मार्गदर्शक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function KostakRateMarathiPage() {
  return (
    <div
      lang="mr"
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-sm uppercase text-blue-600 font-semibold mb-4">IPO मार्गदर्शक</p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO मध्ये कोस्टक दर म्हणजे काय? GMP पेक्षा फरक ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          कोस्टक दर ही ग्रे मार्केटमधील एक संज्ञा आहे — वाटप होण्याची माहिती मिळण्यापूर्वीच IPO
          अर्जदार आपला संपूर्ण अर्ज दुसऱ्या खरेदीदाराला ज्या निश्चित, एकरकमी किमतीत विकतो, त्याला
          कोस्टक दर म्हणतात. GMP च्या विपरीत, जो फक्त वाटप झालेल्या शेअर्सवरच मिळणारा प्रति-शेअर
          प्रीमियम आहे, कोस्टक डीलची रक्कम वाटपाच्या निकालाची पर्वा न करता दिली जाते.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/hi/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">हिंदी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="what-is-kostak" title="कोस्टक दराचा अर्थ काय आहे?">
            <p>
              ग्रे मार्केटच्या भाषेत, कोस्टक डील म्हणजे तुमचा IPO अर्ज स्वतःच विकणे — त्यावर जे
              काही वाटप होईल त्याचा हक्क — एका निश्चित रकमेला जी आधीच ठरलेली असते. अर्जाला पूर्ण
              वाटप मिळो, अंशतः मिळो, किंवा अजिबात न मिळो, खरेदीदार विक्रेत्याला कोस्टक दर देतो.
            </p>
            <p>
              हे GMP पेक्षा मूलभूतपणे वेगळे आहे, जे फक्त प्रत्यक्ष वाटप झालेल्या शेअरवरच मिळते.
              कोस्टकमध्ये वाटपाची संपूर्ण जोखीम खरेदीदारावर जाते.
            </p>
          </Section>

          <Section title="कोस्टक दर विरुद्ध GMP विरुद्ध सब्जेक्ट-टू-सौदा">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><strong>GMP (Grey Market Premium):</strong> प्रति-शेअर प्रीमियम, फक्त प्रत्यक्ष वाटप झालेल्या शेअर्सवर मिळतो.</li>
              <li><strong>कोस्टक दर:</strong> संपूर्ण अर्जासाठी निश्चित एकरकमी रक्कम, वाटप झाले किंवा नाही.</li>
              <li><strong>सब्जेक्ट-टू-सौदा (STS):</strong> एक संकरित करार — किंमत प्रति लॉट ठरते, पण किमान वाटप मिळाल्यासच तो अमलात येतो; काहीच वाटप न झाल्यास करार रद्द होतो.</li>
            </ul>
            <p>
              हे तिन्ही अनौपचारिक, अनियमित ग्रे मार्केट व्यवस्था आहेत आणि यापैकी कोणालाही
              कोणत्याही एक्स्चेंज, रजिस्ट्रार किंवा SEBI प्रक्रियेकडून मान्यता नाही.
            </p>
          </Section>

          <Section title="कोस्टक दर का अस्तित्वात आहेत">
            <p>
              कोस्टक डीलमुळे अर्जदाराला वाटप जाहीर होण्यापूर्वीच निश्चित नफा मिळवण्याची (किंवा
              तोटा टाळण्याची) संधी मिळते — विशेषतः जेव्हा IPO मोठ्या प्रमाणात ओव्हरसबस्क्राइब
              झालेला असतो आणि वाटपाची शक्यता कमी असते. खरेदीदार असा अंदाज लावतो की अर्जाचे
              अपेक्षित मूल्य (वाटप शक्यता + अपेक्षित लिस्टिंग नफा मिळून) त्याने भरलेल्या कोस्टक
              किमतीपेक्षा जास्त आहे.
            </p>
          </Section>

          <Section id="risks" title="कोस्टक डीलमधील जोखीम">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>पूर्णपणे अनियंत्रित — कोणतेही एक्स्चेंज, एस्क्रो किंवा कायदेशीर संरक्षण यंत्रणा नाही</li>
              <li>प्रतिपक्ष जोखीम: कोणतीही बाजू कोणत्याही उपाययोजनेशिवाय चूक करू शकते</li>
              <li>दर तोंडी ठरतात आणि ब्रोकर/डीलरनुसार मोठ्या प्रमाणात बदलू शकतात</li>
              <li>अधिकृत सबस्क्रिप्शन किंवा वाटप डेटाशी कोणत्याही प्रकारे जोडलेले नाहीत</li>
            </ul>
            <p>IPOCraft कोस्टक व्यवहार सुलभ, पडताळणी किंवा समर्थन करत नाही. हे पान फक्त गुंतवणूकदारांना ही संज्ञा समजावण्यासाठी आहे.</p>
          </Section>

          <Section id="faqs" title="वारंवार विचारले जाणारे प्रश्न">
            <h3 className="font-semibold mt-4">कोस्टक दर आणि GMP एकच आहेत का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">नाही. GMP वाटप झालेल्या शेअर्सवर मिळणारा प्रति-शेअर प्रीमियम आहे; कोस्टक वाटपाच्या निकालाची पर्वा न करता संपूर्ण अर्जासाठी दिली जाणारी एकरकमी रक्कम आहे.</p>
            <h3 className="font-semibold mt-4">कोस्टक व्यवहारांमध्ये सहभाग घेणे कायदेशीर आहे का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">कोस्टक व्यवहार अधिकृत एक्स्चेंज यंत्रणेबाहेरील अनौपचारिक ग्रे-मार्केट व्यवस्था आहेत. त्यांना कोणतीही नियामक मान्यता किंवा संरक्षण नाही.</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO मार्गदर्शक">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP म्हणजे काय</Link></li>
              <li><Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट मार्गदर्शक</Link></li>
              <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
              <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप कसे होते</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवळ माहितीच्या उद्देशाने हा मजकूर पुरवतो आणि SEBI कडे नोंदणीकृत नाही. ग्रे
          मार्केट क्रिया अनधिकृत आणि जोखमीची असते — तिला गुंतवणूक सल्ला समजू नये.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO मध्ये कोस्टक दर म्हणजे काय? GMP पेक्षा फरक",
            description: "कोस्टक दर, GMP आणि सब्जेक्ट-टू-सौदा यांच्यातील फरक, आणि ग्रे मार्केट व्यवहारांतील जोखीम स्पष्ट केली आहे.",
            author: { "@type": "Organization", name: "IPOCraft Research Team" },
            publisher: { "@type": "Organization", name: "IPOCraft", logo: { "@type": "ImageObject", url: "https://ipocraft.com/logo2.png" } },
            datePublished: `${CURRENT_YEAR}-01-01`,
            dateModified: new Date().toISOString(),
            mainEntityOfPage: { "@type": "WebPage", "@id": mrUrl },
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
              { "@type": "Question", name: "कोस्टक दर म्हणजे काय?", acceptedAnswer: { "@type": "Answer", text: "कोस्टक दर म्हणजे ती निश्चित, एकरकमी ग्रे मार्केट रक्कम जिच्यावर IPO अर्जदार वाटपाच्या निकालाची पर्वा न करता आपला संपूर्ण अर्ज खरेदीदाराला विकतो." } },
              { "@type": "Question", name: "कोस्टक दर आणि GMP एकच आहेत का?", acceptedAnswer: { "@type": "Answer", text: "नाही, GMP प्रति-शेअर प्रीमियम आहे जो फक्त वाटप झालेल्या शेअर्सवर मिळतो, तर कोस्टक संपूर्ण अर्जासाठी एकरकमी रक्कम आहे." } },
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
