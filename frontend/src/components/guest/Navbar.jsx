import { useState } from 'react';
import icon from '../../assets/images/icon.svg';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className='px-5 py-3 fixed top-0 left-0 right-0 z-5 bg-white font-jakarta'>
      <div className='flex align-items-center justify-content-between w-full'>
        {/* Logo */}
        <a href='/' className='text-3xl font-medium font-poetsen gradient-text'>
          <img src={icon} alt='logo' className='h-2rem md:h-3rem' />
        </a>

        {/* Desktop Menu - Tampil di layar besar */}
        <ul className='hidden md:flex align-items-center md:gap-3 lg:gap-5 list-none m-0 p-0'>
          <li>
            <a
              href='/'
              className='nav-link lg:text-lg md:text-sm'
              onClick={closeMenu}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href='/#benefit'
              className='nav-link lg:text-lg md:text-sm'
              onClick={closeMenu}
            >
              Benefit
            </a>
          </li>
          <li>
            <a
              href='/#faq'
              className='nav-link lg:text-lg md:text-sm'
              onClick={closeMenu}
            >
              FAQ
            </a>
          </li>
          <li>
            <a
              href='/leaderboard'
              className='nav-link lg:text-lg md:text-sm'
              onClick={closeMenu}
            >
              Leaderboard
            </a>
          </li>
        </ul>

        <a
          href='/login'
          className='login-btn no-underline hidden md:inline-block'
        >
          Login
        </a>

        <button
          className='p-2 md:hidden'
          onClick={toggleMenu}
          aria-label='Toggle menu'
        >
          <div className={`hamburger ${isMenuOpen ? 'hamburger--active' : ''}`}>
            <span className='hamburger-line'></span>
            <span className='hamburger-line'></span>
            <span className='hamburger-line'></span>
          </div>
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu--active' : ''}`}>
        <ul className='list-none p-3 m-0 surface-ground border-round'>
          <li className='mb-3'>
            <a href='/' className='nav-link text-lg' onClick={closeMenu}>
              Home
            </a>
          </li>
          <li className='mb-3'>
            <a
              href='/#benefit'
              className='nav-link text-lg'
              onClick={closeMenu}
            >
              Benefit
            </a>
          </li>
          <li className='mb-3'>
            <a href='/#faq' className='nav-link text-lg' onClick={closeMenu}>
              FAQ
            </a>
          </li>
          <li className='mb-3'>
            <a
              href='/leaderboard'
              className='nav-link text-lg'
              onClick={closeMenu}
            >
              Leaderboard
            </a>
          </li>
          <li>
            <button className='login-btn w-full'>Login</button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
