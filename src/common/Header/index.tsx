import { H1, H2 } from "./styled";

interface HeaderProps {
  title: string;
  sub?: boolean;
  sub2?: boolean;
}

export const Header = ({ title, sub, sub2 }: HeaderProps) => (
  <header>
    {sub || sub2 ? <H2 $sub2={!!sub2}>{title}</H2> : <H1>{title}</H1>}
  </header>
);
