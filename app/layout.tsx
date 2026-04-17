import './globals.css';
import localFont from 'next/font/local';

const cocomat = localFont({
  src: [
    {
      path: '../public/fonts/cocomatpro-bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/CocomatLight.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-cocomat',
});

const mont = localFont({
  src: [
    {
      path: '../public/fonts/ofont.ru_Mont.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-mont',
});

export const metadata = {
  title: 'Курс по Wildberries',
  description: 'Бесплатный практический курс от Ирины Левшуновой',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${cocomat.variable} ${mont.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}