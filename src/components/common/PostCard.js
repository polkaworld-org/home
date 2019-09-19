import React from 'react';
import { Link } from 'gatsby';

import { formatDate } from '../../utils';

const PostCard = ({ post, url: forum_url }) => {
  const url = `/articles/${post.slug}`;

  return (
    <article className="post-card">
      <header className="post-card-header">
        <div className="post-card-meta">
          {post.primary_author.profile_image ? (
            <div className="post-card-avatar">
              <img
                className="author-profile-image"
                src={post.primary_author.profile_image}
                alt={post.primary_author.name}
              />
            </div>
          ) : null}
          <span className="post-card-author-name">{post.primary_author.name}</span>
          <span className="middot" />
          <div className="content-create-date">{formatDate(post.created_at)}</div>
        </div>
      </header>
      <div className="post-main">
        <div className="post-content">
          <section className="post-card-excerpt">
            <h2 className="post-card-title">
              {forum_url ? (
                <a href={forum_url} className="link">
                  {post.title}
                </a>
              ) : (
                <Link to={url} className="link">
                  {post.title}
                </Link>
              )}
            </h2>
            <div className="post-excerpt">{post.excerpt}</div>
          </section>
          <footer className="post-card-footer">
            {post.tags && (
              <div className="post-card-tags">
                {post.tags.map(({ name, slug }) => {
                  return (
                    <div className="post-card-tags-item" key={slug}>
                      <Link to={`/tag/${slug}`} className="link">
                        {name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </footer>
        </div>
        {post.feature_image && (
          <div className="feature-image">
            <img src={post.feature_image} alt={post.title} />
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
