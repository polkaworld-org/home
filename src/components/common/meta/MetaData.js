import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import url from 'url';

import config from '../../../utils/siteConfig';
import ArticleMeta from './ArticleMeta';
import WebsiteMeta from './WebsiteMeta';
import AuthorMeta from './AuthorMeta';

const MetaData = ({ data, settings, title, description, image, location, tags = [] }) => {
  const canonical = url.resolve(config.siteUrl, location.pathname);
  const { ghostPost, ghostPage, ghostAuthor } = data;

  if (ghostPost) {
    return <ArticleMeta data={ghostPost} canonical={canonical} />;
  } else if (ghostAuthor) {
    return <AuthorMeta data={ghostAuthor} canonical={canonical} />;
  } else if (ghostPage) {
    return <WebsiteMeta data={ghostPage} canonical={canonical} type="WebSite" />;
  } else {
    const tagNodes = tags.map(({ node }) => node);

    if (tagNodes.find(node => `/tag/${node.slug}` === location.pathname)) {
      return (
        <WebsiteMeta
          data={tagNodes.find(node => `/tag/${node.slug}` === location.pathname)}
          canonical={canonical}
          type="Series"
        />
      );
    } else {
      title = 'PolkaWorld | 波11卡（Polkadot）发烧友社区';
      description = description || config.siteDescriptionMeta || settings.description;
      image = image || settings.cover_image ? url.resolve(config.siteUrl, image) : null;

      return (
        <WebsiteMeta
          data={{}}
          canonical={canonical}
          title={title}
          description={description}
          image={image}
          type="WebSite"
        />
      );
    }
  }
};

MetaData.defaultProps = {
  data: {},
};

const MetaDataQuery = props => (
  <StaticQuery
    query={graphql`
      query GhostSettingsMetaData {
        allGhostSettings {
          edges {
            node {
              title
              description
            }
          }
        }
      }
    `}
    render={data => <MetaData settings={data} {...props} />}
  />
);

export default MetaDataQuery;
