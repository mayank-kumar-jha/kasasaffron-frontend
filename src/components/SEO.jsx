import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  name = 'Kasa Saffron',
  type = 'website',
  image = '/Images/Logo.png',
  canonicalUrl,
  lang = 'en',
  schemaType = 'WebPage',
}) => {
  const pageTitle = title ? `${title} | ${name}` : name;
  const defaultDesc = 'At Kasa Saffron Croqueteria and Catering, we transform a traditional Spanish recipe into a contemporary gourmet experience using premium ingredients.';
  const pageDescription = description || defaultDesc;
  const siteUrl = 'https://www.kasasaffron.com';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const pageUrl = canonicalUrl || `${siteUrl}${currentPath === '/' ? '/' : currentPath.replace(/\/$/, '')}`;
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`) : null;
  const language = lang === 'cat' ? 'ca' : lang.split('-')[0];
  const locale = language === 'es' ? 'es_ES' : language === 'ca' ? 'ca_ES' : 'en_US';

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: language,
    isPartOf: { '@id': `${siteUrl}/#website` },
    publisher: { '@id': `${siteUrl}/#business` },
    ...(imageUrl ? { primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl } } : {}),
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
    </Helmet>
  );
};

export default SEO;
