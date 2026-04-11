import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuthHook/useAuth';
import useLanguage from '../../hooks/useLanguageHook/useLanguage';
import useSnackbar from '../../hooks/useSnackbarHook/useSnackbar';


const ProtectedCreateButton = () => {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleClick = () => {
    if (!isAuthenticated) {
      showSnackbar({
        message: lang === 'fr' ? 'Connectez-vous pour créer une toile' : 'Log in to create a canvas',
        type: 'info',
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

