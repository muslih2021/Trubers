import { ArrowRight } from "lucide-react";

const Hero = () => {
	return (
		<section className="hero text-center px-5 mt-5 md:mt-8">
			<h2 className="text-3xl md:text-7xl mb-4">
				Saatnya Kamu Jadi <br />
				Trust Builder Telkomsel!
			</h2>

			<p className="hero-desc text-xs md:text-lg">
				Dari bikin konten hits, dapet pengalaman keren, sampai dikenal luas—ini
				peluang emas buat siapa pun yang mau unjuk gigi di dunia digital.
			</p>

			<a href="/regis" className="btn-gradient no-underline mx-auto">
				Mulai Sekarang <ArrowRight size={20} />
			</a>
		</section>
	);
};

export default Hero;
