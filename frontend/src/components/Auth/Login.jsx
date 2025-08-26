import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, reset } from "../../features/authSlice.jsx";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { clearToast } from "../../features/toastSlice";
import { Dialog } from "primereact/dialog";
import { showDialog, hideDialog } from "../../features/dialogSlice";
import { Checkbox } from "primereact/checkbox";
import imagelogin from "../../assets/images/loginimage.png";
import lupalogin from "../../assets/images/lupalogin.png";
import successImg from "../../assets/images/success.png";
import logo from "../../assets/images/logo.png";
import logot from "../../assets/images/logot.png";

const Login = () => {
	const dispatch = useDispatch();
	const {
		visible,
		severity,
		message: dialogMessage,
	} = useSelector((state) => state.dialog);
	// toast
	const toastMessage = useSelector((state) => state.toast.message);
	const toastSeverity = useSelector((state) => state.toast.severity);
	//login
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const toast = useRef(null);
	const { user, isError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);
	const [rememberMe, setRememberMe] = useState(false);

	useEffect(() => {
		if (toastMessage) {
			dispatch(
				showDialog({
					severity: toastSeverity,
					message: toastMessage,
					visible: true,
				})
			);
			dispatch(clearToast());
		}
	}, [toastMessage, toastSeverity, dispatch]);

	useEffect(() => {
		if (isSuccess || user) {
			dispatch(reset());
		}

		if (isError && message) {
			toast.current.show({
				severity: "error",
				summary: "Login Gagal",
				detail: message,
				life: 3000,
			});
			dispatch(reset());
		}
	}, [isSuccess, isError, message, user, dispatch, navigate]);
	const Auth = (e) => {
		e.preventDefault();
		dispatch(LoginUser({ email, password, rememberMe }));
	};

	const tutorials = [
		{
			id: 1,
			title: "Saatnya Kamu Bersinar!",
			description:
				"Daftarkan dirimu sekarang dan mulai jadi trust builder Telkomsel. Kreativitasmu layak dikenal seluruh Indonesia!",
			image: imagelogin,
			namaTombol: "Registrasi",
			link: "/regis",
		},
		{
			id: 2,
			title: "Lupa password?",
			description:
				"Tenang, kamu bisa reset password-mu dalam beberapa langkah mudah.",
			image: lupalogin,
			namaTombol: "Lupa Password",
			link: "/forgot-password",
		},
	];

	const tutorialTemplate = (tutorial) => {
		return (
			<div className="text-center fadeinright animation-duration-1000">
				<div className=" white text-center flex align-items-center justify-content-center flex-column">
					<img style={{ width: "60%", height: "auto" }} src={tutorial.image} />
					<h2 className="md:text-2xl text-lg lufga-extra-bold">
						{tutorial.title}
					</h2>
					<p className=" md:text-base text-sm text-center md:w-12 w-8">
						{" "}
						{tutorial.description}
					</p>
					<div className="my-2 flex flex-wrap  justify-content-center">
						<NavLink to={tutorial.link}>
							<Button
								label={tutorial.namaTombol}
								style={{ color: "white" }}
								severity="secondary"
								className="shadow-5 hover:shadow-1"
								text
							/>
						</NavLink>
					</div>
				</div>
			</div>
		);
	};

	return (
    <div className='flex fadein background-gradientLogin  animation-duration-2000  flex-column md:flex-row min-h-screen  min-w-screen'>
      <Dialog
        header={
          <div className='text-secondary text-2xl lufga-extrabold'>
            {severity === 'success' ? 'Success' : 'Error'}
          </div>
        }
        visible={visible}
        onHide={() => dispatch(hideDialog())}
        style={{ width: '30vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <div className='fadein animation-duration-1000 flex flex-column justify-content-center align-items-center gap-2'>
          <img style={{ width: '9rem', height: 'auto' }} src={successImg} />
          <h3 className='text-center m-0  text-secondary'>
            Registrasi {dialogMessage} !
          </h3>
          <p className='text-sm text-center font-italic'>
            "Akun Anda sedang dalam proses verifikasi. Silakan cek email Anda
            secara berkala untuk informasi lebih lanjut."
          </p>
        </div>
      </Dialog>
      <Toast ref={toast} />

      <form
        onSubmit={Auth}
        className='py-4   md:-mt-6 bg-white  flex-order-3 md:flex-order-1 flex-1 flex flex-column  align-items-center justify-content-center'
      >
        <div className='md:w-9 fadeinup gap-3  animation-duration-2000  align-items-center md:-ml-8 flex md:-mt-8  md:mb-8'>
          <img
            src={logo}
            alt=''
            className='md:w-8rem w-8rem  '
          />
          <img
            src={logot}
            alt=''
            className='md:w-8rem  w-8rem  '
          />
        </div>

        <h1 className='w-9 text-title text-5xl text-left lufga-extrabold fadeinup animation-duration-1000'>
          Sign in
        </h1>
        <p
          style={{ color: 'var(--surface-400)' }}
          className='lufga text-sm -mt-3 w-9 text-left'
        >
          Selamat Datang di aplikasi TselVibes
        </p>

        <FloatLabel className='mb-4 mt-6 w-9 fadeinleft animation-duration-1000'>
          <InputText
            required
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=':p-inputtext-sm md:p-inputtext-md w-full'
          />
          <label className='lufga' htmlFor='email'>
            Email
          </label>
        </FloatLabel>

        <FloatLabel className='my-4 fadeinleft animation-duration-1000 w-9'>
          <Password
            feedback={false}
            tabIndex={1}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputId='password'
            toggleMask
            className='p-inputtext-md w-full'
            pt={{ input: { className: 'w-full' } }}
          />
          <label className='lufga' htmlFor='password'>
            Password
          </label>
        </FloatLabel>
        <div className='w-9 mb-3 flex gap-2 align-items-center'>
          <Checkbox
            id='rememberMe'
            onChange={(e) => setRememberMe(e.target.checked)}
            checked={rememberMe}
          ></Checkbox>
          <label
            className='text-sm '
            style={{ color: 'var(--surface-400)' }}
            htmlFor='rememberMe'
          >
            Ingat Saya
          </label>
        </div>
        <div className='flex w-9 '>
          <p
            style={{ color: 'var(--surface-400)' }}
            className='mt-2 flex-1  text-left text-sm'
          >
            Belum punya akun?{' '}
            <Link to='/regis' className='Link lufga'>
              Sign Up
            </Link>
          </p>
          <Link
            to='/forgot-password'
            className='mt-2 flex-1 Link lufga text-right  text-sm'
          >
            Lupa password?
          </Link>
        </div>
        <Button
          label={isLoading ? 'Loading.....' : 'Log in'}
          type='submit'
          className=' lufga-semi-bold mt-3 fadeindown animation-duration-1000 gradient-button w-9'
        />
      </form>

      <div className='  pt-4  align-items-center   flex-order-1 md:flex-order-3 flex-1  text-center flex justify-content-center'>
        <div className='card  flex justify-content-center align-items-center '>
          <Carousel
            value={tutorials}
            numScroll={1}
            numVisible={1}
            itemTemplate={tutorialTemplate}
            circular
            autoplayInterval={8000}
            pt={{
              indicators: { className: 'custom-dots' },
              previousButton: { className: 'custom-prev' },
              nextButton: { className: 'custom-next' },
            }}
          />
        </div>
      </div>
      <div className='w-full  md:w-10rem -mb-4 md:-mb-0 -ml-0 md:-ml-2 md:h-screen md:overflow-hidden  flex-order-2'>
        <svg
          className='hidden  md:block'
          id='visual'
          viewBox='0 0 540 960'
          width='540'
          height='960'
          xmlns='http://www.w3.org/2000/svg'
          xmlns:xlink='http://www.w3.org/1999/xlink'
          version='1.1'
        >
          <path
            d='M34 0L40 22.8C46 45.7 58 91.3 67.2 137C76.3 182.7 82.7 228.3 77 274C71.3 319.7 53.7 365.3 63.8 411.2C74 457 112 503 132.3 548.8C152.7 594.7 155.3 640.3 148 686C140.7 731.7 123.3 777.3 128.3 823C133.3 868.7 160.7 914.3 174.3 937.2L188 960L0 960L0 937.2C0 914.3 0 868.7 0 823C0 777.3 0 731.7 0 686C0 640.3 0 594.7 0 548.8C0 503 0 457 0 411.2C0 365.3 0 319.7 0 274C0 228.3 0 182.7 0 137C0 91.3 0 45.7 0 22.8L0 0Z'
            fill='#FFFFFF'
            stroke-linecap='round'
            stroke-linejoin='miter'
          ></path>
        </svg>
        <svg
          id='visual'
          viewBox='0 0 960 80'
          width='960'
          height='80'
          xmlns='http://www.w3.org/2000/svg'
          xmlns:xlink='http://www.w3.org/1999/xlink'
          version='1.1'
        >
          <path
            d='M0 16L8.8 24.3C17.7 32.7 35.3 49.3 53.2 54.3C71 59.3 89 52.7 106.8 48.7C124.7 44.7 142.3 43.3 160 44.8C177.7 46.3 195.3 50.7 213.2 52C231 53.3 249 51.7 266.8 48C284.7 44.3 302.3 38.7 320 39.2C337.7 39.7 355.3 46.3 373.2 50.8C391 55.3 409 57.7 426.8 59C444.7 60.3 462.3 60.7 480 59.5C497.7 58.3 515.3 55.7 533.2 56.3C551 57 569 61 586.8 63C604.7 65 622.3 65 640 62.2C657.7 59.3 675.3 53.7 693.2 48.2C711 42.7 729 37.3 746.8 34.2C764.7 31 782.3 30 800 35.2C817.7 40.3 835.3 51.7 853.2 52C871 52.3 889 41.7 906.8 34.8C924.7 28 942.3 25 951.2 23.5L960 22L960 81L951.2 81C942.3 81 924.7 81 906.8 81C889 81 871 81 853.2 81C835.3 81 817.7 81 800 81C782.3 81 764.7 81 746.8 81C729 81 711 81 693.2 81C675.3 81 657.7 81 640 81C622.3 81 604.7 81 586.8 81C569 81 551 81 533.2 81C515.3 81 497.7 81 480 81C462.3 81 444.7 81 426.8 81C409 81 391 81 373.2 81C355.3 81 337.7 81 320 81C302.3 81 284.7 81 266.8 81C249 81 231 81 213.2 81C195.3 81 177.7 81 160 81C142.3 81 124.7 81 106.8 81C89 81 71 81 53.2 81C35.3 81 17.7 81 8.8 81L0 81Z'
            fill='#FFFFFF'
            stroke-linecap='round'
            stroke-linejoin='miter'
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;
