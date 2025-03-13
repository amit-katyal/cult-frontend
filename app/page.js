'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TokenTable from '@/components/ui/TokenTable';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Tokenizing Influence, Empowering Fans</h1>
          <p className="hero-subtitle">
            Building bridges between creators and communities. Start building your cultural portfolio today!
          </p>
          <Link href="/token/create" className="hero-btn">
            Launch your token
          </Link>
        </div>
        <div className="hero-image">
          <Image 
            src="/images/hero-image.jpg" 
            alt="Celebrity Tokens Banner"
            width={660}
            height={330}
            priority
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <TokenTable />
      </div>
    </>
  );
}