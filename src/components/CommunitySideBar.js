import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import { getCommunityData } from '../utils';

function CommunitySideBar({ posts }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">社区热议主题</div>
      <div className="sidebar-content">
        {posts.map(({ node: post }) => {
          return (
            <a
              href={getCommunityData(post) ? getCommunityData(post).forum_url : ''}
              className="link side-content-article-link"
              key={post.id}>
              <div className="side-content-article">{post.title}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

const CommunitySideBarQuery = props => (
  <StaticQuery
    query={graphql`
      query CommunityPosts {
        allGhostPost(
          sort: { order: DESC, fields: [published_at] }
          filter: { tags: { elemMatch: { slug: { eq: "community" } } } }
          limit: 5
        ) {
          edges {
            node {
              ...GhostPostFields
            }
          }
        }
      }
    `}
    render={data => <CommunitySideBar posts={data.allGhostPost.edges} {...props} />}
  />
);

export default CommunitySideBarQuery;
