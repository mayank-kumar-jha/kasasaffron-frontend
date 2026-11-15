import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name = 'Kasa Saffron', type = 'website', image = '/Images/Logo.png', canonicalUrl }) => {
  const pageTitle = title ? `${title} | ${name}` : name;
  const defaultDesc = 'At Kasa Saffron Croqueteria and Catering, we transform a traditional Spanish recipe into a contemporary gourmet experience using premium ingredients.';
  const pageDescription = description || defaultDesc;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.kasasaffron.com';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const pageUrl = canonicalUrl || `${siteUrl}${currentPath === '/' ? '/' : currentPath.replace(/\/$/, '')}`;
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`) : null;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Standard Open Graph Tags for SEO context (Though mostly read by Google for SPAs) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
};

export default SEO;
