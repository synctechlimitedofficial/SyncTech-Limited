import type { SVGProps } from "react";
import type { ServiceId } from "@/lib/services";

type IconProps = SVGProps<SVGSVGElement>;

/** Shared stroke geometry so every icon reads as one family. */
function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Service icons                                                              */
/* -------------------------------------------------------------------------- */

export function WebIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="2.5" y="3.5" width="19" height="15" rx="2.5" />
      <path d="M2.5 8h19" />
      <circle cx="5.6" cy="5.75" r=".7" fill="currentColor" stroke="none" />
      <circle cx="8" cy="5.75" r=".7" fill="currentColor" stroke="none" />
      <path d="M9.6 11.6 7.4 13.4l2.2 1.8M14.4 11.6l2.2 1.8-2.2 1.8" />
      <path d="M8 21.5h8" />
    </Base>
  );
}

export function MobileIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10.5 5.2h3" />
      <path d="M9.5 18.6h5" />
      <path d="M9 9.5h6M9 12.5h4" opacity=".55" />
    </Base>
  );
}

export function AiIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="4.5" cy="6" r="1.7" />
      <circle cx="4.5" cy="18" r="1.7" />
      <circle cx="19.5" cy="6" r="1.7" />
      <circle cx="19.5" cy="18" r="1.7" />
      <path d="m6 6.9 4.2 3.6M6 17.1l4.2-3.6M18 6.9l-4.2 3.6M18 17.1l-4.2-3.6" />
    </Base>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 12.5a4 4 0 0 1 7.7-1.5 3.2 3.2 0 0 1 4 3 3 3 0 0 1-3 3.2H7.4A3.4 3.4 0 0 1 7 12.5Z" />
      <rect x="3.5" y="18.5" width="17" height="3.2" rx="1.2" />
      <path d="M6.6 20.1h.01M9.2 20.1h.01" />
    </Base>
  );
}

export function SecurityIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.6 4.5 5.7v6.1c0 4.4 3.1 8.4 7.5 9.6 4.4-1.2 7.5-5.2 7.5-9.6V5.7Z" />
      <path d="m8.9 12.1 2.2 2.3 4-4.6" />
    </Base>
  );
}

export function MaintenanceIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20.2 5.6a4.6 4.6 0 0 1-6.1 6.1L5.9 19.9a2 2 0 0 1-2.8-2.8l8.2-8.2a4.6 4.6 0 0 1 6.1-6.1l-3 3 2.8 2.8Z" />
      <path d="M5.3 18.7h.01" />
    </Base>
  );
}

const serviceIcons: Record<ServiceId, (p: IconProps) => React.JSX.Element> = {
  web: WebIcon,
  mobile: MobileIcon,
  ai: AiIcon,
  cloud: CloudIcon,
  security: SecurityIcon,
  maintenance: MaintenanceIcon,
};

export function ServiceIcon({
  id,
  ...props
}: IconProps & { id: ServiceId }) {
  const Icon = serviceIcons[id];
  return <Icon {...props} />;
}

/* -------------------------------------------------------------------------- */
/* UI icons                                                                    */
/* -------------------------------------------------------------------------- */

export function ArrowRightIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.7} {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </Base>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.7} {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.6} {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.6} {...props}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </Base>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.7} {...props}>
      <path d="m5.5 9 6.5 6.5L18.5 9" />
    </Base>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity=".25"
        strokeWidth="2.4"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.6} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.2M12 16.4h.01" />
    </Base>
  );
}
