import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import url from 'url';

import getAuthorProperties from './getAuthorProperties';
import config from '../../../utils/siteConfig';

import { tags as tagsHelper } from '@tryghost/helpers';

const ArticleMetaGhost = ({ data, settings, canonical }) => {
  const ghostPost = data;
  settings = settings.allGhostSettings.edges[0].node;

  const author = getAuthorProperties(ghostPost.primary_author);
  const publicTags = (tagsHelper(ghostPost, { visibility: `public`, fn: tag => tag }) || []).map(({ name }) => name);
  const shareImage = ghostPost.feature_image ? ghostPost.feature_image : settings.cover_image || null;
  const publisherLogo =
    settings.logo || config.siteIcon ? url.resolve(config.siteUrl, settings.logo || config.siteIcon) : null;
  const title = `${ghostPost.meta_title || ghostPost.title} - PolkaWorld`
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" property="og:description" content={ghostPost.meta_description || ghostPost.excerpt} />
        <link rel="canonical" href={canonical} />
        {publicTags.map((keyword, i) => (
          <meta property="article:tag" content={keyword} key={i} />
        ))}
        <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "Article",
                        "author": {
                            "@type": "Person",
                            "name": "${author.name}"
                        },
                        ${publicTags.length ? `"keywords": "${publicTags.join(`, `)}",` : ``}
                        "headline": "${title}",
                        "url": "${canonical}",
                        "datePublished": "${ghostPost.published_at}",
                        "dateModified": "${ghostPost.updated_at}",
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
                        "description": "${ghostPost.meta_description || ghostPost.excerpt}",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "${config.siteUrl}"
                        }
                    }
                `}</script>
      </Helmet>
    </>
  );
};

ArticleMetaGhost.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    published_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    meta_title: PropTypes.string,
    meta_description: PropTypes.string,
    primary_author: PropTypes.object.isRequired,
    feature_image: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        slug: PropTypes.string,
        visibility: PropTypes.string,
      })
    ),
    primaryTag: PropTypes.shape({
      name: PropTypes.string,
    }),
    og_title: PropTypes.string,
    og_description: PropTypes.string,
    twitter_title: PropTypes.string,
    twitter_description: PropTypes.string,
    excerpt: PropTypes.string.isRequired,
  }).isRequired,
  settings: PropTypes.shape({
    allGhostSettings: PropTypes.object.isRequired,
  }).isRequired,
  canonical: PropTypes.string.isRequired,
};

const ArticleMetaQuery = props => (
  <StaticQuery
    query={graphql`
      query GhostSettingsArticleMeta {
        allGhostSettings {
          edges {
            node {
              ...GhostSettingsFields
            }
          }
        }
      }
    `}
    render={data => <ArticleMetaGhost settings={data} {...props} />}
  />
);

export default ArticleMetaQuery;
