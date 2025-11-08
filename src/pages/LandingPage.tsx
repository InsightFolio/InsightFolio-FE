import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Search, Shield } from 'lucide-react';
import './LandingPage.css';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-Time Data',
    description: 'Access live market movements and instant price updates.'
  },
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Discover opportunities quickly with powerful screening tools.'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your portfolio is safeguarded with enterprise-grade protection.'
  }
];

const LandingPage: React.FC = () => (
  <div className="landing">
    <main className="landing__content">
      <section className="landing__hero">
        <h1 className="landing__title">
          Insight<span>Folio</span>
        </h1>
        <p className="landing__subtitle">
          Real-time stock insights and portfolio management tools at your fingertips.
        </p>
        <div className="landing__actions">
          <Link to="/signup" className="landing__btn landing__btn--primary">
            Get Started
          </Link>
          <Link to="/login" className="landing__btn landing__btn--secondary">
            Log In
          </Link>
        </div>
      </section>

      <section className="landing__features" aria-label="Platform benefits">
        {features.map(({ icon: Icon, title, description }) => (
          <article className="landing__feature" key={title}>
            <div className="landing__feature-icon">
              <Icon aria-hidden="true" />
            </div>
            <h3 className="landing__feature-title">{title}</h3>
            <p className="landing__feature-description">{description}</p>
          </article>
        ))}
      </section>
    </main>
  </div>
);

export default LandingPage;
