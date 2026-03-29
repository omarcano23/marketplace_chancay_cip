import { SignIn } from '@clerk/react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/signup"
        fallbackRedirectUrl="/post-auth"
        forceRedirectUrl="/post-auth"
      />
    </div>
  );
};

export default LoginPage;
