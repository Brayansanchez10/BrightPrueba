import NavigationBar from '../components/Home/NavigationBar';
import QuoteCarousel from '../components/Home/QuoteCarousel';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import logo from '../assets/img/hola.png';

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
    

    return (
        <div className=''>
            <NavigationBar/>
            <div className="flex flex-col bg-slate-300">
                <div className='mt-16 p-0'>
                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <QuoteCarousel phrases={phrases} />
                    </div>

                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <div className='flex flex-col lg:flex-row gap-10 mx-5 md:mx-10 lg:mx-20 my-10'>
                            <div className='w-full lg:w-1/3 mx-auto p-6'>
                                <h2 className='text-center text-4xl md:text-5xl lg:text-5xl font-bungee pt-10'>Welcome to <span className='text-purple-900'>BRIGMIND</span></h2>
                                <p className='text-base md:text-xl lg:text-2xl text-justify pt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae aspernatur, culpa asperiores cupiditate dignissimos minima itaque beatae atque repellendus sapiente. Est laboriosam reprehenderit adipisci tempore aliquam voluptatum earum magnam, porro quibusdam cumque voluptate beatae alias consequuntur repellat recusandae assumenda voluptates nobis eveniet. Nobis corporis itaque quo voluptate ducimus nisi dolore.</p>
                            </div>
                            <div className='bg-purple-900 rounded-t-full rounded-b-3xl w-1/3 items-center hidden lg:flex mx-auto'>
                                <img src={logo} alt="Aquí hay una imagen" className='py-20 mx-auto' />
                            </div>
                            <div className='w-full lg:w-1/3 pt-6'>
                                <h2 className='text-center text-4xl md:text-5xl lg:text-5xl text-purple-900 font-bungee pt-10'>our mission</h2>
                                <p className='text-base md:text-xl lg:text-2xl text-justify pt-5 pb-10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, inventore ex optio ullam recusandae voluptate.</p>
                                <div className='flex flex-col md:flex-row gap-5 mx-4'>
                                    <div className='w-full md:w-1/3 text-center'>
                                        <h2 className='font-bungee text-2xl md:text-3xl text-purple-900'>10+</h2>
                                        <p className='text-lg md:text-2xl'>Year<br/>Experience</p>
                                    </div>
                                    <div className='w-full md:w-1/3 text-center'>
                                        <h2 className='font-bungee text-2xl md:text-3xl text-purple-900'>29+</h2>
                                        <p className='text-lg md:text-2xl'>Total<br/>Course</p>
                                    </div>
                                    <div className='w-full md:w-1/3 text-center'>
                                        <h2 className='font-bungee text-2xl md:text-3xl text-purple-900'>50k+</h2>
                                        <p className='text-lg md:text-2xl'>Student<br/>Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='md:pb-5  sm:pb-0 lg:pb-20'>
                        <div className='my-10 p-6'>
                            <h2 className='text-center text-4xl md:text-5xl lg:text-5xl font-bungee'>
                                <span className='text-purple-900'>bringmind</span> offers knowledge like
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-20 mx-5 md:mx-10 lg:mx-20'>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <img src={logo} alt="" className='w-32 lg:w-48 mx-auto'/>
                                        <h3 className='text-xl lg:text-2xl'>Quality information</h3>
                                        <p className='pt-6 text-base lg:text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, ut?</p>
                                    </div>
                                </div>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <img src={logo} alt="" className='w-32 lg:w-48 mx-auto'/>
                                        <h3 className='text-xl lg:text-2xl'>Online course</h3>
                                        <p className='pt-6 text-base lg:text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, ut?</p>
                                    </div>
                                </div>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <img src={logo} alt="" className='w-32 lg:w-48 mx-auto'/>
                                        <h3 className='text-xl lg:text-2xl'>Certificate course</h3>
                                        <p className='pt-6 text-base lg:text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, ut?</p>
                                    </div>
                                </div>
                                <div className='border border-black bg-white rounded-3xl'>
                                    <div className='my-10 lg:my-24 text-center'>
                                        <img src={logo} alt="" className='w-32 lg:w-48 mx-auto'/>
                                        <h3 className='text-xl lg:text-2xl'>Diversity of courses</h3>
                                        <p className='pt-6 text-base lg:text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, ut?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p>feature</p>
                    </div>
                    <div>
                        <p>testiminio</p>
                    </div>
                    <div>
                        <p>partnes</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        
    );
}

export default HomePage;
