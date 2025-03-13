'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Link href="/" className="logo">
            <i className="fas fa-crown"></i>
            The Cult
          </Link>
        </div>
        
        <p className="footer-description">
          Building bridges between creators and communities. The Cult is a platform for tokenizing influence and empowering fans.
        </p>
        
        <div className="footer-social">
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Discord"><i className="fab fa-discord"></i></a>
          <a href="#" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
          <a href="#" aria-label="Medium"><i className="fab fa-medium"></i></a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} The Cult. All rights reserved.</p>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: var(--secondary-bg);
          padding: 40px 24px 20px;
          margin-top: 60px;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }
        
        .footer-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .footer-logo {
          margin-bottom: 5px;
        }
        
        .footer-logo .logo {
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer-logo .logo i {
          margin-right: 10px;
        }
        
        .footer-description {
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 10px;
        }
        
        .footer-social {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-top: 10px;
        }
        
        .footer-social a {
          color: var(--text-secondary);
          font-size: 24px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .footer-social a:hover {
          color: var(--accent-color);
          transform: translateY(-3px);
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .footer-bottom {
          max-width: 1440px;
          margin: 0 auto;
          padding-top: 20px;
          margin-top: 20px;
          border-top: 1px solid var(--border-color);
          text-align: center;
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        @media screen and (max-width: 640px) {
          .footer {
            padding: 30px 20px 15px;
          }
          
          .footer-description {
            font-size: 14px;
          }
        }
      `}</style>
    </footer>
  );
}