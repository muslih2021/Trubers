import { Wifi, Shirt, Star, Plane } from 'lucide-react';

const BenefitSection = () => {
  const benefits = [
    {
      icon: <Wifi size={40} className='text-pink-500' />,
      title: 'Bantuan Kuota Akses Internet',
      desc: 'Bikin konten tanpa khawatir kehabisan kuota. Telkomsel siap support kamu biar selalu online!',
    },
    {
      icon: <Shirt size={40} className='text-pink-500' />,
      title: 'Merchandise Keren',
      desc: 'Dapatkan merchandise eksklusif Telkomsel yang bikin kamu makin standout sebagai content creator.',
    },
    {
      icon: <Star size={40} className='text-pink-500' />,
      title: 'Ketemu Content Creator Idola',
      desc: 'Rasakan pengalaman seru bertemu langsung dengan content creator favoritmu. Belajar, sharing, dan dapat inspirasi baru!',
    },
    {
      icon: <Plane size={40} className='text-pink-500' />,
      title: 'Kesempatan Jalan-Jalan Bareng',
      desc: 'Nggak cuma bikin konten, kamu juga bisa dapat pengalaman liburan seru bareng Telkomsel.',
    },
  ];

  return (
    <section id='benefit' className='benefit-section'>
      <div className='flex flex-column align-items-center'>
        <h1 className='text-center text-3xl md:text-6xl'>Benefit Seru Buat Kamu yang Gabung!</h1>
        <p className='text-xs text-center'>
          Nikmati berbagai keuntungan eksklusif dari Telkomsel untuk mendukung
          kreativitasmu sebagai trust builder Telkomsel.
        </p>
      </div>

      <div className='benefit-grid'>
        {benefits.map((item, i) => (
          <div key={i} className='benefit-card'>
            <div className='benefit-icon'>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitSection;
