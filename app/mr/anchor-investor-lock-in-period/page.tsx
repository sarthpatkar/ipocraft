import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/anchor-investor-lock-in-period");
const enUrl = canonicalUrl("/anchor-investor-lock-in-period");
const hiUrl = canonicalUrl("/hi/anchor-investor-lock-in-period");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO मध्ये अँकर गुंतवणूकदार लॉक-इन कालावधी म्हणजे काय? नियम आणि महत्त्व | IPOCraft",
  description:
    "अँकर गुंतवणूकदार लॉक-इन कालावधी म्हणजे काय, SEBI चे 30/90 दिवसांचे नियम, आणि लॉक-इन संपण्याची तारीख शेअरच्या किंमतीवर का परिणाम करते — मराठीत समजून घ्या.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function AnchorLockInMarathiPage() {
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
          IPO मध्ये अँकर गुंतवणूकदार लॉक-इन कालावधी: नियम आणि महत्त्व ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          अँकर गुंतवणूकदार — मोठे संस्थात्मक गुंतवणूकदार ज्यांना IPO उघडण्याच्या एक दिवस आधी
          शेअर्स वाटप होतात — त्यांना SEBI च्या नियमांनुसार ठराविक कालावधीसाठी ते शेअर्स विकता
          येत नाहीत. या <strong>अँकर गुंतवणूकदार लॉक-इन कालावधी</strong>वर बारकाईने लक्ष ठेवले
          जाते, कारण तो संपल्यावर नव्याने सूचीबद्ध झालेल्या शेअरमध्ये विक्रीची लाट आणि किंमतीत
          अस्थिरता येऊ शकते.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/hi/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">हिंदी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="who" title="अँकर गुंतवणूकदार कोण असतात?">
            <p>
              अँकर गुंतवणूकदार म्हणजे Qualified Institutional Buyers (QIB) — म्युच्युअल फंड, विमा
              कंपन्या, परदेशी पोर्टफोलिओ गुंतवणूकदार यांसारख्या मोठ्या संस्था — ज्यांना IPO चा
              काही भाग, इश्यू सर्वसामान्य जनतेसाठी उघडण्याच्या एक दिवस आधी, इश्यूअरने ठरवलेल्या
              किंमतीवर वाटप केला जातो.
            </p>
          </Section>

          <Section id="rules" title="SEBI चा अँकर लॉक-इन नियम">
            <p>सध्याच्या SEBI ICDR नियमांनुसार, अँकर गुंतवणूकदारांचे शेअर्स वाटप तारखेपासून दोन टप्प्यांत लॉक-इन असतात:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><strong>50% अँकर वाटप</strong> — 90 दिवसांचा लॉक-इन</li>
              <li><strong>उर्वरित 50%</strong> — 30 दिवसांचा लॉक-इन</li>
            </ul>
            <p>
              SEBI हे लॉक-इन नियम याआधीही बदलले आहेत आणि पुन्हा बदलू शकतात — नेहमी विशिष्ट IPO च्या
              RHP आणि नवीनतम SEBI परिपत्रकातून अचूक टप्पा विभागणी तपासा.
            </p>
          </Section>

          <Section title="गुंतवणूकदारांसाठी लॉक-इन संपण्याची तारीख का महत्त्वाची आहे">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>अनलॉक तारखेला उपलब्ध फ्लोट आणि ट्रेडिंग व्हॉल्यूम झपाट्याने वाढू शकतो</li>
              <li>काही अँकर गुंतवणूकदार अनलॉक होताच लगेच नफा बुक करतात, ज्यामुळे किंमतीवर दबाव येतो</li>
              <li>इतर (विशेषतः केवळ दीर्घकालीन म्युच्युअल फंड) लॉक-इननंतरही बराच काळ गुंतवणूक ठेवू शकतात</li>
              <li>SME IPO मध्ये लिस्टिंगनंतरची कमी तरलता हा परिणाम अधिक स्पष्ट करते</li>
            </ul>
          </Section>

          <Section id="faqs" title="वारंवार विचारले जाणारे प्रश्न">
            <h3 className="font-semibold mt-4">अँकर गुंतवणूकदार लॉक-इन कालावधी किती दिवसांचा असतो?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">सध्याच्या SEBI नियमांनुसार, 50% अँकर शेअर्स 90 दिवसांसाठी आणि उर्वरित 50% वाटपाच्या तारखेपासून 30 दिवसांसाठी लॉक-इन असतात.</p>
            <h3 className="font-semibold mt-4">अँकर लॉक-इन संपल्याने नेहमीच किंमत घसरते का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">नेहमीच नाही — हे अँकर गुंतवणूकदार विकायचे ठरवतात की नाही यावर अवलंबून असते. यामुळे त्या तारखेला विक्रीयोग्य फ्लोट नक्कीच वाढतो, ज्यामुळे विक्री झाल्यास किंमतीवर दबाव येऊ शकतो.</p>
            <h3 className="font-semibold mt-4">एखाद्या IPO च्या अँकर वाटपाची माहिती कुठे मिळेल?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">अँकर गुंतवणूकदार वाटपाच्या याद्या साधारणतः IPO उघडण्याच्या एक दिवस आधी एक्स्चेंजद्वारे (BSE/NSE) जाहीर केल्या जातात, आणि कंपनीच्या RHP व लिस्टिंग खुलाशांमध्ये त्यांचा उल्लेख असतो.</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO मार्गदर्शक">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP म्हणजे काय</Link></li>
              <li><Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट मार्गदर्शक</Link></li>
              <li><Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB विरुद्ध HNI विरुद्ध Retail</Link></li>
              <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवळ माहितीच्या उद्देशाने हा मजकूर पुरवतो आणि SEBI कडे नोंदणीकृत नाही. लॉक-इन
          नियम SEBI कडून वेळोवेळी बदलले जातात — नेहमी ऑफर कागदपत्रातून खात्री करा.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO मध्ये अँकर गुंतवणूकदार लॉक-इन कालावधी: नियम आणि महत्त्व",
            description: "SEBI चे अँकर गुंतवणूकदार लॉक-इन नियम, 30/90 दिवसांची टप्पा विभागणी, आणि अनलॉक तारीख नव्याने सूचीबद्ध झालेल्या शेअरच्या किंमतीवर का परिणाम करते.",
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
              { "@type": "Question", name: "अँकर गुंतवणूकदार लॉक-इन कालावधी किती दिवसांचा असतो?", acceptedAnswer: { "@type": "Answer", text: "सध्याच्या SEBI नियमांनुसार, 50% अँकर शेअर्स 90 दिवसांसाठी आणि उर्वरित 50% वाटपाच्या तारखेपासून 30 दिवसांसाठी लॉक-इन असतात." } },
              { "@type": "Question", name: "अँकर गुंतवणूकदार कोण असतात?", acceptedAnswer: { "@type": "Answer", text: "अँकर गुंतवणूकदार हे मोठे Qualified Institutional Buyers असतात ज्यांना IPO उघडण्याच्या एक दिवस आधी, इश्यूअरने ठरवलेल्या किंमतीवर शेअर्स वाटप केले जातात." } },
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
