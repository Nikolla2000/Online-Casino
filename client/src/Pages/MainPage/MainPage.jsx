import React from 'react';
import "./MainPageStyles.scss"

import HeaderSection from './Sections/HeaderSection/HeaderSection';
import IntroductionSection from './Sections/IntroductionSection/IntroductionSection';
import Footer from '../../Components/Footer/Footer';

const MainPage = () => {
  return (
    <div className='main-page-wrapper'>
      <HeaderSection/>
      <IntroductionSection/>
      <Footer/>
    </div>
  );
};

export default MainPage;