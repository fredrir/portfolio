interface Props {
  title: string;
  href: string;
  className?: string;
}

const HeaderText = ({ title, href, className }: Props) => {
  return (
    <div className={className}>
      <a href={href}>
        <div className="mt-4 w-fit rounded-3xl border-2 border-gray-400 border-solid px-4 py-2 text-center dark:border-gray-600 dark:text-white">
          <h1 className="font-bold text-4xl">{title}</h1>
        </div>
      </a>
    </div>
  );
};

export default HeaderText;
