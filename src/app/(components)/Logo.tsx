// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

type LogoProps = {
  className?: string;
};

/**
 * Logo component displaying the brand name with accent colors.
 * @param className - Additional CSS classes.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`font-bold tracking-tight text-2xl md:text-3xl ${className}`}>
  <span className="text-accent">verde</span>
  <span className="text-text-muted">back</span>
    </span>
  );
}