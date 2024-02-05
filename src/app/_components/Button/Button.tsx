import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ButtonProps {
  type: 'solid' | 'outline';
	className?: string | undefined;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
	disabled?: boolean | undefined;
	href?: string | undefined;
	target?: React.HTMLAttributeAnchorTarget | undefined;
}
const GENERAL_STYLE = 'w-full h-12 text-buttonmb font-SourceSanPro rounded text-center';
const SOLID_STYLE= 'text-primary011 bg-btn-default hover:bg-btn-hover preesed:bg-btn-pressed border-none';
const OUTLINE_STYLE= 'text-btn-default border border-btn-default hover:bg-hover pressed:bg-pressed';
const DISABLED_STYLE = 'opacity-50 cursor-not-allowed'

const Button: React.FC<ButtonProps> = ({ type, className, label, onClick, disabled, href, target }) => {
  return (
		<>
		{href ? 
			<Link className={`${className} ${GENERAL_STYLE}
					${type === 'solid' ? SOLID_STYLE : OUTLINE_STYLE}
					${disabled && DISABLED_STYLE}`} 
				href={href}
				target={target}
			>
				{label}
			</Link> 
		:
			<button
				className={`${className} ${GENERAL_STYLE}
					${type === 'solid' ? SOLID_STYLE : OUTLINE_STYLE}
					${disabled && DISABLED_STYLE}`}
				onClick={onClick}
				disabled={disabled}
				>
				{label}
			</button>
		}
	</>
  );
};

export default Button;
