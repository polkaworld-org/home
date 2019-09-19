import React from 'react';
import { getBannerData } from '../utils';
import { StaticQuery, Link, graphql } from 'gatsby';

function Banners({ posts }) {
  const banners = getBannerData(posts);

  const mainPost = banners.slice(0, 1)[0];
  const sidePost = banners.slice(1, 4);

  return (
    <div className="banner">
      <Link className="main-post" to={`/articles/${mainPost.node.slug}`}>
        <img src={mainPost.node.feature_image} alt={mainPost.node.title} />
        <div className="main-post-title">
          <p>{mainPost.node.title}</p>
        </div>
      </Link>
      <div className="sider-post">
        {sidePost.map(({ node }) => {
          return (
            <Link key={node.id} className="sider-post-item" to={`/articles/${node.slug}`}>
              <img src={node.feature_image} alt={node.title} />
              <div className="sider-post-title">
                <p>{node.title}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const BannersQuery = props => (
  <StaticQuery
    query={graphql`
      query GhostFeaturedPost {
        allGhostPost(sort: { order: DESC, fields: [published_at] }, filter: { featured: { eq: true } }) {
          edges {
            node {
              ...GhostPostFields
            }
          }
        }
      }
    `}
    render={data => <Banners posts={data.allGhostPost.edges} {...props} />}
  />
);

export default BannersQuery;
