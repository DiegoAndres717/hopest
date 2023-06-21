import { FC } from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType
  onClick: () => void;
}

const AuthSocialButton: FC<AuthSocialButtonProps> = ({ 
  icon: Icon,
  onClick,
}) => {
  return ( 
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        w-full 
        mt-2
        justify-center 
        rounded-md 
        bg-white 
        px-4 
        py-2 
        text-blue-400 
        shadow-sm 
        ring-1 
        ring-inset 
        ring-gray-300 
        hover:bg-gray-50 
        focus:outline-offset-0
      "
    >
      <Icon />
    </button>
   );
}
 
export default AuthSocialButton;