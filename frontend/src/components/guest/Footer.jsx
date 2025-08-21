import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='footer-gradient font-jakarta'>
      <div className='grid footer-shell align-items-stretch'>
        {/* Kiri */}
        <div className='col-12 md:col-6 flex flex-column-reverse md:flex-column justify-content-between -mt-3 mb-6 md:m-0'>
          <p className='footer-desc-left hidden md:block text-xl text-center md:text-left'>
            Dari genggamanmu ke seluruh peluang, Telkomsel selalu hadir membuka
            jalan untuk masa depanmu.
          </p>

          <div className='gap-1'>
            <h5 className='text-6xl text-center md:text-left md:text-8xl font-semibold text-white m-0'>
              Trubers
            </h5>
            <p className='text-lg text-white text-center md:text-left m-0 md:pl-4'>
              Telkomsel Trust Builder Sulawesi
            </p>
          </div>
        </div>

        {/* Kanan */}
        <div className='col-12 md:col-6 flex flex-column justify-content-between align-items-end'>
          <div className='text-white text-xs md:text-lg md:text-right address text-center'>
            Jl. A. P. Pettarani No.3, Mannuruki, Kec. Tamalate, Kota Makassar,
            Sulawesi Selatan 90221
          </div>

          <div className='flex gap-3 text-white'>
            <a
              href='https://www.facebook.com/tselsulawesi/'
              target='_blank'
              rel='noopener noreferrer'
              className='footer-link'
            >
              Facebook <ArrowUpRight size={24} />
            </a>
            <a
              href='https://www.instagram.com/tselsulawesi/'
              target='_blank'
              rel='noopener noreferrer'
              className='footer-link'
            >
              Instagram <ArrowUpRight size={24} />
            </a>
            <a className='footer-link' href='mailto:info@telkomsel.com'>
              Email <ArrowUpRight size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
