interface HeaderProps {
  title: string;
  sub?: boolean;
}

export const Header = ({ title, sub }: HeaderProps) => (
  <header>{sub ? <h2>{title}</h2> : <h1>{title}</h1>}</header>
);
