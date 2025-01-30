import React from 'react';
import '../../css/servicePage/ServicePage.css';  
import ServicePageHeader from './ServicePageHeader';
import ServicePageContents from './ServicePageContents';

const ServicePage: React.FC = () => { 

  return (
    <div className="service-main-page"> 
    
      <div className="service-main-page-header">  
        <ServicePageHeader /> 
      </div>

      <div className="service-main-page-contents">
        {/** 컨텐츠 영역 */}
        <ServicePageContents />  
      </div>
    
    </div>
  );
};

export default ServicePage;