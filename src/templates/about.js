import React from 'react';
import { graphql } from 'gatsby';

import { Layout } from '../components/common';
import { MetaData } from '../components/common/meta';

const About = ({ data, location }) => {
  const page = data.allGhostPage.edges[0].node;

  return (
    <>
      <MetaData data={data} location={location} type="article" />
      <Layout>
        <div className="container">
          <article className="content">
            <section className="about-us post-full-content">
              <h1 className="content-title">{page.title}</h1>
              <section className="content-body" dangerouslySetInnerHTML={{ __html: page.html }} />
            </section>
          </article>
        </div>
      </Layout>
    </>
  );
};

export default About;

export const aboutQuery = graphql`
  query AboutUs($slug: String!) {
    allGhostPage(filter: { slug: { eq: $slug } }) {
      edges {
        node {
          ...GhostPageFields
        }
      }
    }
  }
`;
