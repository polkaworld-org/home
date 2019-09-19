import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';

import { Layout } from '../components/common';
import { MetaData } from '../components/common/meta';
import { formatDate } from '../utils';

const Post = ({ data, location }) => {
  const post = data.ghostPost;

  return (
    <>
      <MetaData data={data} location={location} type="article" />
      <Helmet>
        <style type="text/css">{`${post.codeinjection_styles}`}</style>
      </Helmet>
      <Layout>
        <div className="container">
          <article className="content">
            <section className="post-full-content">
              <h1 className="content-title">{post.title}</h1>
              <div className="content-meta">
                {post.primary_author.profile_image ? (
                  <div className="post-card-avatar">
                    <img
                      className="author-profile-image"
                      src={post.primary_author.profile_image}
                      alt={post.primary_author.name}
                    />
                  </div>
                ) : null}
                <div className="content-author">{post.primary_author.name}</div>
                <span className="middot" />
                <div className="content-create-date">{formatDate(post.created_at)}</div>
              </div>
              <section className="content-body load-external-scripts" dangerouslySetInnerHTML={{ __html: post.html }} />
            </section>
          </article>
        </div>
      </Layout>
    </>
  );
};

export default Post;

export const postQuery = graphql`
  query($slug: String!) {
    ghostPost(slug: { eq: $slug }) {
      ...GhostPostFields
    }
  }
`;
