import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';
import useLanguage from '../../hooks/useLanguage/useLanguage';
import useSnackbar from '../../hooks/useSnackbar/useSnackbar';
import { getClothMessages } from '../../i18n/cloth';

interface ProtectedCreateButtonProps {}

const ProtectedCreateButton = ({}: ProtectedCreateButtonProps) => {
  const { lang } = useLanguage();
  const { common } = getClothMessages(lang);
  const { isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleClick = () => {
    if (!isAuthenticated) {
      showSnackbar({
        message: lang === 'fr' ? 'Connectez-vous pour créer une toile' : 'Log in to create a canvas',
        type: 'INFO',
      });
      return;
    }
  };

  return (
    <Link
      to="/cloth/new"
      onClick={handleClick}
      className={`mb-3 rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
        isAuthenticated 
          ? 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400' 
          : 'bg-zinc-400 cursor-not-allowed dark:bg-zinc-600 hidden'
      }`}
    >
      {lang === 'fr' ? 'Créer une toile' : 'Create cloth'}
    </Link>
  );
};

export default ProtectedCreateButton;

