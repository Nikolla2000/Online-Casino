import React from 'react';
import "./MainPageStyles.scss"

import HeaderSection from './Sections/HeaderSection/HeaderSection';
import InstroductionSection from './Sections/IntroductionSection/InstroductionSection';

const MainPage = () => {
  return (
    <div className='main-page-wrapper'>
      <HeaderSection/>
      <InstroductionSection/>
    </div>
  );
};

export default MainPage;