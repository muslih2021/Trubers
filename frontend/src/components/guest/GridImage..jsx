import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import img4 from "../../assets/images/4.png";
import img5 from "../../assets/images/5.png";
import img6 from "../../assets/images/6-1.jpg";
import img7 from "../../assets/images/7.png";

const GridImage = () => {
	return (
		<section className="px-5 mt-8 mb-6">
			{/* Baris Atas */}
			<div className="grid grid-nogutter md:grid-cols-4 gap-3">
				<img
					src={img1}
					alt="img1"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
				<img
					src={img2}
					alt="img2"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
				<img
					src={img3}
					alt="img3"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
				<img
					src={img4}
					alt="img4"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
			</div>

			{/* Baris Bawah */}
			<div className="grid grid-nogutter md:grid-cols-3 gap-3 mt-3">
				<img
					src={img5}
					alt="img5"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
				<img
					src={img6}
					alt="img6"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
				<img
					src={img7}
					alt="img7"
					className="w-full h-15rem object-cover border-round-2xl col"
				/>
			</div>
		</section>
	);
};

export default GridImage;
