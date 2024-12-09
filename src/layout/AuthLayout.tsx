import { ReactNode } from "react";

const AuthLayout: React.FC<{ children: ReactNode }> = ({children}) => {

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
        <main className="min-h-screen">{children}</main>
      </div>
    );

}

export default AuthLayout;