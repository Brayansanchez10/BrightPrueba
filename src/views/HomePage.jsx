import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NavigationBar from "../components/Home/NavigationBar";
import QuoteCarousel from "../components/Home/QuoteCarousel";
import Footer from "../components/footer.jsx";
import { useTranslation } from "react-i18next";
import logo from "../assets/img/hola.png";
import Testimonials from "../components/Home/Testimonials";
import { GrCertificate } from "react-icons/gr";
import {
  PiChalkboardTeacherLight,
  PiDesktopTower,
  PiNewspaperDuotone,
} from "react-icons/pi";
import PHPImage from "../assets/img/Courses_home/php.jpg";
import JSImage from "../assets/img/Courses_home/js.jpg";
import MusicImage from "../assets/img/Courses_home/music.jpg";
import ArtImage from "../assets/img/Courses_home/art.jpg";
import ExerciseImage from "../assets/img/Courses_home/exercise.jpg";
import Cooking from "../assets/img/Courses_home/cooking.jpg";
import Sport from "../assets/img/Courses_home/sport.jpg";
import Ecology from "../assets/img/Courses_home/ecology.jpg";
import Disruptive from "../assets/img/Courses_home/Disruptive.jpg";
import "../css/animations.css";

const fadeInFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.2 } },
};

const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={staggerChildren}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const { t } = useTranslation("global");

  const phrases = [
    {
      text: t("home.quotes.da_vinci"),
      author: "Leonardo da Vinci",
      imageUrl:
        "https://fotos.perfil.com/2021/04/29/leonardo-da-vinci-1165623.jpg",
    },
    {
      text: t("home.quotes.mandela"),
      author: "Nelson Mandela",
      imageUrl:
        "https://www.lavanguardia.com/files/og_thumbnail/uploads/2019/05/03/5fa532fa58cb7.jpeg",
    },
    {
      text: t("home.quotes.sassoon"),
      author: "Vidal Sassoon",
      imageUrl:
        "https://www.hola.com/horizon/landscape/6ec9f609b7e9-portrait-of-british-hairdresser-businessman-vidal-sassoon-london-england-septemb.jpg",
    },
    {
      text: t("home.quotes.einstein_idea"),
      author: "Albert Einstein",
      imageUrl:
        "https://www.cronista.com/files/image/714/714111/6560f70c1366a.jpg",
    },
    {
      text: t("home.quotes.davis"),
      author: "Colin R. Davis",
      imageUrl:
        "https://cdn.images.express.co.uk/img/dynamic/140/590x/sir-colin-davic-conductor-393267.jpg?r=1686998680160",
    },
    {
      text: t("home.quotes.einstein_knowledge"),
      author: "Albert Einstein",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT82A-ADUvO5mdNwh2omNUDF4Y0xHqMh5wVpQ&s",
    },
  ];

  const profiles = [
    {
      name: "Park Jee",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageUrl: logo,
    },
    {
      name: "Jasmine Vandervort",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageUrl: logo,
    },
    {
      name: "Jasmine Vandervort",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageUrl: logo,
    },
    {
      name: "Jasmine Vandervort",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageUrl: logo,
    },
    {
      name: "Jasmine Vandervort",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageUrl: logo,
    },
  ];

  return (
    <div className="bg-primary">
      <NavigationBar />
      <div className="flex flex-col mt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-24 md:mt-5"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <QuoteCarousel phrases={phrases} />
          </motion.div>
        </motion.div>

        <AnimatedSection className="py-10 md:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-10 mx-5 md:mx-10 lg:mx-20">
            <motion.div
              className="w-full lg:w-1/2 mx-auto xl:w-1/3"
              variants={fadeInFromLeft}
            >
              <h2 className="text-primary text-center text-4xl md:text-5xl lg:text-6xl font-bungee mb-6">
                {t("home.welcome")}
                <motion.span
                  className="text-purple-900 dark:text-secondary"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  bringmind
                </motion.span>
              </h2>
              <p className="text-primary text-base md:text-lg lg:text-2xl text-justify">
                {t("home.welcome_message")}
              </p>
            </motion.div>
            <motion.div
              className="bg-purple-900 dark:bg-secondary rounded-t-full rounded-b-3xl w-1/3 items-center hidden xl:flex mx-auto"
              variants={fadeInFromLeft}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img
                src={logo}
                alt="Aquí hay una imagen"
                className="py-20 mx-auto"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.div
              className="w-full lg:w-1/2 xl:w-1/3"
              variants={fadeInFromLeft}
            >
              <h2 className="text-center text-4xl md:text-5xl lg:text-6xl text-purple-900 dark:text-secondary font-bungee mb-6">
                {t("home.mission")}
              </h2>
              <p className="text-primary text-base md:text-lg lg:text-2xl text-justify mb-8">
                {t("home.mission_message")}
              </p>
              <motion.div
                className="flex flex-col md:flex-row gap-5 mx-4"
                variants={staggerChildren}
              >
                {[
                  {
                    number: <span className="dark:text-secondary">10+</span>,
                    text1: <span className="text-primary">{t("home.experience_y")}</span>,
                    text2: <span className="text-primary">{t("home.experience")}</span>,
                  },
                  {
                    number: <span className="dark:text-secondary">29+</span>,
                    text1: <span className="text-primary">{t("home.total")}</span>,
                    text2: <span className="text-primary">{t("home.course")}</span>,
                  },
                  {
                    number: <span className="dark:text-secondary">50k+</span>,
                    text1: <span className="text-primary">{t("home.student")}</span>,
                    text2: <span className="text-primary">{t("home.active")}</span>,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="w-full md:w-1/3 text-center"
                    variants={fadeInFromLeft}
                  >
                    <motion.h2
                      className="font-bungee text-3xl md:text-4xl text-purple-900"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.number}
                    </motion.h2>
                    <p className="text-sm md:text-base">
                      {item.text1}
                      <br />
                      {item.text2}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-10 md:py-16 lg:py-20">
          <div className="mx-5 md:mx-10 lg:mx-20">
            <motion.h2
              className="text-center text-3xl md:text-4xl lg:text-5xl font-bungee mb-10"
              variants={fadeInFromLeft}
            >
              <span className="text-purple-900 dark:text-secondary">bringmind </span>
              <span className="text-primary">{t("home.offert")}</span>
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto max-w-full"
              variants={staggerChildren}
            >
              {[
                {
                  icon: PiChalkboardTeacherLight,
                  title: "home.quality",
                  message: "home.quality_message",
                  bgColor: "bg-purple-800",
                },
                {
                  icon: PiDesktopTower,
                  title: "home.online",
                  message: "home.online_message",
                  bgColor: "bg-[#00D8A1]",
                },
                {
                  icon: GrCertificate,
                  title: "home.certificate",
                  message: "home.certificate_message",
                  bgColor: "bg-purple-800",
                },
                {
                  icon: PiNewspaperDuotone,
                  title: "home.diversity",
                  message: "home.diversity_message",
                  bgColor: "bg-[#00D8A1]",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`bg-secondary rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105`}
                  variants={fadeInFromLeft}
                >
                  <div className="p-8 text-center">
                    <div className={`${item.bgColor} rounded-full p-4 inline-block mb-4`}>
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <item.icon className="text-white" size={60} />
                      </motion.div>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-primary">
                      {t(item.title)}
                    </h3>
                    <p className="text-base lg:text-lg text-gray-600 dark:text-primary">
                      {t(item.message)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="mt-12 flex justify-center"
              variants={fadeInFromLeft}
            >
              <motion.button
                className="bg-purple-800 text-white text-xl rounded-full py-4 px-8 hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl font-bungee"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("home.go_courses")}
              </motion.button>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-10 md:py-16 lg:py-20">
          <div className="mx-5 md:mx-10 lg:mx-20">
            <motion.h2
              className="text-center text-3xl md:text-4xl lg:text-5xl font-bungee mb-10"
              variants={fadeInFromLeft}
            >
              <span className="text-primary">{t("home.feature")}</span>{" "}
              <span className="text-purple-900 dark:text-secondary">bringmind</span>
            </motion.h2>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto max-w-6xl"
              variants={staggerChildren}
            >
              {[
                { image: JSImage, title: "home.js" },
                { image: PHPImage, title: "home.php" },
                { image: MusicImage, title: "home.music" },
                { image: ArtImage, title: "home.art" },
                { image: ExerciseImage, title: "home.exercise" },
                { image: Cooking, title: "home.cooking" },
                { image: Sport, title: "home.sport"   },
                { image: Ecology, title: "home.ecology" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  variants={fadeInFromLeft}
                >
                  <div className="w-full aspect-square overflow-hidden rounded-xl">
                    <motion.img
                      src={item.image}
                      alt={t(item.title)}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-purple-900 dark:text-primary text-base sm:text-lg font-semibold mt-2 text-center">
                    {t(item.title)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-10 md:py-16 lg:py-20">
          <div className="mx-5 md:mx-10 lg:mx-20">
            <motion.h2
              className="text-center text-3xl md:text-4xl lg:text-5xl font-bungee mb-10"
              variants={fadeInFromLeft}
            >
              <span className="text-primary">{t("home.testimonial")}</span>{" "}
              <span className="text-purple-900 dark:text-secondary">bringmind</span>
            </motion.h2>
            <motion.div variants={fadeInFromLeft}>
              <Testimonials profiles={profiles} />
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-10 md:py-16 lg:py-20 mb-10 md:mb-16 lg:mb-8">
          <div className="mx-5 md:mx-10 lg:mx-20">
            <motion.h2
              className="text-center text-3xl md:text-4xl lg:text-5xl font-bungee text-purple-900 dark:text-secondary mb-10"
              variants={fadeInFromLeft}
            >
              {t("home.partners")}
            </motion.h2>
            <motion.div className="flex justify-center" variants={fadeInFromLeft}>
              <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                <p className="text-lg md:text-xl text-center mb-6">
                  <span className="text-primary">{t("home.partners_message")}</span>
                </p>
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={Disruptive}
                    alt="Partner"
                    className="w-full rounded-lg"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  );
}