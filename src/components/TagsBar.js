import React from 'react';
import classnames from 'classnames';
import { Link } from 'gatsby';

import { getTagInfo } from '../utils';

export default function TagsBar({ tags: allTags }) {
  const tags = allTags
    .map(({ node }) => node)
    .slice()
    .sort((a, b) => {
      const { weight: aWeight = 0 } = getTagInfo(a);
      const { weight: bWeight = 0 } = getTagInfo(b);
      return bWeight - aWeight;
    });

  return (
    <nav className="tags-nav">
      <div className={classnames('tags-nav-item')}>
        <Link to="/" className={classnames('link', 'tags-nav-item-link')} activeClassName="tags-nav-item-link-active">
          全部
        </Link>
      </div>
      {tags.map(({ name, slug }) => {
        return (
          <div key={slug} className="tags-nav-item">
            <Link
              to={`/tag/${slug}`}
              className={classnames('link', 'tags-nav-item-link')}
              activeClassName="tags-nav-item-link-active">
              {name}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
