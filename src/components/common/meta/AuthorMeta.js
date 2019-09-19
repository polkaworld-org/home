import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import getAuthorProperties from './getAuthorProperties';
import config from '../../../utils/siteConfig';

const AuthorMeta = ({ data, settings, canonical }) => {
  settings = settings.allGhostSettings.edges[0].node;

  const author = getAuthorProperties(data);
  const shareImage = author.image || settings.cover_image || null;
  const title = `${data.name} - ${settings.title} - PolkaWorld`;
  const description = data.bio || config.siteDescriptionMeta || settings.description;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" property="og:description" content={description} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "Person",
                        "name": "${data.name}",
                        ${author.sameAsArray ? `"sameAs": ${author.sameAsArray},` : ``}
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

const AuthorMetaQuery = props => (
  <StaticQuery
    query={graphql`
      query GhostSettingsAuthorMeta {
        allGhostSettings {
          edges {
            node {
              ...GhostSettingsFields
            }
          }
        }
      }
    `}
    render={data => <AuthorMeta settings={data} {...props} />}
  />
);

export default AuthorMetaQuery;
