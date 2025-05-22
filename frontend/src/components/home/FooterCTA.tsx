import "../../styles/main.css";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FooterCTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-b from-green-600 to-green-700 text-white text-center py-16">
      <h2 className="text-3xl md:text-5xl font-bold mb-4">
        {t('home.footerCTA.title')}
      </h2>
      <p className="font-light text-sm md:text-lg mb-8">
        {t('home.footerCTA.description')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="/auth/registration/"
          className="bg-white text-lime-700 font-semibold px-8 py-3 rounded-lg shadow transition hover:scale-105"
          onClick={e => {
            e.preventDefault();
            navigate('/auth/login/');
          }}
        >
          {t('home.footerCTA.buttonText1')}
        </a>
        <a
          href="#"
          className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-lime-700 transition hover:scale-105"
        >
          {t('home.footerCTA.buttonText2')}
        </a>
      </div>
    </section>
  );
};

export default FooterCTA;
