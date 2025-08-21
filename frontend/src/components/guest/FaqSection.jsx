import { useState } from 'react';

const FaqSection = () => {
  const faqs = [
    {
      question: 'Apa itu Telkomsel Talent Web?',
      answer:
        'Telkomsel Talent Web adalah platform yang memberikan kesempatan bagi para content creator untuk berkembang, berjejaring, dan mendapatkan dukungan langsung dari Telkomsel.',
    },
    {
      question: 'Apa saja benefit yang bisa saya dapatkan?',
      answer:
        'Kamu bisa mendapatkan bantuan kuota internet, merchandise eksklusif, kesempatan bertemu dengan content creator idola, hingga pengalaman jalan-jalan seru bersama Telkomsel.',
    },
    {
      question: 'Siapa saja yang bisa mendaftar?',
      answer:
        'Platform ini terbuka untuk anak SMA dari kelas 1 sampai kelas 2 yang aktif membuat konten digital.',
    },
    {
      question: 'Apakah ada biaya untuk mengikuti program ini?',
      answer:
        'Tidak ada biaya pendaftaran. Program ini sepenuhnya GRATIS karena Telkomsel ingin mendukung ekosistem kreator di Indonesia.',
    },
    {
      question: 'Bagaimana cara mendaftar?',
      answer:
        'Kamu cukup mengunjungi halaman registrasi di website Telkomsel Talent Web, mengisi data diri, dan melengkapi form yang disediakan. Setelah itu, tim kami akan menghubungi kamu lebih lanjut.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id='faq'
      className='mx-4 md:mx-8 pt-8 pb-6 flex flex-column md:flex-row justify-content-between gap-6'
    >
      {/* Left content */}
      <div className='flex-1'>
        <h2 className='faq-title text-center md:text-left text-4xl md:text-6xl font-medium bg-gradient text-transparent bg-clip-text line-height-3'>
          Frequently Asked <br /> Questions
        </h2>
        <p className='text-center md:text-left text-xs md:text-lg text-600 mt-1 md:mt-2 line-height-3'>
          Temukan jawaban untuk pertanyaan umum yang sering <br />
          ditanyakan tentang Telkomsel Talent.
        </p>
      </div>

      {/* FAQ Cards */}
      <div className='flex flex-column flex-1'>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className='cursor-pointer shadow-2 p-4 md:p-5 border-round-3xl flex flex-column align-items-start mb-4 transition-all hover:shadow-4'
            onClick={() => toggleFAQ(index)}
          >
            <h4 className='text-sm md:text-lg font-medium'>{faq.question}</h4>
            <p
              className={`faq-desc text-xs md:text-sm text-600 mt-3 transition-all duration-300 ${
                openIndex === index ? 'block' : 'hidden'
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
