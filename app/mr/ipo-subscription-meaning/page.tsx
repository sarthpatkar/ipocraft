import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/ipo-subscription-meaning");
const enUrl = canonicalUrl("/ipo-subscription-meaning");
const hiUrl = canonicalUrl("/hi/ipo-subscription-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO सबस्क्रिप्शनचा अर्थ काय आहे? संपूर्ण स्पष्टीकरण | IPOCraft",
  description:
    "IPO सबस्क्रिप्शनचा अर्थ, ओव्हरसबस्क्रिप्शन, अंडरसबस्क्रिप्शन, श्रेणीनुसार मागणी, आणि ते वाटप व लिस्टिंगवर कसा परिणाम करते — मराठीत सविस्तर मार्गदर्शक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function IpoSubscriptionMeaningMarathiPage() {
  return (
    <div
      lang="mr"
      className="min-h-screen scroll-smooth bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C317A] dark:text-blue-400">
          IPO मार्गदर्शक
        </p>

        <h1
          className="mt-3 text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO सबस्क्रिप्शनचा अर्थ काय आहे? संपूर्ण स्पष्टीकरण ({CURRENT_YEAR})
        </h1>

        <div className="mt-3 text-xs text-[#64748b] dark:text-[#9AA1AA] flex flex-wrap gap-3">
          <span>सुमारे 12 मिनिटांचे वाचन</span>
        </div>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPO सबस्क्रिप्शन म्हणजे Initial Public Offering मध्ये देऊ केलेल्या एकूण शेअर्सच्या
          तुलनेत गुंतवणूकदारांनी शेअर्ससाठी किती वेळा अर्ज केले आहेत. हे Retail, HNI (NII), आणि
          QIB श्रेणींमधील मागणीची पातळी दर्शवते. गुंतवणूकदार वाटप होण्याची शक्यता आणि संभाव्य
          लिस्टिंग कामगिरीचा अंदाज घेण्यासाठी दररोज IPO सबस्क्रिप्शन स्थितीचा मागोवा घेतात.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/hi/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>
          .
        </p>

        <nav
          aria-label="Jump to Section"
          className="mt-8 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 sticky top-16 z-10"
        >
          <p className="text-sm font-semibold mb-3">या पानावर</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#meaning" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO सबस्क्रिप्शनचा अर्थ</a>
            <a href="#oversub" className="text-[#1C317A] dark:text-blue-400 hover:underline">ओव्हरसबस्क्रिप्शन</a>
            <a href="#undersub" className="text-[#1C317A] dark:text-blue-400 hover:underline">अंडरसबस्क्रिप्शन</a>
            <a href="#categories" className="text-[#1C317A] dark:text-blue-400 hover:underline">श्रेणीनुसार सबस्क्रिप्शन</a>
            <a href="#impact" className="text-[#1C317A] dark:text-blue-400 hover:underline">वाटपावर परिणाम</a>
            <a href="#listing" className="text-[#1C317A] dark:text-blue-400 hover:underline">लिस्टिंगवर परिणाम</a>
            <a href="#faq" className="text-[#1C317A] dark:text-blue-400 hover:underline">FAQs</a>
          </div>
        </nav>

        <article className="mt-10 space-y-12">
          <Section id="meaning" title="IPO सबस्क्रिप्शनचा अर्थ काय आहे?">
            <p>
              IPO सबस्क्रिप्शन दर्शवते की IPO मध्ये उपलब्ध शेअर्सच्या तुलनेत गुंतवणूकदारांनी किती
              वेळा शेअर्ससाठी बोली लावली आहे. उदाहरणार्थ, जर एखाद्या IPO मध्ये 10 लाख शेअर्स ऑफर
              केले गेले आणि त्यासाठी 1 कोटी शेअर्सची बोली आली, तर त्याला 10 पट (10x) सबस्क्राइब
              झाले असे म्हणतात.
            </p>
            <p>
              हे सबस्क्रिप्शन प्रमाण गुंतवणूकदारांच्या स्वारस्याचा एक महत्त्वाचा निर्देशक आहे आणि
              बाजारातील मागणीची ताकद मोजण्यात मदत करते.
            </p>
            <p>
              IPO सबस्क्रिप्शन डेटा सामान्यतः तीन मुख्य श्रेणींमध्ये विभागलेला असतो: Retail
              Individual Investors (RII), High Net-worth Individuals (HNI किंवा NII), आणि
              Qualified Institutional Buyers (QIB). प्रत्येक श्रेणीचा स्वतःचा वाटप कोटा आणि
              मागणीची गतीशीलता असते.
            </p>
          </Section>

          <Section id="oversub" title="IPO ओव्हरसबस्क्रिप्शन म्हणजे काय?">
            <p>
              ओव्हरसबस्क्रिप्शन तेव्हा होते जेव्हा शेअर्सची मागणी, ऑफर केलेल्या शेअर्सच्या
              संख्येपेक्षा जास्त असते. उदाहरणार्थ, जर एखाद्या IPO चा Retail भाग 20 पट सबस्क्राइब
              झाला, तर याचा अर्थ गुंतवणूकदारांनी Retail गुंतवणूकदारांना वाटप केलेल्या शेअर्सच्या
              20 पट जास्त शेअर्ससाठी अर्ज केला.
            </p>
            <p>
              ओव्हरसबस्क्रिप्शन सामान्यतः एक सकारात्मक संकेत मानले जाते, जे कंपनी सार्वजनिक
              होण्यात गुंतवणूकदारांचा मजबूत विश्वास आणि रस दर्शवते. तथापि, याचा अर्थ असाही आहे की
              सर्व गुंतवणूकदारांना शेअर्स मिळणार नाहीत, कारण वाटप प्रमाणानुसार किंवा लॉटरीद्वारे
              केले जाते.
            </p>
            <p>
              ओव्हरसबस्क्रिप्शन गुणोत्तर बाजारपेठेची स्थिती, कंपनीची प्रतिष्ठा, क्षेत्रातील आवड
              आणि किंमत यावर आधारित मोठ्या प्रमाणात बदलू शकते. उदाहरणार्थ, तंत्रज्ञान IPO मध्ये
              इतर क्षेत्रांच्या तुलनेत जास्त ओव्हरसबस्क्रिप्शन दिसून येते.
            </p>
          </Section>

          <Section id="undersub" title="IPO अंडरसबस्क्रिप्शन म्हणजे काय?">
            <p>
              जेव्हा शेअर्सची मागणी, ऑफर केलेल्या शेअर्सच्या संख्येपेक्षा कमी असते, तेव्हा
              अंडरसबस्क्रिप्शन होते. उदाहरणार्थ, 0.8x चे सबस्क्रिप्शन गुणोत्तर म्हणजे फक्त 80
              टक्के शेअर्ससाठीच अर्ज आले होते.
            </p>
            <p>
              हे गुंतवणूकदारांची कमकुवत भावना, कंपनीच्या मूलभूत तत्त्वांबद्दलची चिंता, किंमत किंवा
              बाजारातील परिस्थिती दर्शवू शकते. कमी सबस्क्राइब झालेल्या IPO ला लिस्टिंगमध्ये नफा
              मिळवण्यात अनेकदा अडचणी येतात आणि त्यांना किंमत सुधारणांची गरज भासू शकते.
            </p>
            <p>
              कधीकधी, अंडरसबस्क्रिप्शन श्रेणी-विशिष्ट असू शकते, जिथे एका गुंतवणूकदार वर्गाचे
              (उदा. Retail) जास्त सबस्क्रिप्शन होते तर दुसऱ्याचे (उदा. QIB) कमी सबस्क्रिप्शन
              होते.
            </p>
          </Section>

          <Section id="categories" title="श्रेणीनुसार IPO सबस्क्रिप्शन समजून घ्या">
            <p>IPO शेअर्स तीन मुख्य गुंतवणूकदार श्रेणींमध्ये विभागले जातात:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>
                <strong>Retail Individual Investors (RII):</strong> ₹2 लाखांपर्यंतच्या
                शेअर्ससाठी अर्ज करणारे वैयक्तिक गुंतवणूकदार. Retail गुंतवणूकदारांना सहसा एकूण
                शेअर्सच्या 35% कोटा मिळतो.
              </li>
              <li>
                <strong>High Net-worth Individuals (HNI/NII):</strong> Retail मर्यादेपेक्षा जास्त
                अर्ज करणारे गुंतवणूकदार. या श्रेणीला साधारणपणे 15% वाटप मिळते.
              </li>
              <li>
                <strong>Qualified Institutional Buyers (QIB):</strong> म्युच्युअल फंड, विमा
                कंपन्या आणि परदेशी संस्थात्मक गुंतवणूकदार यांसारखे संस्थात्मक गुंतवणूकदार. QIB
                ला साधारणपणे 50% वाटप मिळते.
              </li>
            </ul>
            <p>
              प्रत्येक श्रेणीचे स्वतंत्र सबस्क्रिप्शन प्रमाण आणि मागणी पातळी असते. श्रेणीनुसार
              सबस्क्रिप्शन समजून घेतल्याने गुंतवणूकदारांना सर्वाधिक रस कोठे आहे आणि वाटपाची
              शक्यता कशी असेल हे समजण्यास मदत होते.
            </p>
          </Section>

          <Section id="impact" title="IPO सबस्क्रिप्शनमुळे वाटपावर कसा परिणाम होतो">
            <p>
              वाटप म्हणजे अर्जदारांमध्ये शेअर्सचे वितरण करण्याची प्रक्रिया. जेव्हा IPO जास्त
              प्रमाणात सबस्क्राइब होतो, तेव्हा शेअर्सचे वाटप प्रमाणानुसार किंवा लॉटरीद्वारे केले
              जाते, विशेषतः Retail श्रेणीत.
            </p>
            <p>
              Retail गुंतवणूकदारांसाठी, ओव्हरसबस्क्रिप्शनमुळे पूर्ण वाटप मिळण्याची शक्यता कमी
              होते. उदाहरणार्थ, जर Retail भाग 10 पट सबस्क्राइब झाला, तर 100 शेअर्ससाठी अर्ज
              करणाऱ्या गुंतवणूकदाराला फक्त 10 शेअर्स मिळू शकतात.
            </p>
            <p>
              HNI आणि QIB श्रेणींमध्ये सहसा प्रमाणानुसार वाटप केले जाते, जिथे बोलीच्या आकारावर
              आधारित शेअर्स वाटप केले जातात.
            </p>
            <p>न्याय्यता आणि पारदर्शकता सुनिश्चित करण्यासाठी वाटप प्रक्रिया SEBI च्या नियमांनुसार नियंत्रित केली जाते.</p>
            <p>
              सखोल माहितीसाठी आमचे{" "}
              <Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO वाटप कसे होते
              </Link>{" "}
              हे मार्गदर्शक पाहा.
            </p>
          </Section>

          <Section id="listing" title="IPO सबस्क्रिप्शन लिस्टिंगच्या नफ्यावर कसा परिणाम करते">
            <p>
              IPO सबस्क्रिप्शनची पातळी अनेकदा लिस्टिंगच्या दिवसाच्या कामगिरीवर परिणाम करते. मोठ्या
              प्रमाणात ओव्हरसबस्क्राइब झालेला IPO जोरदार मागणी दर्शवतो, ज्यामुळे दुय्यम बाजारात
              शेअर्स खरेदी करण्यासाठी गुंतवणूकदार धावपळ करतात आणि लिस्टिंगमध्ये नफा होण्याची
              शक्यता वाढते.
            </p>
            <p>
              तथापि, लिस्टिंग कामगिरी व्यापक बाजार परिस्थिती, क्षेत्रातील कल आणि संस्थात्मक
              गुंतवणूकदारांच्या भावनांवर देखील अवलंबून असते.
            </p>
            <p>अंडरसबस्क्राइब झालेल्या IPO ला कमी लिस्टिंग किंमत किंवा निर्गम किंमतीच्या खाली लिस्टिंगचा सामना करावा लागू शकतो.</p>
            <p>
              गुंतवणूकदारांनी सबस्क्रिप्शन डेटासोबतच कंपनीची मूलभूत तत्त्वे, मूल्यांकन आणि
              बाजारातील वातावरण यांसारख्या इतर घटकांचाही विचार केला पाहिजे.
            </p>
          </Section>

          <Section id="faq" title="वारंवार विचारले जाणारे प्रश्न (FAQs)">
            <dl className="space-y-6">
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">10x IPO सबस्क्रिप्शन म्हणजे काय?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">याचा अर्थ गुंतवणूकदारांनी IPO मध्ये उपलब्ध शेअर्सच्या 10 पट अधिक शेअर्ससाठी अर्ज केले आहेत.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">जास्त IPO सबस्क्रिप्शन लिस्टिंगमध्ये नफ्याची हमी देते का?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">नाही. जास्त सबस्क्रिप्शन मागणी दर्शवते, पण लिस्टिंग बाजार परिस्थिती आणि संस्थात्मक स्वारस्यावर अवलंबून असते.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">IPO सबस्क्रिप्शन श्रेणीनुसार बदलू शकते का?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">होय, वेगवेगळ्या गुंतवणूकदार आधार आणि कोट्यांमुळे Retail, HNI आणि QIB श्रेणींमध्ये सबस्क्रिप्शन गुणोत्तर अनेकदा वेगळे असते.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">ओव्हरसबस्क्राइब झालेल्या IPO मध्ये वाटप कसे ठरवले जाते?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">Retail वाटप सहसा लॉटरीद्वारे केले जाते, तर HNI आणि QIB वाटप बोलींच्या प्रमाणात असते.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">IPO सबस्क्रिप्शनची स्थिती कुठे तपासावी?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">IPO सबस्क्रिप्शन स्थिती IPO कालावधीत स्टॉक एक्स्चेंजच्या संकेतस्थळांवर आणि आर्थिक पोर्टलवर दररोज प्रकाशित होते.</dd>
              </div>
            </dl>
          </Section>

          <Section id="related-resources" title="संबंधित IPO मार्गदर्शक">
            <p>सबस्क्रिप्शन डेटा GMP, वाटप आणि गुंतवणूकदार श्रेणी नियमांशी कसा जोडला जातो हे समजून घेण्यासाठी पाहा:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP म्हणजे काय</Link></li>
              <li><Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट मार्गदर्शक</Link></li>
              <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप कसे होते</Link></li>
              <li><Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB विरुद्ध HNI विरुद्ध Retail</Link></li>
              <li><Link href="/mr/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">Cut-off Price म्हणजे काय</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप शक्यता कॅल्क्युलेटर</Link></li>
            </ul>
          </Section>
        </article>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "10x IPO सबस्क्रिप्शन म्हणजे काय?", acceptedAnswer: { "@type": "Answer", text: "याचा अर्थ गुंतवणूकदारांनी IPO मध्ये उपलब्ध शेअर्सच्या 10 पट अधिक शेअर्ससाठी अर्ज केले आहेत." } },
              { "@type": "Question", name: "जास्त IPO सबस्क्रिप्शन लिस्टिंगमध्ये नफ्याची हमी देते का?", acceptedAnswer: { "@type": "Answer", text: "नाही. जास्त सबस्क्रिप्शन मागणी दर्शवते, पण लिस्टिंग बाजार परिस्थिती आणि संस्थात्मक स्वारस्यावर अवलंबून असते." } },
              { "@type": "Question", name: "ओव्हरसबस्क्राइब झालेल्या IPO मध्ये वाटप कसे ठरवले जाते?", acceptedAnswer: { "@type": "Answer", text: "Retail वाटप सहसा लॉटरीद्वारे केले जाते, तर HNI आणि QIB वाटप बोलींच्या प्रमाणात असते." } },
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
