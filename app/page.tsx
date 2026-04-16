'use client';

import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // Таймер на 2 минуты
  const [timeLeft, setTimeLeft] = useState(120); 

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");

  // Состояние для даты
  const [eventDate, setEventDate] = useState({ day: '14', month: 'АПРЕЛЯ' });

  // Слайдер отзывов
  const reviewImages = [
    '/images/reviews_phone.png',
    '/images/phone2.png',
    '/images/phone3.png',
    '/images/phone4.png',
    '/images/phone5.png'
  ];
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    if (currentReview < reviewImages.length - 1) {
      setCurrentReview((prev) => prev + 1);
    }
  };

  const prevReview = () => {
    if (currentReview > 0) {
      setCurrentReview((prev) => prev - 1);
    }
  };

  useEffect(() => {
    bridge.send('VKWebAppInit');
    
    const updateEventDate = () => {
      let d = new Date(2026, 3, 14, 19, 0);
      const now = new Date();
      while (now >= d) {
        d.setDate(d.getDate() + 7);
      }
      const months = [
        'ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ',
        'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'
      ];
      setEventDate({
        day: d.getDate().toString(),
        month: months[d.getMonth()]
      });
    };

    updateEventDate();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const filteredVal = val.replace(/[0-9]/g, '');
    setName(filteredVal);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input.startsWith("+7")) {
      setPhone("+7");
      return;
    }
    const digitsAfterPrefix = input.slice(2).replace(/\D/g, '');
    const limitedDigits = digitsAfterPrefix.slice(0, 10);
    setPhone("+7" + limitedDigits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const displayMins = Math.floor(timeLeft / 60).toString();
  const displaySecs = (timeLeft % 60).toString().padStart(2, '0');

  const cocomatClass = "font-[family-name:var(--font-cocomat)]";
  const montClass = "font-[family-name:var(--font-mont)]";
  const btnAnimation = "transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer outline-none";

  return (
    <main className="min-h-screen bg-[#2a0e3d] flex justify-center items-start text-white antialiased font-sans">
      <div className="w-full max-w-[390px] bg-white relative shadow-2xl flex flex-col overflow-x-hidden min-h-screen">

        {/* СЕКЦИЯ 1 */}
        <section className="bg-[#5a2082] relative pb-20">
          <div className="px-5 pt-8 relative z-10">
            <div className="absolute top-[-10px] left-[5px] w-28 h-32 rotate-[-15deg] z-0 opacity-80">
              <Image src="/images/books.png" alt="books" width={112} height={128} className="object-contain" />
            </div>
            <div className="absolute top-[-25px] right-[-20px] w-[168px] h-[192px] rotate-[35deg] z-0 opacity-80">
              <Image src="/images/books.png" alt="books" fill className="object-contain" />
            </div>
            <div className="text-center mb-6 relative z-10 -mt-4 uppercase text-white">
              <p className="text-[14px] font-normal opacity-90 font-sans flex items-center justify-center">
                <span className="tracking-tighter">{eventDate.day}</span>
                <span className={`${cocomatClass} mx-1.5 leading-none pt-[1px]`}>{eventDate.month} В</span>
                <span className="tracking-normal">19:00</span>
              </p>
              <h2 className={`${cocomatClass} text-[22px] font-bold leading-none mt-1`}>Бесплатный</h2>
              <p className="text-[12px] font-normal tracking-[0.1em] mt-1 opacity-80 font-sans">"Менеджер маркетплейсов"</p>
            </div>
            <div className="relative mb-6 flex min-h-[300px] -mt-10">
              <div className="w-full relative z-20 pt-[85px]">
                <h1 className={`${cocomatClass} font-bold text-[26px] leading-[36px] uppercase tracking-[-0.04em] drop-shadow-md text-white`}>
                  КАК С ПОЛНОГО<br/>НУЛЯ НАЧАТЬ<br/>ЗАРАБАТЫВАТЬ ОТ<br/>
                  <span className="font-sans tracking-normal">50.000</span> Р УДАЛЕННО
                </h1>
              </div>
              <div className="absolute right-[-75px] top-[-25px] w-[280px] h-[400px] z-10 pointer-events-none">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-[#df00ff]/40 blur-[70px] rounded-full z-0"></div>
                <div className="relative w-full h-full z-10">
                  <Image src="/images/girl1.png" alt="Girl" fill className="object-contain object-bottom drop-shadow-2xl" priority />
                </div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(180deg, #FF03FF 0%, #BC03FF 100%)' }} className={`rounded-[30px] py-4 px-3 text-center shadow-[0_0_25px_rgba(223,0,255,0.7)] mb-8 relative z-20 -mt-10 flex items-center justify-center min-h-[70px] uppercase text-white ${montClass}`}>
              <p className="text-[15px] text-center leading-[1.2] tracking-tight font-normal">С доступом в реальный кабинет<br/>поставщика на WB</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[24px] py-5 px-6 flex justify-between items-center border border-white/10 shadow-xl mb-8 relative z-20 text-white uppercase font-sans">
              <div className="flex flex-col items-start leading-none">
                <div className="relative inline-block text-white/60 mb-1">
                  <span className="text-[20px] font-normal line-through decoration-[#f04a94] decoration-2">2990</span>
                </div>
                <span className="text-[26px] font-bold">Бесплатно</span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <div className="flex items-center text-[32px] font-normal tabular-nums">
                  <span className="w-10 text-center">{displayMins}</span>
                  <span className="px-1">:</span>
                  <span className="w-10 text-center">{displaySecs}</span>
                </div>
                <div className="flex justify-between w-full text-[9px] opacity-60 mt-1">
                  <span className="w-10 text-center">минут</span>
                  <span className="w-10 text-center">секунд</span>
                </div>
              </div>
            </div>
            <div className="w-full p-1 rounded-full border-2 border-[#f04a94] bg-[#5a2082] shadow-[0_0_20px_rgba(240,74,148,0.4)] mb-4 relative z-20 text-white">
               <button className={`w-full bg-[#f04a94] rounded-full py-5 text-[32px] text-white ${cocomatClass} font-bold flex items-center justify-center leading-none ${btnAnimation}`}>
                 <span className="transform -translate-y-[8px]">Принять участие</span>
               </button>
            </div>
            <p className="text-center text-[10px] leading-tight opacity-70 px-6 uppercase tracking-wider relative z-20 pb-4 text-white font-sans">*Успей присоединиться и забирай пошаговый план освоения профессии</p>
          </div>
          <div className="absolute bottom-0 left-[-10%] w-[120%] h-[60px] bg-white rounded-t-[100%] z-20"></div>
        </section>

        {/* РАСПИСАНИЕ */}
        <section className="bg-white text-black relative pt-8 pb-10 px-5 flex flex-col items-center z-10 font-sans -mt-1 overflow-hidden">
          <div className="absolute top-[160px] right-[-10px] w-[110px] h-[110px] opacity-90 z-0 pointer-events-none rotate-[-15deg]">
             <Image src="/images/wb-icon.png" alt="WB decor" fill className="object-contain" priority />
          </div>
          <div className="absolute top-[570px] left-[-15px] w-[85px] h-[85px] opacity-90 z-0 pointer-events-none rotate-[-5deg]">
             <Image src="/images/wb-icon.png" alt="WB decor" fill className="object-contain" priority />
          </div>
          <div className="absolute bottom-[-20px] right-[70px] w-[130px] h-[130px] opacity-90 z-0 pointer-events-none rotate-[15deg]">
             <Image src="/images/wb-icon.png" alt="WB decor" fill className="object-contain" priority />
          </div>
          <div className="absolute bottom-[-10px] right-[-10%] w-[300px] h-[150px] z-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full"><path d="M0,100 C30,100 40,20 100,50 L100,100 Z" fill="#6c2a93" /></svg>
          </div>
          <h2 className={`${cocomatClass} text-[27px] font-extrabold text-center uppercase leading-[1.2] mb-10 tracking-tight relative z-20`}>Что будет на 3-х<br/>дневном бесплатном<br/>курсе:</h2>
          <div className="flex flex-col items-center text-center w-full mb-10 relative z-20">
            <div className={`bg-[#ea3f9d] text-black ${cocomatClass} font-extrabold text-[18px] py-1.5 px-10 rounded-full mb-4 uppercase`}>1 День</div>
            <p className="text-[20px] leading-snug"><span className="font-bold">Кто такой менеджер Wildberries.</span><br/>План развития менеджера<br/>Зарплата менеджера Wildberries</p>
          </div>
          <div className="flex flex-col items-center text-center w-full mb-10 relative z-20">
            <div className={`bg-[#ea3f9d] text-black ${cocomatClass} font-extrabold text-[18px] py-1.5 px-10 rounded-full mb-4 uppercase`}>2 День</div>
            <p className="text-[20px] leading-snug"><span className="font-bold">Практический урок:</span> «Делаем<br/>карточку товара на<br/>WILDBERRIES» в реальном<br/>кабинете поставщика</p>
          </div>
          <div className="flex flex-col items-center text-center w-full mb-10 relative z-20">
            <div className={`bg-[#ea3f9d] text-black ${cocomatClass} font-extrabold text-[18px] py-1.5 px-10 rounded-full mb-4 uppercase`}>3 День</div>
            <p className="text-[20px] leading-snug"><span className="font-bold">Проверка домашнего задания</span><br/>Какие шаги нужно сделать,<br/>чтобы пройти стажировку с<br/>последующим трудоустройством.<br/>Как выйти на 50тыс. руб.</p>
          </div>
        </section>

        {/* ИРИНА */}
        <section className="bg-[#6c2a93] relative pt-10 pb-16 px-5 flex flex-col items-center z-20 overflow-hidden font-sans">
          <div className="absolute top-[400px] left-[-30px] w-[140px] h-[140px] opacity-90 z-10 pointer-events-none rotate-[-15deg]">
             <Image src="/images/wb-icon.png" alt="WB decor" fill className="object-contain" priority />
          </div>
          <h2 className={`${cocomatClass} text-[26px] font-extrabold text-center uppercase leading-[1.3] mb-8 tracking-wide text-white relative z-20`}>Поставщик<br/>Wildberries<br/>Ирина Левшунова</h2>
          <ul className="text-white text-[17px] leading-[1.4] mb-8 space-y-4 font-normal text-center max-w-[320px] relative z-20">
            <li><span className="inline-block w-1.5 h-1.5 rounded-full bg-white align-middle mr-2 mb-[2px]"></span>8 брендов клиентов на сопровождении</li>
            <li><span className="inline-block w-1.5 h-1.5 rounded-full bg-white align-middle mr-2 mb-[2px]"></span>Общий оборот брендов — 6.5 млн. рублей в месяц</li>
            <li><span className="inline-block w-1.5 h-1.5 rounded-full bg-white align-middle mr-2 mb-[2px]"></span>Личный доход: 600+ тысяч рублей в месяц</li>
            <li><span className="inline-block w-1.5 h-1.5 rounded-full bg-white align-middle mr-2 mb-[2px]"></span>Обучила более 1000 человек профессии «Менеджер Wildberries»</li>
          </ul>
          <div className="relative w-full h-[500px] z-20 pointer-events-none flex justify-center overflow-visible">
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#df00ff]/80 blur-[90px] rounded-full z-0"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[860px] h-[1000px] z-10">
               <Image src="/images/irina.png" alt="Irina" fill className="object-contain object-bottom" priority />
            </div>
          </div>
          <div className="w-full p-1 rounded-full border-2 border-[#f04a94] shadow-[0_0_20px_rgba(240,74,148,0.4)] mb-6 relative z-30 mt-[-145px]">
             <button className={`w-full bg-[#f04a94] rounded-full py-5 text-[28px] text-white ${cocomatClass} font-bold flex items-center justify-center leading-none ${btnAnimation}`}><span className="transform -translate-y-[4px]">Принять участие</span></button>
          </div>
          <div className="flex justify-center gap-6 relative z-30">
            <div className="w-[75px] h-[75px] rounded-full border-[3px] border-[#df00ff] flex flex-col items-center justify-center text-white leading-none bg-[#6c2a93]/50 backdrop-blur-sm relative">
              <span className="text-[22px] font-bold tabular-nums mb-1">{displayMins}</span>
              <span className="text-[10px] opacity-90">минут</span>
            </div>
            <div className="w-[75px] h-[75px] rounded-full border-[3px] border-white flex flex-col items-center justify-center text-white leading-none bg-[#6c2a93]/50 backdrop-blur-sm relative">
              <span className="text-[22px] font-bold tabular-nums mb-1">{displaySecs}</span>
              <span className="text-[10px] opacity-90">секунд</span>
            </div>
          </div>
        </section>

        {/* ДЛЯ КОГО */}
        <section className="bg-white text-black relative pt-16 pb-2 px-8 flex flex-col items-center z-10 overflow-hidden font-sans">
          <div className="absolute bottom-[-15px] right-[-15px] w-28 h-28 opacity-100 pointer-events-none rotate-[10deg]">
            <Image src="/images/wb-icon.png" alt="WB icon" width={112} height={112} className="object-contain" />
          </div>
          <div className="absolute top-[-1px] left-0 w-full h-[100px] pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full rotate-180"><path d="M0,100 C30,100 40,20 100,50 L100,100 Z" fill="#6c2a93" /></svg>
          </div>
          <h2 className={`${cocomatClass} text-[22px] font-extrabold text-center uppercase leading-[1.2] mb-12 tracking-tight w-full pt-10`}>Этот практический<br/>курс для вас, если вы:</h2>
          <ul className="flex flex-col gap-10 w-full pl-2">
            {[
              { text: "Мама, которая хочет иметь финансовую независимость и проводить время с детьми", filled: true },
              { text: "Хотите перейти в онлайн, обучиться самой востребованной профессии", filled: false },
              { text: "Работник в найме, который хочет сменить место работы", filled: true },
              { text: "Ищете удаленную профессию, которую можно совмещать с основной работой или учебой", filled: false },
              { text: "Предприниматель, который ищет новые возможности для своего бизнеса", filled: true },
              { text: "Хотите выйти на доход от 50 000 рублей в месяц", filled: false },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-5">
                <div className={`mt-1.5 shrink-0 w-[12px] h-[12px] rounded-full shadow-[0_0_12px_rgba(234,63,157,0.6)] ${item.filled ? 'bg-[#ea3f9d]' : 'border-2 border-[#ea3f9d] bg-white'}`}></div>
                <p className="text-[17px] leading-[1.3] font-normal text-black">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* СЛАЙДЕР */}
        <section className="bg-white relative pb-5 px-5 flex flex-col items-center z-10 overflow-hidden font-sans">
          <h2 className={`${cocomatClass} text-[22px] font-extrabold text-center uppercase leading-[1.2] mb-10 tracking-tight w-full relative z-10 text-black`}>
            Нам доверяют:<br/>наши отзывы
          </h2>
          <div className="relative w-full flex justify-center items-center z-10">
            <div className="relative w-[350px] h-[600px] transition-all duration-500">
               <Image src={reviewImages[currentReview]} alt={`Review ${currentReview + 1}`} fill className="object-contain" priority />
            </div>
          </div>
        </section>

        {/* УПРАВЛЕНИЕ СЛАЙДЕРОМ */}
        <section className="bg-white relative pt-4 pb-30 px-8 flex flex-col items-center z-10 overflow-hidden font-sans">
          <div className="flex justify-center gap-6 mb-12 relative z-10">
            <button onClick={prevReview} disabled={currentReview === 0} className={`${btnAnimation} w-[75px] h-[75px] relative ${currentReview === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>
               <Image src="/images/buttom_left.png" alt="prev" fill className="object-contain" />
            </button>
            <button onClick={nextReview} disabled={currentReview === reviewImages.length - 1} className={`${btnAnimation} w-[75px] h-[75px] relative ${currentReview === reviewImages.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}>
               <Image src="/images/buttom_right.png" alt="next" fill className="object-contain" />
            </button>
          </div>
          <h2 className={`${cocomatClass} text-[28px] font-black text-center uppercase leading-[1.1] text-black tracking-tight relative z-10`}>ОТЗЫВЫ НАШИХ<br/>УЧЕНИКОВ О<br/>БЕСПЛАТНОМ КУРСЕ</h2>
          <div className="absolute bottom-[-1px] left-0 w-full h-[140px] z-0 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-100"><path d="M0,100 C30,100 40,20 100,50 L100,100 Z" fill="#6c2a93" /></svg>
          </div>
        </section>

        {/* ФОРМА */}
        <section className="bg-[#6c2a93] relative pt-12 pb-20 px-8 flex flex-col items-center z-10 overflow-hidden font-sans">
          <div className="absolute top-[20%] left-[-20px] w-24 h-24 rotate-[-15deg] opacity-80 z-0">
            <Image src="/images/wb-icon.png" alt="WB decor" fill className="object-contain" />
          </div>
          <div className="text-center mb-10 relative z-10">
            <h2 className={`${cocomatClass} text-[24px] font-black text-white uppercase leading-tight mb-2`}>БЕСПЛАТНЫЙ<br/>ПРАКТИЧЕСКИЙ КУРС</h2>
            <p className={`${cocomatClass} text-[14px] font-bold text-white mt-4`}>{eventDate.day} {eventDate.month} В 19:00</p>
          </div>
          <div className="w-full bg-white/10 backdrop-blur-md rounded-[24px] p-6 mb-8 flex justify-between items-center border border-white/20 relative z-10">
            <div className="flex flex-col">
              <span className="font-sans text-[20px] text-white/60 line-through decoration-[#ea3f9d] decoration-2 font-bold">2990</span>
              <span className={`${cocomatClass} text-[22px] font-black text-white`}>БЕСПЛАТНО</span>
            </div>
            <div className="text-center">
              <div className="text-[28px] font-bold text-white tabular-nums flex items-center justify-center">
                <span>{displayMins}</span>
                <span className="mx-1">:</span>
                <span>{displaySecs}</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 relative z-10">
            <input type="text" placeholder="Ваше Имя" value={name} onChange={handleNameChange} className="w-full h-14 bg-white rounded-full px-8 text-black font-sans text-lg focus:outline-none" />
            <input type="tel" value={phone} onChange={handlePhoneChange} className="w-full h-14 bg-white rounded-full px-8 text-black font-sans text-lg focus:outline-none" />
            <button type="submit" className={`${cocomatClass} w-full bg-[#e62010] text-white font-black text-[22px] py-4 rounded-full mt-2 shadow-xl ${btnAnimation}`}>ПРИНЯТЬ УЧАСТИЕ</button>
          </form>
          <div className="absolute bottom-[10%] right-[-10px] w-20 h-20 rotate-[15deg] opacity-50 z-0"><Image src="/images/wb-icon.png" alt="WB" fill className="object-contain" /></div>
        </section>

        {/* ПОДВАЛ */}
        <footer className="bg-white py-12 px-6 flex flex-col items-center justify-center text-center">
          <div className="font-sans text-[#fc60b1] text-[12px] leading-relaxed font-medium uppercase space-y-5">
            <p>ИП Левшунова Ирина Борисовна ИНН<br/>615429347160</p>
            <Link href="/privacy" className="underline underline-offset-2">Договор оферты</Link>
          </div>
        </footer>

      </div>
    </main>
  );
}