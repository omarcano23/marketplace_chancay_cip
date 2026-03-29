import { SignUp } from '@clerk/react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/login"
        fallbackRedirectUrl="/registro"
        forceRedirectUrl="/registro"
      />
    </div>
  );
};

export default SignUpPage;
