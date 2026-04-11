import { GoogleLogin } from "@react-oauth/google";
import useLanguage from "../../hooks/useLanguageHook/useLanguage";
import useSnackbar from "../../hooks/useSnackbarHook/useSnackbar";
import useAuth from "../../hooks/useAuthHook/useAuth";
import { getClothMessages } from "../../i18n/cloth";

const Login = () => {
  const { lang } = useLanguage();
  const { login } = getClothMessages(lang);
  const { showSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading, loginWithSocial } =
    useAuth();
  // Redirect if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      showSnackbar({
        message:
          lang === "fr"
            ? "Google n'a pas renvoyé de token"
            : "Google did not return a token",
        type: "error",
      });
      return;
    }

    try {
      const token = credentialResponse.credential;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const providerId = payload.sub;
      const email = payload.email;

      if (!providerId || !email) throw new Error("Missing Google payload data");

      await loginWithSocial("GOOGLE", providerId, email);
    } catch (error) {
      console.error("Google auth error:", error);
      showSnackbar({
        message:
          lang === "fr"
            ? "Échec de l'authentification Google"
            : "Google authentication failed",
        type: "error",
      });
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {lang === "fr" ? "Chargement..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {lang === "fr" ? "Se connecter" : "Sign in"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {lang === "fr"
              ? "Accédez à votre compte Knovia"
              : "Access your Knovia account"}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              showSnackbar({
                message:login.googleLoginError,
                type: "error",
              });
            }}
            text={"signin_with"}
          />
{/* 
          <button
            type="button"
            onClick={handleAppleLogin}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {lang === "fr" ? "Continuer avec Apple" : "Continue with Apple"}
          </button>

          <button
            type="button"
            onClick={handleTwitterLogin}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {lang === "fr" ? "Continuer avec Twitter" : "Continue with Twitter"}
          </button> */}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              {lang === "fr" ? "Ou" : "Or"}
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        {/* <form className="space-y-6" onSubmit={handleEmailPasswordSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              {lang === "fr" ? "Adresse email" : "Email address"}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
              placeholder={lang === "fr" ? "Adresse email" : "Email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              {lang === "fr" ? "Mot de passe" : "Password"}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
              placeholder={lang === "fr" ? "Mot de passe" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : isLoginMode ? (
                lang === "fr" ? (
                  "Se connecter"
                ) : (
                  "Sign in"
                )
              ) : lang === "fr" ? (
                "S'inscrire"
              ) : (
                "Sign up"
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {isLoginMode
                ? lang === "fr"
                  ? "Pas de compte ? S'inscrire"
                  : "No account? Sign up"
                : lang === "fr"
                  ? "Déjà un compte ? Se connecter"
                  : "Already have an account? Sign in"}
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default Login;
