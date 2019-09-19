import React from 'react';
import { Link } from 'gatsby';
import '../styles/app.css'

const NotFoundPage = () => (
  <div className="error-page">
    <div className="error-page-container">
      <div className="error-page-text">
        <div className="error-page-title">404</div>
        <div className="error-page-sub-title">找不到该页面</div>
        <div className="error-page-link">
          <Link to="/">点击返回首页</Link>
        </div>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
