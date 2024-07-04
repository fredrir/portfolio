interface Props {
  title: string;
  color: "white" | "green";
  size?: "small";
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: Props) => {
  let colorClasses = "";
  let sizeClasses = "";

  // if (props.color === "blue") {
  //   colorClasses =
  //     "border bg-portfolio-darkBlue text-portfolio-snowWhite hover:text-portfolio-lightGreen dark:bg-inherit dark:text-green-500 dark:hover:text-portfolio-lightGreen dark:border-green-500 dark:hover:border-portfolio-lightGreen";
  // }
  if (props.color === "white") {
    colorClasses =
      "bg-portfolio-white text-online-darkBlue hover:text-portfolio-darkBlue border dark:bg-gray-900 dark:text-white dark:hover:text-gray-300 dark:hover:border-gray-300";
  } else if (props.color === "green") {
    colorClasses =
      "bg-portfolio-lightGreen text-black hover:text-portfolio-darkBlue border dark:bg-gray-900 dark:text-green-500 dark:hover:text-green-300 dark:hover:border-portfolio-snowWhite dark:border-green-500 dark:hover:border-green-300";
  }

  if (props.size === "small") {
    sizeClasses = "px-5 py-2.5 text-sm";
  } else {
    sizeClasses = "px-6 py-3";
  }

  const className = `font-medium text-center justify-center transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-1.5 ${colorClasses} ${sizeClasses}`;

  return (
    <button type="button" onClick={props.onClick} className={className}>
      {props.title}
      {props.icon}
    </button>
  );
};

export default Button;
