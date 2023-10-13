import React from 'react';
import "./MainPageStyles.scss"

import HeaderSection from './Sections/HeaderSection/HeaderSection';
import IntroductionSection from './Sections/IntroductionSection/IntroductionSection';

const MainPage = () => {
  return (
    <div className='main-page-wrapper'>
      <HeaderSection/>
      <IntroductionSection/>
    </div>
  );
};

export default MainPage;