import GridImage from "../../components/guest/GridImage.";
import Navbar from "../../components/guest/Navbar";
import Hero from "../../components/guest/Hero";
import BenefitSection from "../../components/guest/BenefitSection";
import FaqSection from "../../components/guest/FaqSection";
import Subscribe from "../../components/guest/Subscribe";
import Footer from "../../components/guest/Footer";

const Home = () => {
	return (
		<div className="min-h-screen bg-white  font-jakarta">
			<Navbar />
			<Hero />
			<GridImage />
			<BenefitSection />
			<FaqSection />
			<Subscribe />
			<Footer />
		</div>
	);
};

export default Home;
