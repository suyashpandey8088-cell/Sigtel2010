import { company } from "@/lib/content/site";
import { projects } from "@/lib/content/projects";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${company.siteUrl}/#organization`,
        name: company.legalName,
        alternateName: "SIG-TEL",
        url: company.siteUrl,
        logo: `${company.siteUrl}/favicon.svg`,
        image: `${company.siteUrl}/images/hero-daylight.jpg`,
        description:
          "Railway signalling and telecommunications engineering company incorporated in 2010 in Navi Mumbai, India. Electronic Interlocking, level crossings, axle counters, earthing, IP-MPLS, SDH, OFC, CCTV and maintenance.",
        foundingDate: "2010",
        email: company.email,
        telephone: company.phone.primary,
        vatID: company.gstin,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Unit F-202, 2nd Floor, ITC Tower No. 8, Belapur Railway Station Building, Sector 11, CBD Belapur (W)",
          addressLocality: "Navi Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400614",
          addressCountry: "IN",
        },
        areaServed: ["Maharashtra", "Goa", "Karnataka", "Madhya Pradesh", "Uttar Pradesh"],
        knowsAbout: [
          "Railway signalling",
          "Electronic Interlocking",
          "Level crossing gates",
          "Axle counters",
          "Telecommunications",
          "IP-MPLS",
          "SDH transmission",
          "Optical fibre communication",
          "CCTV surveillance",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: company.phone.primary,
            contactType: "sales",
            email: company.email,
            availableLanguage: ["en", "hi", "mr"],
            areaServed: "IN",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Engineering services",
          itemListElement: projects.slice(0, 6).map((project) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: project.shortTitle,
              url: `${company.siteUrl}/projects/${project.slug}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${company.siteUrl}/#website`,
        url: company.siteUrl,
        name: "SIG-TEL",
        publisher: { "@id": `${company.siteUrl}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
