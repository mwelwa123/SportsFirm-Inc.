import React from "react";

const Button = React.forwardRef(({
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}, ref) => {

  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const variantClasses = {
    default:     "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline:     "border-2 border-current bg-transparent hover:bg-white/10",
    secondary:   "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost:       "bg-transparent hover:bg-gray-100 hover:text-gray-900",
    link:        "text-blue-600 underline-offset-4 hover:underline bg-transparent",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm:      "h-9 px-3 text-xs",
    lg:      "h-11 px-8 text-base",
    icon:    "h-10 w-10",
  };

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`;

  if (asChild) {
    return React.cloneElement(children, {
      className: `${classes} ${children.props.className || ""}`.trim(),
      ref,
      ...props,
    });
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
 