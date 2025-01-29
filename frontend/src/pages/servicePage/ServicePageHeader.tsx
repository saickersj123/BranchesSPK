import React, { useEffect, useState } from 'react';
import '../../css/servicePage/ServicePageHeader.css';

const ServicePageHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`servicepageheader_container ${isScrolled ? 'servicepageheader_scrolled' : ''}`}>
      <div className="servicepageheader_title">Branches Platform</div>
      <div className="servicepageheader_subtitle">사용자를 위한 최고의 학습 경험을 제공합니다.</div>
    </div>
  );
};

export default ServicePageHeader;