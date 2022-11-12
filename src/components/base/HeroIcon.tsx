// import dynamic from "next/dynamic";
import { ComponentType } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/20/solid';
import { IconName } from '../../types/Icon';

type Props = {
  name: IconName;
  className?: string;
  outline?: boolean;
};

const HeroIcon = ({ name, className = '', outline = false }: Props) => {
  // const Icon: ComponentType<{ className: string }> = outline
  //   ? dynamic(() => import("@heroicons/react/outline").then((mod) => mod[name]))
  //   : dynamic(() => import("@heroicons/react/solid").then((mod) => mod[name]));

  const { ...icons } = outline ? OutlineIcons : SolidIcons;
  const Icon: ComponentType<{ className: string }> = icons[name];

  return <Icon className={className} aria-hidden={true} />;
};

export default HeroIcon;
