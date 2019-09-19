import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

function Exhibition({ pages, id }) {
  const page = pages.find(({ node }) => {
    return node.slug === `siderbar-${id}`;
  });

  if (!page || !page.node.feature_image) return null;

  return (
    <div className="exhibition">
      <img src={page.node.feature_image} alt={page.node.excerpt} className="exhibition-img" />
    </div>
  );
}

const ExhibitionQuery = props => (
  <StaticQuery
    query={graphql`
      query GhostExhibition {
        allGhostPage(filter: { slug: { regex: "/siderbar/" } }) {
          edges {
            node {
              id
              slug
              feature_image
              excerpt
            }
          }
        }
      }
    `}
    render={data => <Exhibition pages={data.allGhostPage.edges} {...props} />}
  />
);

export default ExhibitionQuery;
