import NavigationBar from '../components/Home/NavigationBar';
import QuoteCarousel from '../components/Home/QuoteCarousel';
import Footer from '../components/footer.jsx';
import { useTranslation } from 'react-i18next';
import logo from '../assets/img/hola.png';
import Testimonials from '../components/Home/Testimonials';
import { GrCertificate } from "react-icons/gr";
import { PiChalkboardTeacherLight, PiDesktopTower, PiNewspaperDuotone } from "react-icons/pi";
import PHPImage from '../assets/img/Courses_home/php.jpg';
import JSImage from '../assets/img/Courses_home/js.jpg';
import MusicImage from '../assets/img/Courses_home/music.jpg';
import ArtImage from '../assets/img/Courses_home/art.jpg';
import ExerciseImage from '../assets/img/Courses_home/exercise.jpg';
import Cooking from '../assets/img/Courses_home/cooking.jpg';
import Sport from '../assets/img/Courses_home/sport.jpg';
import Ecology from '../assets/img/Courses_home/ecology.jpg';
import Disruptive from '../assets/img/Courses_home/Disruptive.jpg';
import "../css/animations.css";

const HomePage = () => {
    const { t } = useTranslation("global");

    const phrases = [
        { text: t('home.quotes.da_vinci'), author: 'Leonardo da Vinci', imageUrl: 'https://fotos.perfil.com/2021/04/29/leonardo-da-vinci-1165623.jpg' },
        { text: t('home.quotes.mandela'), author: 'Nelson Mandela', imageUrl: 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2019/05/03/5fa532fa58cb7.jpeg' },
        { text: t('home.quotes.sassoon'), author: 'Vidal Sassoon', imageUrl: 'https://www.hola.com/horizon/landscape/6ec9f609b7e9-portrait-of-british-hairdresser-businessman-vidal-sassoon-london-england-septemb.jpg' },
        { text: t('home.quotes.einstein_idea'), author: 'Albert Einstein', imageUrl: 'https://www.cronista.com/files/image/714/714111/6560f70c1366a.jpg' },
        { text: t('home.quotes.davis'), author: 'Colin R. Davis', imageUrl: 'https://cdn.images.express.co.uk/img/dynamic/140/590x/sir-colin-davic-conductor-393267.jpg?r=1686998680160' },
        { text: t('home.quotes.einstein_knowledge'), author: 'Albert Einstein', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT82A-ADUvO5mdNwh2omNUDF4Y0xHqMh5wVpQ&s' }
    ];

    const profiles = [
        {
            name: 'Park Jee',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            imageUrl: logo ,
        },
        {
            name: 'Jasmine Vandervort',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            imageUrl: logo,
        },
        {
            name: 'Jasmine Vandervort',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            imageUrl: logo,
        },
        {
            name: 'Jasmine Vandervort',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            imageUrl: logo,
        },
        {
            name: 'Jasmine Vandervort',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            imageUrl: logo,
        },
    ];
    

    return (
        <div className=''>
            <NavigationBar/>
            <div className="flex flex-col bg-slate-300 mt-5">
                <div className='mt-4 p-0'>
                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <QuoteCarousel phrases={phrases} />
                    </div>

                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <div className='flex flex-col lg:flex-row gap-10 mx-5 md:mx-10 lg:mx-20 my-10'>
                            <div className='w-full lg:w-1/2 mx-auto p-6 xl:w-1/3'>
                                <h2 className='text-center text-4xl md:text-5xl lg:text-5xl font-bungee pt-10'>{t('home.welcome')}<span className='text-purple-900'>bringmind</span></h2>
                                <p className='text-base md:text-xl lg:text-2xl text-justify pt-5'>{t('home.welcome_message')}</p>
                            </div>
                            <div className='bg-purple-900 rounded-t-full rounded-b-3xl w-1/3 items-center hidden xl:flex mx-auto'>
                                <img src={logo} alt="Aquí hay una imagen" className='py-20 mx-auto' />
                            </div>
                            <div className='w-full lg:w-1/2 pt-6 xl:w-1/3'>
                                <h2 className='text-center text-4xl md:text-5xl lg:text-5xl text-purple-900 font-bungee pt-10'>{t('home.mission')}</h2>
                                <p className='text-base md:text-xl lg:text-2xl text-justify pt-5 pb-10'>{t('home.mission_message')}</p>
                                <div className='flex flex-col md:flex-row gap-5 mx-4'>
                                    <div className='w-full md:w-1/3 text-center'>
                                        <h2 className='font-bungee text-2xl md:text-3xl text-purple-900'>10+</h2>
                                        <p className='text-lg md:text-2xl'>{t('home.experience_y')}<br/>{t('home.experience')}</p>
                                    </div>
                                    <div className='w-full md:w-1/3 text-center'>
                                        <h2 className='font-bungee text-2xl md:text-3xl text-purple-900'>29+</h2>
                                        <p className='text-lg md:text-2xl'>{t('home.total')}<br/>{t('home.course')}</p>
                                    </div>
                                    <div className='w-full md:w-1/3 text-center'>
                                        <h2 className='font-bungee text-2xl md:text-3xl text-purple-900'>50k+</h2>
                                        <p className='text-lg md:text-2xl'>{t('home.student')}<br/>{t('home.active')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <div className='my-10 p-6'>
                            <h2 className='text-center text-3xl md:text-5xl lg:text-5xl font-bungee'><span className='text-purple-900'>bringmind </span>{t('home.offert')}</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-20 mx-5 md:mx-10 lg:mx-20'>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <PiChalkboardTeacherLight 
                                            className='text-white bg-purple-800 mx-auto rounded-3xl p-4' 
                                            size={100}
                                            
                                        />
                                        <h3 className='text-xl lg:text-2xl pt-3'>{t('home.quality')}</h3>
                                        <p className='pt-6 text-base lg:text-lg'>{t('home.quality_message')}</p>
                                    </div>
                                </div>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <PiDesktopTower 
                                            className='text-white bg-[#00D8A1] mx-auto rounded-3xl p-4'
                                            size={100}
                                        />
                                        <h3 className='text-xl lg:text-2xl pt-3'>{t('home.online')}</h3>
                                        <p className='pt-6 text-base lg:text-lg'>{t('home.online_message')}</p>
                                    </div>
                                </div>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <GrCertificate 
                                            className='text-white bg-purple-800 mx-auto rounded-3xl p-4'
                                            size={100}
                                        />
                                        <h3 className='text-xl lg:text-2xl pt-3'>{t('home.certificate')}</h3>
                                        <p className='pt-6 text-base lg:text-lg'>{t('home.certificate_message')}</p>
                                    </div>
                                </div>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <PiNewspaperDuotone
                                            className='text-white bg-[#00D8A1] mx-auto rounded-3xl p-4'
                                            size={100}
                                        />
                                        <h3 className='text-xl lg:text-2xl pt-3'>{t('home.diversity')}</h3>
                                        <p className='pt-6 text-base lg:text-lg'>{t('home.diversity_message')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='pt-10 flex justify-center'>
                                <a href="/AllCourses"><button className='bg-purple-800 text-white text-xl rounded-3xl h-14 w-48 hover:bg-purple-600 transition-all duration-500 bt2'>{t('home.go_courses')}</button></a>
                            </div>
                        </div>
                    </div>

                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <div className='my-10 p-6'>
                            <h2 className='text-center text-4xl md:text-5xl lg:text-5xl font-bungee'>{t('home.feature')} <span className='text-purple-900'>bringmmind</span></h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 mx-3 md:mx-10 lg:mx-20'>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={JSImage} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.js')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={PHPImage} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.php')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={MusicImage} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.music')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={ArtImage} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.art')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={ExerciseImage} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.exercise')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={Cooking} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.cooking')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={Sport} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.sport')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-center rounded-3xl p-4 sm:p-6 md:p-8'>
                                        <img src={Ecology} alt="" className='w-3/4 h-3/4 mx-auto sm:w-full sm:h-full rounded-3xl'/>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-purple-900 text-xl sm:text-2xl font-bungee'>{t('home.ecology')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <div className='my-10 p-6'>
                            <h2 className='text-center text-3xl md:text-4xl lg:text-5xl font-bungee'>{t('home.testimonial')} <span className='text-purple-900'>bringmind</span></h2>
                            <div className='md:mx-16 lg:mx-12 pt-10'>
                                <Testimonials profiles={profiles} />
                            </div>
                        </div>
                    </div>

                    <div className='md:pb-5  sm:pb-0 lg:pb-10'>
                        <div className='my-10 p-6'>
                            <h2 className='text-center text-4xl md:text-5xl lg:text-5xl font-bungee text-purple-900'>{t('home.partners')}</h2>
                            <div className='flex justify-center mt-6'>
                                <div className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3'>
                                    <p className='text-xl text-center pb-5'>{t('home.partners_message')}</p>
                                    <div className='p-6 rounded-3xl'>
                                        <img src={Disruptive} alt="" className='mt-4 mx-auto rounded-3xl' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
        
    );
}

export default HomePage;
