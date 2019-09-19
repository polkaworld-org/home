import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import url from 'url';

import config from '../../../utils/siteConfig';

const WebsiteMeta = ({ data, settings, canonical, title, description, image, type }) => {
  settings = settings.allGhostSettings.edges[0].node;

  const publisherLogo = url.resolve(config.siteUrl, settings.logo || config.siteIcon);
  let shareImage = image || data.feature_image || (settings.cover_image || null);

  shareImage = shareImage ? url.resolve(config.siteUrl, shareImage) : null;

  const keywords = config.siteKeywords;
  description =
    description || data.meta_description || data.description || config.siteDescriptionMeta || settings.description;
  title = `${title || (`${data.meta_title || data.name || data.title} - PolkaWorld`)}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" property="og:description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "${type}",
                        "url": "${canonical}",
                        ${
                          shareImage
                            ? `"image": {
                                "@type": "ImageObject",
                                "url": "${shareImage}",
                                "width": "${config.shareImageWidth}",
                                "height": "${config.shareImageHeight}"
                            },`
                            : ``
                        }
                        "keywords": "${keywords}",
                        "publisher": {
                            "@type": "Organization",
                            "name": "${settings.title}",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "${publisherLogo}",
                                "width": 60,
                                "height": 60
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "${config.siteUrl}"
                        },
                        "description": "${description}"
                    }
                `}</script>
      </Helmet>
    </>
  );
};

const WebsiteMetaQuery = props => (
  <StaticQuery
    query={graphql`
      query GhostSettingsWebsiteMeta {
        allGhostSettings {
          edges {
            node {
              ...GhostSettingsFields
            }
          }
        }
      }
    `}
    render={data => <WebsiteMeta settings={data} {...props} />}
  />
);

export default WebsiteMetaQuery;
