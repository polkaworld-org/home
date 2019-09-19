import React from 'react';
import { graphql } from 'gatsby';

import { Layout, PostCard } from '../components/common';
import { MetaData } from '../components/common/meta';
import { CommunitySideBar, TagsBar, Exhibition, Banners } from '../components';
import { getCommunityData } from '../utils';

const Index = ({ data, location }) => {
  const posts = data.allGhostPost.edges;
  const tags = data.allGhostTag.edges;
  return (
    <>
      <MetaData location={location} tags={tags} />
      <Layout>
        <div className="container">
          <Banners />
          <div className="main-view">
            <div className="top-content">
              <TagsBar tags={tags} />
              <section className="post-feed">
                {posts.map(({ node }) => {
                  const communityData = getCommunityData(node);
                  if (!communityData) {
                    return <PostCard key={node.id} post={node} />;
                  } else {
                    return <PostCard key={node.id} post={node} url={communityData.forum_url} />;
                  }
                })}
              </section>
            </div>
            <div className="side">
              <CommunitySideBar />
              <Exhibition id="1" />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;

export const pageQuery = graphql`
  query GhostIndexQuery($slug: String, $limit: Int!, $skip: Int!) {
    allGhostTag {
      edges {
        node {
          ...GhostTagFields
        }
      }
    }
    allGhostPost(
      sort: { order: DESC, fields: [published_at] }
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`;
