import React, { memo } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import '../../styles/app.css';

// Styles

const DefaultLayout = memo(({ children, bodyClass }) => {
  const site = {
    lang: 'zh-CN',
  };

  return (
    <>
      <Helmet>
        <html lang={site.lang} />
        <body className={bodyClass} />
      </Helmet>

      <div className="viewport">
        <div className="viewport-top">
          <header className="site-head">
            <div className="container">
              <div className="site-mast">
                <div className="site-mast-left">
                  <Link to="/">
                    <img className="site-logo" src="/images/logo.png" alt={site.title} />
                  </Link>
                </div>
                <div className="site-link">
                  <div className="site-link-item">
                    <Link to="/">首页</Link>
                  </div>
                  <div className="site-link-item">
                    <a href="//forum.polkaworld.org" rel="noopener noreferrer">
                      社区
                    </a>
                  </div>
                  <div className="site-link-item">
                    <Link to="/explore" rel="noopener noreferrer">
                      导航
                    </Link>
                  </div>
                  <div className="site-link-item">
                    <Link to="/pns" rel="noopener noreferrer">
                      PNS
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="site-main">{children}</main>
        </div>

        <div className="viewport-bottom">
          <footer className="site-foot">
            <div className="site-foot-nav container">
              <div className="site-foot-nav-left">
                <Link to="/">PolkaWorld | 波卡（Polkadot）发烧友社区</Link>
                <Link style={{ marginLeft: 20 }} to="/about">
                  关于我们
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
});

export default DefaultLayout;
