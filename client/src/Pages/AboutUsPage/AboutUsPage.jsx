import { useEffect } from 'react';
import FeatureCard from '../../Components/FeatureCard/FeatureCard';
import SectionLabel from '../../Components/SectionLabel/SectionLabel';
import TechGroup from '../../Components/TechGroup/TechGroup';
import { FEATURES, TECH_STACK } from './aboutUsData';
import './AboutUsStyles.scss';


const AboutUsPage = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        })
    }, []);

    return (
        <div className="about">

        <div className="about__bg" aria-hidden="true">
            <div className="bg-orb bg-orb--1" />
            <div className="bg-orb bg-orb--2" />
            <div className="bg-orb bg-orb--3" />
            <div className="bg-noise" />
        </div>

        <section className="hero">
            <div className="hero__eyebrow">
            <span>♠</span><span>Portfolio Project</span><span>♠</span>
            </div>
            <h1 className="hero__title">
            About <em>This</em><br />Project
            </h1>
            <p className="hero__sub">
            A full-stack project built by one developer in his spare time. 
            Not a real casino, but a demonstration of modern web engineering
            taken from concept all the way to production.
            </p>
            <div className="hero__suits" aria-hidden="true">♠ ♥ ♦ ♣</div>
        </section>

        <div className="about__content">

            <section className="section">
            <SectionLabel>About The Developer</SectionLabel>

            <div className="dev-card">
                <div className="dev-card__avatar-wrap">
                <div className="dev-card__ring dev-card__ring--outer" />
                <div className="dev-card__ring dev-card__ring--inner" />
                <div className="dev-card__avatar">NU</div>
                </div>

                <div className="dev-card__body">
                <div className="dev-card__name-row">
                    <h2 className="dev-card__name">Nikola Uzunov</h2>
                    <span className="dev-card__flag">🇧🇬</span>
                </div>

                {/* <div className="dev-card__badges">
                    <span className="badge badge--filled">Web Developer</span>
                    <span className="badge badge--outline">3 Years Experience</span>
                    <span className="badge badge--outline">Age 26</span>
                    <span className="badge badge--outline">Bulgaria</span>
                </div> */}

                <p className="dev-card__bio">
                    Hey! I'm Nikola. I'm 26 years old from Bulgaria and I'm a web developer from Bulgaria with 3 years of hands-on industry experience.
                    This online casino platform was built entirely in my spare time as a personal portfolio project.
                    It is <strong>NOT a real gambling site! In fact I'm strongly AGAINTS gambling.</strong>; I chose an online casino project because it is platform where I can implement some
                    complex logic, system design, a lot of features and technologies. It serves as a technical sandbox where I challenged
                    myself to learn new technologies and implement modern best practice I know.
                    The result is a feature-rich, production-grade application that demonstrates what a single
                    motivated developer can build end-to-end.
                </p>

                <a
                    className="dev-card__github-btn"
                    href="https://github.com/Nikolla2000/Online-Casino"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span>View Source on GitHub</span>
                </a>
                </div>
            </div>
            </section>

            <section className="section">
            <div className="disclaimer">
                <span className="disclaimer__icon">⚠️</span>
                <p>
                <strong>No real money involved.</strong> This platform is a purely demonstrative portfolio
                project. All games are simulated, all credits are fictional, and no real currency is ever
                used or stored. Every new account receives <span className="hl">10,000 free credits</span> to
                explore the games — for demonstration purposes only.
                </p>
            </div>
            </section>

            <section className="section">
            <SectionLabel>What's Inside</SectionLabel>
            <h2 className="section__title">Platform Features</h2>
            <p className="section__sub">
                Despite being a solo side project built in spare hours, this casino packs
                a surprisingly complete feature set — here's everything under one roof.
            </p>
            <div className="features-grid">
                {FEATURES.map((f, i) => (
                <FeatureCard key={f.title} {...f} index={i} />
                ))}
            </div>
            </section>

            <section className="section">
            <SectionLabel>Under The Hood</SectionLabel>
            <h2 className="section__title">Technology Stack</h2>
            <p className="section__sub">
                Every technology in this project was chosen deliberately.
                Here's the full picture and the reasoning behind each decision.
            </p>
            <div className="tech-grid">
                {TECH_STACK.map((group) => (
                <TechGroup key={group.category} {...group} />
                ))}
            </div>
            </section>

            <section className="section">
            <div className="cta">
                <div className="cta__deco" aria-hidden="true">♠ ♥ ♦ ♣</div>
                <h2 className="cta__title">Curious about the code?</h2>
                <p className="cta__sub">
                The entire project — frontend, backend, tests, Docker config, and CI pipelines — is open source.
                </p>
                <div className="cta__actions">
                <a className="cta__btn cta__btn--primary" href="https://github.com/Nikolla2000/Online-Casino" target="_blank" rel="noopener noreferrer">
                    View on GitHub
                </a>
                <a className="cta__btn cta__btn--ghost" href="/contact">
                    Contact Me
                </a>
                </div>
            </div>
            </section>

        </div>
        </div>
    );
};

export default AboutUsPage;