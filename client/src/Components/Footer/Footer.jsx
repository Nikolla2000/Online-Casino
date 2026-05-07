import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SecurityIcon from '@mui/icons-material/Security';
import "./FooterStyles.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFromGamesPage, showLogin } from '../../redux/features/auth/authModalsSlice';


const Footer = () => {
    const { user, accessToken } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickGameLink = (gameLink) => {
        if (!user || !accessToken) {
            dispatch(showLogin());
            dispatch(setFromGamesPage(gameLink));
        } else {
            navigate(gameLink);
        }
    }

    return (
        <Box component="footer" className="casino-footer">

            <Container maxWidth="xl" className="footer-content">
                <Grid container spacing={4}>

                    <Grid item size={{xs: 12, md: 4}}>
                        <Box className="brand-section">
                            <Box className="logo-container">
                                <CasinoIcon className="logo-icon" />
                                <Typography variant="h4" className="logo-text">
                                    LUCKY<span>SPIN</span>
                                </Typography>
                            </Box>
                            <Typography className="brand-description">
                                Experience unforgettable gaming with the best casino games. 
                                Simulative platform for entertainment and fun.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item size={{xs:12, md:2}}>
                        <Typography variant="h6" className="section-title">
                            Games
                        </Typography>
                        <ul className="footer-links">
                            {/* <li><Link to="/games/slots">Slot Machines</Link></li>
                            <li><Link to="/games/roulette">Roulette</Link></li>
                            <li><Link to="/development">Blackjack</Link></li>
                            <li><Link to="/development">Poker</Link></li> */}
                            <li><a href='#' onClick={() => handleClickGameLink('games/slots')}>Slot Machines</a></li>
                            <li><a href='#' onClick={() => handleClickGameLink('games/roulette')}>Roulette</a></li>
                            <li><Link to="/development">Blackjack</Link></li>
                            <li><Link to="/development">Poker</Link></li>
                        </ul>
                    </Grid>

                    <Grid item size={{xs: 12, md:2}}>
                        <Typography variant="h6" className="section-title">
                            Information
                        </Typography>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                            {/* <li><Link to="/privacy">Privacy Policy</Link></li> */}
                            {/* <li><Link to="/contact">Contact</Link></li> */}
                        </ul>
                    </Grid>

                    <Grid item size={{xs:12, md:2}}>
                        <Typography variant="h6" className="section-title">
                            Support
                        </Typography>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contacts</Link></li>
                            {/* <li><Link to="/help">FAQ</Link></li> */}
                            {/* <li><Link to="/responsible">Responsible Gaming</Link></li> */}
                            <li><Link to="/email">Email</Link></li>
                        </ul>
                    </Grid>

                    <Grid item size={{xs:12, md:2}}>
                        <Box className="security-section">
                            <SecurityIcon className="security-icon" />
                            <Typography variant="h6" className="security-title">
                                100% Secure
                            </Typography>
                            <Typography className="security-text">
                                Simulative platform for entertainment only
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Divider */}
            <Box className="footer-divider">
                <SportsEsportsIcon className="divider-icon" />
            </Box>

            <Box className="footer-bottom">
                <Container maxWidth="xl">
                    <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Grid size="auto">
                            <Typography className="copyright-text">
                                © {new Date().getFullYear()} LuckySpin Casino. Created by{' '}
                                <span className="author-name">Nikola Uzunov</span>. 
                                All rights reserved.
                            </Typography>
                        </Grid>
                        
                        <Grid size="auto">
                            <Typography className="warning-text">
                                ⚠️ Games are simulative - money is not real!
                            </Typography>
                        </Grid>

                        <Grid size="auto">
                            <Box className="social-icons">
                                <IconButton 
                                    className="social-icon" 
                                    href="https://www.facebook.com/nikola.uzunov.18/" 
                                    target="_blank"
                                >
                                    <img src="/images/social-media-icons/facebook-svgrepo-com.svg" alt="Facebook" />
                                </IconButton>
                                <IconButton 
                                    className="social-icon" 
                                    href="https://instagram.com/nikola.uzunov19/" 
                                    target="_blank"
                                >
                                    <img src="/images/social-media-icons/instagram-svgrepo-com.svg" alt="Instagram" />
                                </IconButton>
                                <IconButton 
                                    className="social-icon" 
                                    href="https://nikolauzunov.netlify.app" 
                                    target="_blank"
                                >
                                    <img src="/images/social-media-icons/letter-n-svgrepo-com.svg" alt="Portfolio" />
                                </IconButton>
                                <IconButton 
                                    className="social-icon" 
                                    href="https://github.com/Nikolla2000" 
                                    target="_blank"
                                >
                                    <img src="/images/social-media-icons/github-svgrepo-com.svg" alt="GitHub" />
                                </IconButton>
                                <IconButton 
                                    className="social-icon" 
                                    href="https://www.linkedin.com/in/nikola-uzunov/" 
                                    target="_blank"
                                >
                                    <img src="/images/social-media-icons/linkedin-svgrepo-com.svg" alt="LinkedIn" />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Footer;