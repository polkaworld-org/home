import React from 'react';
import { graphql } from 'gatsby';
import jsyaml from 'js-yaml';

import { Layout } from '../components/common';
import { MetaData } from '../components/common/meta';

function parseURL(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

const Explore = ({ data, location }) => {
  const page = data.allGhostPage.edges[0].node;
  const sites = jsyaml.load(page.plaintext);

  return (
    <>
      <MetaData data={data} location={location} type="article" />
      <Layout>
        <div className="container">
          <article className="sites">
            {sites.map(site => {
              return (
                <section className="panel" key={site.section}>
                  <div className="panel-title">{site.section}</div>
                  <div className="panel-body">
                    {site.items.map(item => {
                      return (
                        <div className="panel-item" key={item.link}>
                          <div className="card">
                            <div className="card-body">
                              <div className="card-title">
                                {item.icon && (
                                  <div className="card-icon">
                                    <img src={item.icon} alt="" />
                                  </div>
                                )}
                                <a href={item.link} className="link" target="_blank">
                                  {item.title}
                                </a>
                              </div>
                              <div className="card-desc">{item.desc || parseURL(item.link)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </article>
        </div>
      </Layout>
    </>
  );
};

export default Explore;

export const exploreQuery = graphql`
  query Explore($slug: String!) {
    allGhostPage(filter: { slug: { eq: $slug } }) {
      edges {
        node {
          ...GhostPageFields
        }
      }
    }
  }
`;
