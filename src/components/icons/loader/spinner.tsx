// prettier-ignore
const LoaderSpinner = () => (
  <svg
    viewBox="0 0 130 130"
    className="absolute inset-0 h-full w-full animate-spin"
    style={{ animationDuration: '2s' }}
    overflow="visible"
  >
    <defs>
      <linearGradient id="arcGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A1BAEA" />
        <stop offset="100%" stopColor="#326AD1" />
      </linearGradient>
      <linearGradient id="starGradient1" x1="13.4355" y1="12.6908" x2="2.8213" y2="3.56175" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A1BAEA" />
        <stop offset="1" stopColor="#326AD1" />
      </linearGradient>
      <linearGradient id="starGradient2" x1="10.0657" y1="9.58688" x2="3.24226" y2="3.71822" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A1BAEA" />
        <stop offset="1" stopColor="#326AD1" />
      </linearGradient>
      <filter id="starBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>

    <circle cx="65" cy="65" r="55" fill="none" stroke="url(#arcGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="220 125" strokeDashoffset="0" style={{ filter: 'drop-shadow(0px 0px 4px #769BE0)' }} />

    <g transform="translate(14, 17)">
      <path d="M12.1255 10.327C12.5755 11.139 11.7725 12.0726 10.9024 11.7491L8.75996 10.9527C8.4864 10.851 8.18205 10.8739 7.92678 11.0154L5.92761 12.1233C5.11565 12.5733 4.18207 11.7704 4.50553 10.9003L5.30195 8.75782C5.40364 8.48426 5.38075 8.17991 5.23927 7.92464L4.1313 5.92546C3.68131 5.11351 4.48426 4.17993 5.3544 4.50339L7.49683 5.29981C7.7704 5.4015 8.07474 5.37861 8.33001 5.23713L10.3292 4.12916C11.1411 3.67917 12.0747 4.48212 11.7513 5.35226L10.9548 7.49469C10.8531 7.76825 10.876 8.0726 11.0175 8.32787L12.1255 10.327Z" fill="url(#starGradient1)" filter="url(#starBlur)" />
    </g>

    <g transform="translate(23, 11)">
      <path d="M9.22353 8.06734C9.51281 8.58931 8.99662 9.18947 8.43725 8.98153L7.05998 8.46955C6.88411 8.40418 6.68846 8.41889 6.52436 8.50984L5.23918 9.22211C4.71721 9.51139 4.11705 8.9952 4.32498 8.43583L4.83697 7.05856C4.90234 6.88269 4.88762 6.68704 4.79667 6.52294L4.08441 5.23776C3.79513 4.71579 4.31131 4.11563 4.87069 4.32356L6.24796 4.83555C6.42383 4.90092 6.61947 4.8862 6.78358 4.79525L8.06876 4.08299C8.59073 3.79371 9.19089 4.30989 8.98295 4.86927L8.47097 6.24654C8.4056 6.42241 8.42031 6.61805 8.51126 6.78216L9.22353 8.06734Z" fill="url(#starGradient2)" filter="url(#starBlur)" />
    </g>

    <g transform="translate(34, 17)">
      <path d="M9.22353 8.06734C9.51281 8.58931 8.99662 9.18947 8.43725 8.98153L7.05998 8.46955C6.88411 8.40418 6.68846 8.41889 6.52436 8.50984L5.23918 9.22211C4.71721 9.51139 4.11705 8.9952 4.32498 8.43583L4.83697 7.05856C4.90234 6.88269 4.88762 6.68704 4.79667 6.52294L4.08441 5.23776C3.79513 4.71579 4.31131 4.11563 4.87069 4.32356L6.24796 4.83555C6.42383 4.90092 6.61947 4.8862 6.78358 4.79525L8.06876 4.08299C8.59073 3.79371 9.19089 4.30989 8.98295 4.86927L8.47097 6.24654C8.4056 6.42241 8.42031 6.61805 8.51126 6.78216L9.22353 8.06734Z" fill="url(#starGradient2)" filter="url(#starBlur)" />
    </g>
  </svg>
)

export default LoaderSpinner;
