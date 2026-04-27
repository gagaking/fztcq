import * as React from 'react';
import { cn } from '../lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1 p-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight text-gray-900", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700", className)} {...props} />
));
Label.displayName = "Label";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' }>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
  };
  return (
    <button ref={ref} className={cn("inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2", variants[variant], className)} {...props} />
  )
});
Button.displayName = "Button";

export const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input type="range" ref={ref} className={cn("w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900", className)} {...props} />
));
Slider.displayName = "Slider";

export const SelectGrid = ({ options, value, onChange, multi = false }: { options: string[], value: string | string[], onChange: (val: any) => void, multi?: boolean }) => {
  const isSelected = (opt: string) => multi ? (value as string[]).includes(opt) : value === opt;
  const toggle = (opt: string) => {
    if (multi) {
      const val = value as string[];
      onChange(val.includes(opt) ? val.filter(v => v !== opt) : [...val, opt]);
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200",
            isSelected(opt)
              ? "bg-indigo-50 border-indigo-200 border text-indigo-700 shadow-sm scale-105"
              : "bg-gray-50 border border-transparent text-gray-600 hover:bg-gray-100"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
