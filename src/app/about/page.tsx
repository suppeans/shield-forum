import { PageHeading } from "@/components/page-heading";
import { TranslatedText } from "@/components/translated-text";
export default function AboutPage() {
  return <main className="page" id="main">
    <PageHeading title="" description="" labelKey="nav.about" titleKey="about.title" descriptionKey="about.description" />
    <article className="article-body about-body">
      <section>
        <TranslatedText as="h2" translationKey="about.focusTitle" />
        <TranslatedText as="p" translationKey="about.focusBody" />
      </section>
      <section>
        <TranslatedText as="h2" translationKey="about.sourcesTitle" />
        <TranslatedText as="p" translationKey="about.sourcesBody" />
      </section>
      <section>
        <TranslatedText as="h2" translationKey="about.updatesTitle" />
        <TranslatedText as="p" translationKey="about.updatesBody" />
      </section>
      <section>
        <TranslatedText as="h2" translationKey="about.accuracyTitle" />
        <p><TranslatedText translationKey="about.accuracyBody" />{" "}<a href="mailto:leianda946@gmail.com">leianda946@gmail.com</a><TranslatedText translationKey="about.contactSuffix" /></p>
      </section>
    </article>
  </main>;
}

