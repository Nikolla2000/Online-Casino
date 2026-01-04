import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsConditions.scss';

const TermsConditions = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="terms-container">
      <div className="terms-hero">
        <div className="hero-content">
          <h1 className="terms-title">Terms & Conditions</h1>
          <p className="terms-subtitle">Last updated: January 3, 2026</p>
          <div className="hero-decoration"></div>
        </div>
      </div>

      <div className="terms-content-wrapper">
        <aside className="terms-sidebar">
          <div className="sidebar-sticky">
            <h3>Table of Contents</h3>
            <nav className="terms-nav">
              <a 
                href="#introduction" 
                className={activeSection === 'introduction' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('introduction'); }}
              >
                1. Introduction
              </a>
              <a 
                href="#account" 
                className={activeSection === 'account' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('account'); }}
              >
                2. Account Registration
              </a>
              <a 
                href="#gameplay" 
                className={activeSection === 'gameplay' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('gameplay'); }}
              >
                3. Gameplay Rules
              </a>
              <a 
                href="#deposits" 
                className={activeSection === 'deposits' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('deposits'); }}
              >
                4. Deposits & Withdrawals
              </a>
              <a 
                href="#bonuses" 
                className={activeSection === 'bonuses' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('bonuses'); }}
              >
                5. Bonuses & Promotions
              </a>
              <a 
                href="#responsible" 
                className={activeSection === 'responsible' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('responsible'); }}
              >
                6. Responsible Gaming
              </a>
              <a 
                href="#privacy" 
                className={activeSection === 'privacy' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('privacy'); }}
              >
                7. Privacy & Security
              </a>
              <a 
                href="#prohibited" 
                className={activeSection === 'prohibited' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('prohibited'); }}
              >
                8. Prohibited Activities
              </a>
              <a 
                href="#termination" 
                className={activeSection === 'termination' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('termination'); }}
              >
                9. Account Termination
              </a>
              <a 
                href="#contact" 
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              >
                10. Contact Information
              </a>
            </nav>

            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back to Casino
            </button>
          </div>
        </aside>

        <main className="terms-main">
          <div className="terms-section" id="introduction">
            <h2>1. Introduction</h2>
            <p className="section-intro">
              Welcome to Royal Casino. By accessing and using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
            </p>
            <p>
              These terms constitute a legally binding agreement between you ("User", "Player", "You") and Royal Casino ("We", "Us", "Our", "Platform"). Your continued use of our services indicates your acceptance of these terms and any future modifications.
            </p>
            <div className="highlight-box">
              <strong>Important Notice:</strong> If you do not agree with any part of these terms, you must immediately cease using our platform and services.
            </div>
          </div>

          <div className="terms-section" id="account">
            <h2>2. Account Registration</h2>
            <h3>2.1 Eligibility Requirements</h3>
            <p>
              To create an account and use our services, you must meet the following criteria:
            </p>
            <ul>
              <li>Be at least 18 years of age or the legal age of majority in your jurisdiction, whichever is higher</li>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Reside in a jurisdiction where online gambling is legal</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be self-excluded from gambling activities</li>
            </ul>

            <h3>2.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Any activity conducted through your account is your responsibility. You must:
            </p>
            <ul>
              <li>Use a strong, unique password for your account</li>
              <li>Never share your login credentials with third parties</li>
              <li>Immediately notify us of any unauthorized access or security breach</li>
              <li>Log out of your account after each session, especially on shared devices</li>
            </ul>

            <h3>2.3 Account Verification</h3>
            <p>
              We reserve the right to verify your identity at any time. You may be required to provide documentation including but not limited to government-issued ID, proof of address, and payment method verification. Failure to provide requested documents may result in account suspension or closure.
            </p>
          </div>

          <div className="terms-section" id="gameplay">
            <h2>3. Gameplay Rules</h2>
            <h3>3.1 Game Integrity</h3>
            <p>
              All games on our platform use certified Random Number Generators (RNG) to ensure fair and unpredictable outcomes. Game results cannot be manipulated by players or the casino. Each spin, deal, or round is independent and has no connection to previous results.
            </p>

            <h3>3.2 Betting Limits</h3>
            <p>
              Each game has minimum and maximum bet limits clearly displayed. These limits may vary based on:
            </p>
            <ul>
              <li>Game type and variant</li>
              <li>Your VIP status and account level</li>
              <li>Current promotions or special events</li>
              <li>Regulatory requirements in your jurisdiction</li>
            </ul>

            <h3>3.3 Game Malfunctions</h3>
            <p>
              In the rare event of a game malfunction, all affected bets will be void and refunded to your account. This includes:
            </p>
            <ul>
              <li>Technical errors or system failures</li>
              <li>Display errors or incorrect game information</li>
              <li>Communication failures between client and server</li>
            </ul>
            <div className="warning-box">
              Malfunction voids all pays and plays. Game results are final once the round is complete and confirmed by our systems.
            </div>
          </div>

          <div className="terms-section" id="deposits">
            <h2>4. Deposits & Withdrawals</h2>
            <h3>4.1 Deposit Methods</h3>
            <p>
              We accept various payment methods for deposits, including credit cards, e-wallets, bank transfers, and cryptocurrency. Minimum deposit amounts vary by payment method. All deposits are subject to verification and may be delayed pending security checks.
            </p>

            <h3>4.2 Withdrawal Process</h3>
            <p>
              Withdrawal requests are processed within 1-5 business days, depending on the chosen method and your account verification status. VIP members enjoy priority processing.
            </p>
            <ul>
              <li>Minimum withdrawal: $10 or equivalent</li>
              <li>Maximum withdrawal limits based on VIP tier</li>
              <li>First withdrawal requires identity verification</li>
              <li>Withdrawals to the same method used for deposit (where possible)</li>
            </ul>

            <h3>4.3 Fees and Charges</h3>
            <p>
              Royal Casino does not charge fees for deposits or withdrawals. However, your payment provider or bank may impose their own charges. Currency conversion fees may apply for transactions in currencies other than your account currency.
            </p>
          </div>

          <div className="terms-section" id="bonuses">
            <h2>5. Bonuses & Promotions</h2>
            <h3>5.1 Bonus Terms</h3>
            <p>
              All bonuses and promotions are subject to specific terms and conditions, including wagering requirements. Unless otherwise stated:
            </p>
            <ul>
              <li>Welcome bonuses have a 30x wagering requirement</li>
              <li>Free spins winnings have a 20x wagering requirement</li>
              <li>Maximum bet with active bonus: $5 per spin/round</li>
              <li>Bonuses expire 30 days after activation</li>
              <li>Only one bonus active per account at a time</li>
            </ul>

            <h3>5.2 Bonus Abuse</h3>
            <p>
              We reserve the right to void bonuses and associated winnings if we detect abuse, including but not limited to:
            </p>
            <ul>
              <li>Creating multiple accounts to claim bonuses</li>
              <li>Using betting strategies designed to exploit bonus terms</li>
              <li>Irregular or suspicious betting patterns</li>
              <li>Collusion with other players</li>
            </ul>
          </div>

          <div className="terms-section" id="responsible">
            <h2>6. Responsible Gaming</h2>
            <h3>6.1 Our Commitment</h3>
            <p>
              Royal Casino is committed to promoting responsible gambling. We provide tools to help you maintain control over your gaming activities, including:
            </p>
            <ul>
              <li>Deposit limits (daily, weekly, monthly)</li>
              <li>Loss limits to protect your bankroll</li>
              <li>Session time reminders</li>
              <li>Self-exclusion options (24 hours to permanent)</li>
              <li>Reality check notifications</li>
            </ul>

            <h3>6.2 Problem Gambling Support</h3>
            <p>
              If you or someone you know has a gambling problem, please seek help immediately. We partner with leading organizations:
            </p>
            <div className="info-box">
              <strong>Support Resources:</strong>
              <br />
              • Gamblers Anonymous: 1-800-GAMBLER
              <br />
              • National Council on Problem Gambling: www.ncpgambling.org
              <br />
              • GamCare: www.gamcare.org.uk
            </div>

            <h3>6.3 Age Verification</h3>
            <p>
              We have a zero-tolerance policy for underage gambling. Strict age verification processes are in place, and we use industry-leading technology to prevent minors from accessing our services.
            </p>
          </div>

          <div className="terms-section" id="privacy">
            <h2>7. Privacy & Security</h2>
            <h3>7.1 Data Protection</h3>
            <p>
              Your privacy is paramount. We collect, process, and store your personal data in accordance with applicable data protection laws, including GDPR. All information is encrypted using industry-standard SSL technology.
            </p>

            <h3>7.2 Information We Collect</h3>
            <ul>
              <li>Personal identification information (name, address, date of birth)</li>
              <li>Contact information (email, phone number)</li>
              <li>Payment and transaction data</li>
              <li>Gaming activity and preferences</li>
              <li>Device and browser information</li>
            </ul>

            <h3>7.3 Data Usage</h3>
            <p>
              We use your data to provide services, process transactions, verify your identity, prevent fraud, comply with legal obligations, and improve our platform. We never sell your personal information to third parties.
            </p>
          </div>

          <div className="terms-section" id="prohibited">
            <h2>8. Prohibited Activities</h2>
            <p>
              The following activities are strictly prohibited and may result in immediate account closure and forfeiture of funds:
            </p>
            <ul>
              <li>Using automated software, bots, or scripts to play games</li>
              <li>Exploiting software bugs or system vulnerabilities</li>
              <li>Engaging in fraudulent activities or money laundering</li>
              <li>Colluding with other players to gain unfair advantages</li>
              <li>Using VPN or proxy services to circumvent geographic restrictions</li>
              <li>Creating multiple accounts or operating accounts for third parties</li>
              <li>Harassing or threatening other players or staff</li>
              <li>Attempting to reverse engineer or hack our platform</li>
            </ul>
            <div className="warning-box">
              <strong>Anti-Fraud Measures:</strong> We employ sophisticated fraud detection systems. Any suspicious activity will be investigated, and appropriate action will be taken, including reporting to relevant authorities.
            </div>
          </div>

          <div className="terms-section" id="termination">
            <h2>9. Account Termination</h2>
            <h3>9.1 Voluntary Closure</h3>
            <p>
              You may close your account at any time by contacting our customer support team. Upon closure, any remaining balance will be returned to you after deducting any applicable charges or bonus forfeitures.
            </p>

            <h3>9.2 Involuntary Suspension or Closure</h3>
            <p>
              We reserve the right to suspend or permanently close accounts for:
            </p>
            <ul>
              <li>Violation of these Terms and Conditions</li>
              <li>Suspicious or fraudulent activity</li>
              <li>Failure to complete identity verification</li>
              <li>Abusive behavior towards staff or other players</li>
              <li>Extended periods of inactivity (12+ months)</li>
            </ul>

            <h3>9.3 Consequences of Termination</h3>
            <p>
              Upon account termination, all bonuses and promotional credits will be forfeited. Your real money balance will be returned subject to completion of any pending wagering requirements and our right to deduct any amounts owed.
            </p>
          </div>

          <div className="terms-section" id="contact">
            <h2>10. Contact Information</h2>
            <p>
              If you have any questions, concerns, or require assistance regarding these Terms and Conditions or any aspect of our services, please contact us:
            </p>
            <div className="contact-box">
              <div className="contact-item">
                <strong>Email Support:</strong>
                <br />
                nikolla.uzunov@gmail.com
              </div>
              <div className="contact-item">
                <strong>Live AI Chat Support:</strong>
                <br />
                Available 24/7 on our platform
              </div>
              <div className="contact-item">
                <strong>Phone Support:</strong>
                <br />
                +1 (800) ROYAL-777
                <br />
                Monday - Sunday, 24 hours
              </div>
              <div className="contact-item">
                <strong>Postal Address:</strong>
                <br />
                Royal Casino Ltd.
                <br />
                123 Gaming Boulevard
                <br />
                Las Vegas, NV 89109
              </div>
            </div>
          </div>

          <div className="terms-footer">
            <div className="footer-notice">
              <p>
                These Terms and Conditions are governed by and construed in accordance with applicable gaming laws and regulations. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
              <p className="version-info">
                Document Version: 2.4 | Effective Date: January 3, 2026 | Document ID: TC-2026-001
              </p>
            </div>
            <button className="back-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              ↑ Back to Top
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsConditions;