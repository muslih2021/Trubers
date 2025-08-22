import img8 from "../../assets/images/8.jpg";

const Subscribe = () => {
	return (
		<section id="subscribe" className="p-4">
			<div className="relative w-full h-20rem md:h-30rem overflow-hidden border-round-3xl">
				{/* Background Image */}
				<img src={img8} alt="Img8" className="w-full h-full object-cover" />

				{/* Overlay */}
				<div className="absolute top-0 left-0 w-full h-full bg-black-alpha-70"></div>

				{/* Content */}
				<div className="absolute top-0 left-0 w-full flex flex-column align-items-center justify-content-center text-center z-1 mt-6 md:mt-8">
					<h2 className="subs-text text-white text-xl md:text-5xl font-medium line-height-3">
						Tunjukkan bakatmu bersama Telkomsel Talent dan raih pengalaman seru
						menuju masa depan!
					</h2>

					<a
						href="/regis"
						className="no-underline btn-gradient mt-1 md:mt-5 cursor-pointer"
					>
						Daftar Sekarang
					</a>
				</div>
			</div>
		</section>
	);
};

export default Subscribe;
