import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name = 'Kasa Saffron', type = 'website' }) => {
  const pageTitle = title ? `${title} | ${name}` : name;
  const defaultDesc = 'At Kasa Saffron Croqueteria Y Catering, we transform a traditional Spanish recipe into a contemporary gourmet experience using premium ingredients.';
  const pageDescription = description || defaultDesc;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {/* Standard Open Graph Tags for SEO context (Though mostly read by Google for SPAs) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
    </Helmet>
  );
};

export default SEO;
